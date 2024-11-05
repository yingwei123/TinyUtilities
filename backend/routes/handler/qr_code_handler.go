package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"tiny/backend/pkg"

	"github.com/skip2/go-qrcode"
)

type QRCodeRequest struct {
	Type  string      `json:"type"`
	URL   string      `json:"url,omitempty"`
	VCard interface{} `json:"vcard,omitempty"`
	Text  string      `json:"text,omitempty"`
	Email interface{} `json:"email,omitempty"`
	SMS   interface{} `json:"sms,omitempty"`
}

func QrCodeHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req QRCodeRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request body: "+err.Error(), http.StatusBadRequest)
			return
		}

		println(fmt.Sprintf("%+v", req))

		var content string
		switch req.Type {
		case "url":
			content = req.URL
		case "vcard":
			content = formatVCard(req.VCard)
		case "text":
			content = req.Text
		case "email":
			content = formatEmail(req.Email)
		case "sms":
			content = formatSMS(req.SMS)
		default:
			http.Error(w, "Invalid QR code type: "+req.Type, http.StatusBadRequest)
			return
		}

		// Generate the QR code image bytes
		qrCodeBytes, err := pkg.GenerateQrCode(content, qrcode.Medium)
		if err != nil {
			http.Error(w, "Failed to generate QR code: "+err.Error(), http.StatusInternalServerError)
			return
		}

		// Return the image data to the client
		w.Header().Set("Content-Type", "image/png")
		w.Write(qrCodeBytes)
	}
}

// Helper functions to format different QR code types
func formatVCard(data interface{}) string {
	vcard, ok := data.(map[string]interface{})
	if !ok {
		return ""
	}

	var result strings.Builder
	result.WriteString("BEGIN:VCARD\nVERSION:3.0\n")

	if fn, ok := vcard["firstName"].(string); ok {
		if ln, ok := vcard["lastName"].(string); ok {
			result.WriteString(fmt.Sprintf("FN:%s %s\n", fn, ln))
			result.WriteString(fmt.Sprintf("N:%s;%s;;;\n", ln, fn))
		}
	}

	if phone, ok := vcard["phone"].(string); ok {
		result.WriteString(fmt.Sprintf("TEL:%s\n", phone))
	}

	if email, ok := vcard["email"].(string); ok {
		result.WriteString(fmt.Sprintf("EMAIL:%s\n", email))
	}

	if company, ok := vcard["company"].(string); ok {
		result.WriteString(fmt.Sprintf("ORG:%s\n", company))
	}

	if job, ok := vcard["job"].(string); ok {
		result.WriteString(fmt.Sprintf("TITLE:%s\n", job))
	}

	address := []string{
		getStringValue(vcard, "street"),
		getStringValue(vcard, "street2"),
		getStringValue(vcard, "city"),
		getStringValue(vcard, "state"),
		getStringValue(vcard, "zipcode"),
		getStringValue(vcard, "country"),
	}
	if !allEmpty(address) {
		result.WriteString(fmt.Sprintf("ADR:;;%s;%s;%s;%s;%s\n",
			address[0], address[2], address[3], address[4], address[5]))
	}

	if website, ok := vcard["website"].(string); ok {
		result.WriteString(fmt.Sprintf("URL:%s\n", website))
	}

	result.WriteString("END:VCARD")
	return result.String()
}

func formatEmail(data interface{}) string {
	email, ok := data.(map[string]interface{})
	if !ok {
		return ""
	}

	var result strings.Builder
	result.WriteString("mailto:")

	if address, ok := email["address"].(string); ok {
		result.WriteString(address)
	}

	var params []string
	if subject, ok := email["subject"].(string); ok && subject != "" {
		params = append(params, "subject="+subject)
	}
	if message, ok := email["message"].(string); ok && message != "" {
		params = append(params, "body="+message)
	}

	if len(params) > 0 {
		result.WriteString("?" + strings.Join(params, "&"))
	}

	return result.String()
}

func formatSMS(data interface{}) string {
	sms, ok := data.(map[string]interface{})
	if !ok {
		return ""
	}

	var result strings.Builder
	result.WriteString("sms:")

	if number, ok := sms["number"].(string); ok {
		result.WriteString(number)
	}

	if message, ok := sms["message"].(string); ok && message != "" {
		result.WriteString("?body=" + message)
	}

	return result.String()
}

// Helper function to get string value from map
func getStringValue(m map[string]interface{}, key string) string {
	if val, ok := m[key].(string); ok {
		return val
	}
	return ""
}

// Helper function to check if all strings in a slice are empty
func allEmpty(ss []string) bool {
	for _, s := range ss {
		if s != "" {
			return false
		}
	}
	return true
}
