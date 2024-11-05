import React, { useState, useCallback } from 'react';
import Grid from '@mui/material/Grid2';
import ApiClient from '../../ApiClient';

const TinyURLContent = () => {
    const [formData, setFormData] = useState({
        longUrl: '',
        alias: '',
        name: ''
    });
    const [tinyUrl, setTinyUrl] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [aliasAvailability, setAliasAvailability] = useState(null);
    const [isCheckingAlias, setIsCheckingAlias] = useState(false);
    const [aliasAvailable, setAliasAvailable] = useState(null);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setTinyUrl('');
        setIsSubmitting(true);

        if (!formData.longUrl) {
            setError('Please enter a URL to shorten');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await ApiClient.makePostRequest('/url', {
                original_url: formData.longUrl,
                alias: formData.alias,
                name: formData.name
            });
            setTinyUrl(response.data.tiny_url);
        } catch (err) {
            setError('Error creating tiny URL. Please try again.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const checkAliasAvailability = async () => {
        if (!formData.alias) {
            setAliasAvailability('Please enter an alias to check');
            setAliasAvailable(null);
            return;
        }

        setIsCheckingAlias(true);
        setAliasAvailability(null);
        setAliasAvailable(null);

        try {
            const response = await ApiClient.makePostRequest('/url/alias', {
                alias: formData.alias
            });

            setAliasAvailable(response.data.available);
            if (response.data.available) {
                setAliasAvailability('Alias is available');
            } else {
                setAliasAvailability('Alias is not available');
            }
        } catch (err) {
            console.error('Error checking alias:', err); 
            setAliasAvailability('Error checking alias availability');
            setAliasAvailable(null);
        } finally {
            setIsCheckingAlias(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} aria-labelledby="form-title" className="card">
            <h1 id="form-title">Create a Tiny URL</h1>
            <div className="main-content-container">
                <Grid container direction="column" spacing={2}>
                    <Grid item={true}>
                        <label htmlFor="longUrl" className="content-label">Shorten a long URL</label>
                        <div className="input-container">
                            <input
                                id="longUrl"
                                className='tiny-content-input'
                                placeholder='URL to shorten'
                                name="longUrl"
                                value={formData.longUrl}
                                onChange={handleInputChange}
                                required
                                aria-required="true"
                                aria-invalid={error && !formData.longUrl ? "true" : "false"}
                                style={{ height: '40px', boxSizing: 'border-box' }}
                            />
                        </div>
                    </Grid>

                    <Grid item={true}>
                        <label htmlFor="alias" className="content-label">Choose a 5 character alias (optional)</label>
                        <div className="input-container" style={{ 
                            display: 'flex', 
                            justifyContent: 'center', // Center the contents horizontally
                            alignItems: 'center', 
                            gap: '10px',
                            height: '40px' // Adjust this to match the height of other inputs
                        }}>
                            <div style={{ position: 'relative', width: '80px' }}>
                                <input
                                    id="alias"
                                    className='tiny-content-input'
                                    placeholder='alias'
                                    name="alias"
                                    value={formData.alias}
                                    onChange={handleInputChange}
                                    maxLength={5}
                                    aria-describedby="alias-description"
                                    style={{ 
                                        width: '100%',
                                        height: '40px', // Adjust this to match the height of other inputs
                                        boxSizing: 'border-box'
                                    }}
                                />
                                {aliasAvailable !== null && (
                                    <span style={{
                                        position: 'absolute',
                                        right: '5px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        fontSize: '1.2em',
                                        color: aliasAvailable ? 'green' : 'red'
                                    }}>
                                        {aliasAvailable ? '✓' : '✗'}
                                    </span>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={checkAliasAvailability}
                                disabled={isCheckingAlias}
                                className="tiny-content-input"
                                style={{ 
                                    padding: '2px 8px', 
                                    fontSize: '0.7em', 
                                    whiteSpace: 'nowrap',
                                    cursor: 'pointer',
                                    border: 'none',
                                    borderRadius: '4px',
                                    backgroundColor: '#f0f0f0',
                                    color: '#333',
                                    transition: 'background-color 0.3s',
                                    flexShrink: 0,
                                    height: '40px', // Adjust this to match the height of other inputs
                                    width: 'auto'
                                }}
                            >
                                {isCheckingAlias ? 'Checking...' : 'Check'}
                            </button>
                        </div>
                        {aliasAvailability && (
                            <div 
                                className="alias-availability" 
                                role="status"
                                style={{ 
                                    color: aliasAvailable ? 'green' : 'red',
                                    marginTop: '5px',
                                    textAlign: 'center' // Center the availability message
                                }}
                            >
                                {aliasAvailability}
                            </div>
                        )}
                    </Grid>

                    <Grid item={true}>
                        <label htmlFor="name" className="content-label">Name the TinyURL</label>
                        <div className="input-container">
                            <input
                                id="name"
                                className='tiny-content-input'
                                placeholder='URL name'
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                aria-required="true"
                                style={{ height: '40px', boxSizing: 'border-box' }}
                            />
                        </div>
                    </Grid>

                    <Grid item={true} className="util-btn">
                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Shortening...' : 'Shorten URL'}
                        </button>
                    </Grid>

                    {error && (
                        <Grid item={true} className="error-message" role="alert">
                            {error}
                        </Grid>
                    )}

                    {tinyUrl && (
                        <Grid item={true} className="tiny-url-result" role="status">
                            Your TinyURL: <a href={tinyUrl} target="_blank" rel="noopener noreferrer">{tinyUrl}</a>
                        </Grid>
                    )}
                </Grid>
            </div>
        </form>
    );
};

export default TinyURLContent;