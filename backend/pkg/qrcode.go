package pkg

import (
	"errors"
	"fmt"

	qrcode "github.com/skip2/go-qrcode"
)

var versionCapacities = map[qrcode.RecoveryLevel][]int{
	qrcode.Low:    {25, 47, 77, 114, 154, 195, 224, 279, 335, 395}, // Versions 1-10
	qrcode.Medium: {20, 38, 61, 90, 122, 154, 178, 221, 262, 311},  // Versions 1-10
	qrcode.High:   {10, 20, 35, 50, 64, 84, 93, 122, 143, 174},     // Versions 1-10
}

const minModuleSize = 10 // Minimum module size in pixels

// GenerateQrCode generates a QR code for the provided content and returns the image as []byte
func GenerateQrCode(content string, correction qrcode.RecoveryLevel) ([]byte, error) {
	if len(content) == 0 {
		return nil, errors.New("content cannot be empty")
	}

	// Determine the appropriate QR code version
	version, err := determineQRCodeVersion(len(content), correction)
	if err != nil {
		return nil, err
	}

	qrCodeBytes, err := qrcode.Encode(content, correction, calculateQRCodeSize(version))
	if err != nil {
		return nil, fmt.Errorf("failed to generate QR code: %v", err)
	}

	return qrCodeBytes, nil
}

// determineQRCodeVersion determines the QR code version based on content length and correction level
func determineQRCodeVersion(contentLength int, correction qrcode.RecoveryLevel) (int, error) {
	for version, capacity := range versionCapacities[correction] {
		if contentLength <= capacity {
			return version + 1, nil // Versions are 1-based, but array indices are 0-based
		}
	}
	return 0, fmt.Errorf("content length (%d) does not fit any valid QR code version with correction level %v", contentLength, correction)
}

// calculateQRCodeSize calculates the QR code size based on the version
func calculateQRCodeSize(version int) int {
	// Calculate the number of modules in the QR code
	modules := version*4 + 17

	// Return the calculated QR code size
	return modules * minModuleSize
}
