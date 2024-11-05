import React, { useState, useCallback } from 'react';
import TopNav from './components/TopNav';
import TinyURLContent from './components/content/TinyURLContent';
import TinyURLDisplay from './components/content/TinyURLDisplay';
import QRCodeContent from './components/content/QRCodeContent';
import QrCodeDisplay from './components/content/QrCodeDisplay';

const HomePage = ({ activeContent, onContentChange }) => {
    const [qrCodeImage, setQRCodeImage] = useState(null);
    const [handleDownload, setHandleDownload] = useState(null);
    const [tinyUrl, setTinyUrl] = useState(null);

    const handleQRCodeGenerated = useCallback((imageUrl, downloadFunction) => {
        setQRCodeImage(imageUrl);
        setHandleDownload(() => downloadFunction);
    }, []);

    const handleTinyUrlGenerated = useCallback((url) => {
        setTinyUrl(url);
    }, []);

    const handleCopyTinyUrl = () => {
        navigator.clipboard.writeText(tinyUrl).then(() => {
            alert('TinyURL copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    return (
        <div className="home-page">
            <TopNav onContentChange={onContentChange} />
            <div className="main-content">
                <div className="content-wrapper">
                    <div className="card-container">
                        {activeContent === 'tinyurl' ? (
                            <TinyURLContent onTinyUrlGenerated={handleTinyUrlGenerated} />
                        ) : (
                            <QRCodeContent onQRCodeGenerated={handleQRCodeGenerated} />
                        )}
                    </div>
                    {activeContent === 'tinyurl' && tinyUrl && (
                        <div className="card-container tiny-url-display-container">
                            <TinyURLDisplay 
                                tinyUrl={tinyUrl}
                                handleCopy={handleCopyTinyUrl}
                            />
                        </div>
                    )}
                    {activeContent === 'qrcode' && qrCodeImage && (
                        <div className="card-container qr-display-container">
                            <QrCodeDisplay 
                                qrCodeImage={qrCodeImage}
                                handleDownload={handleDownload}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomePage;