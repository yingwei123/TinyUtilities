import React from 'react';
import Grid from '@mui/material/Grid2';

const QrCodeDisplay = ({ qrCodeImage, handleDownload }) => {
    return (
        <div className="card">
            <h2>Generated QR Code</h2>
            <div className="main-content-container width100">
                {qrCodeImage ? (
                    <Grid container direction="column" spacing={2} alignItems="center">
                        <Grid item={true} className="qr-code-image-container">
                            <img 
                                src={qrCodeImage} 
                                alt="Generated QR Code" 
                                onLoad={() => URL.revokeObjectURL(qrCodeImage)}
                                className="qr-code-image"
                            />
                        </Grid>
                        <Grid item={true}>
                            <button onClick={handleDownload} className="download-button">
                                Download QR Code
                            </button>
                        </Grid>
                    </Grid>
                ) : (
                    <p>No QR code generated yet. Use the form to create one.</p>
                )}
            </div>
        </div>
    );
};

export default QrCodeDisplay;
