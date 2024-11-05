import React from 'react';
import Grid from '@mui/material/Grid2';

const TinyURLDisplay = ({ tinyUrl, handleCopy }) => {
    return (
        <div className="card">
            <h2>Generated TinyURL</h2>
            <div className="main-content-container width100">
                {tinyUrl ? (
                    <Grid container direction="column" spacing={2} alignItems="center">
                        <Grid item={true} className="tiny-url-container">
                            <a href={tinyUrl} target="_blank" rel="noopener noreferrer" className="tiny-url-link">
                                {tinyUrl}
                            </a>
                        </Grid>
                        <Grid item={true}>
                            <button onClick={handleCopy} className="copy-button">
                                Copy TinyURL
                            </button>
                        </Grid>
                    </Grid>
                ) : (
                    <p>No TinyURL generated yet. Use the form to create one.</p>
                )}
            </div>
        </div>
    );
};

export default TinyURLDisplay;
