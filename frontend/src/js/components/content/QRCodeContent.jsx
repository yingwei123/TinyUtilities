import React, { useState, useCallback, useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import ApiClient from '../../ApiClient';

const QR_CODE_TYPES = [
    { value: 'url', label: 'URL' },
    { value: 'vcard', label: 'vCard' },
    { value: 'text', label: 'Plain Text' },
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'SMS' },
];

const QRCodeContent = ({ onQRCodeGenerated }) => {
    const [formData, setFormData] = useState({
        type: 'url',
        url: '',
        vcard: {
            firstName: '', lastName: '', phone: '', email: '', company: '', job: '',
            street: '', street2: '', city: '', state: '', zipcode: '', country: '', website: ''
        },
        text: '',
        email: { address: '', subject: '', message: '' },
        sms: { number: '', message: '' }
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prevState => {
            if (name.includes('.')) {
                const [objName, key] = name.split('.');
                return { ...prevState, [objName]: { ...prevState[objName], [key]: value } };
            }
            return { ...prevState, [name]: value };
        });
    }, []);

    // Clear inputs and QR code when type changes
    useEffect(() => {
        setFormData(prevState => ({
            ...prevState,
            url: '',
            vcard: {
                firstName: '', lastName: '', phone: '', email: '', company: '', job: '',
                street: '', street2: '', city: '', state: '', zipcode: '', country: '', website: ''
            },
            text: '',
            email: { address: '', subject: '', message: '' },
            sms: { number: '', message: '' }
        }));
        onQRCodeGenerated(null, null); // Clear the QR code
    }, [formData.type, onQRCodeGenerated]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const response = await ApiClient.makePostRequest('/qrcode', formData, 'blob');
    
            if (response.data.type === 'image/png') {
                const blob = response.data;
                const imageUrl = URL.createObjectURL(blob);
                onQRCodeGenerated(imageUrl, () => handleDownload(blob));
            } else {
                const text = await response.text();
                throw new Error(`Unexpected response: ${text}`);
            }
        } catch (err) {
            console.error('Error details:', err);
            setError('Error generating QR code: ' + (err.message || 'Unknown error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDownload = (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'qr-code.png');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    };

    const renderInputFields = () => {
        switch (formData.type) {
            case 'url':
                return (
                    <Grid item={true} xs={12}>
                        <label htmlFor="url" className="content-label">Enter URL</label>
                        <div className="input-container">
                            <input
                                id="url"
                                className='tiny-content-input width100'
                                placeholder='https://example.com'
                                name="url"
                                value={formData.url}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </Grid>
                );
            case 'vcard':
                return (
                    <>
                    <Grid container spacing={2} className="width100">
                        <Grid item={true} xs={12}>
                            <label className="content-label">Personal Information</label>
                            <Grid container spacing={2}>
                                <Grid item={true} xs={12} sm={6} className="width100">
                                    <div className="input-container">
                                        <input
                                            className='tiny-content-input width100'
                                            placeholder="First Name"
                                            name="vcard.firstName"
                                            value={formData.vcard.firstName}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </Grid>
                                <Grid item={true} xs={12} sm={6} className="width100">
                                    <div className="input-container">
                                        <input
                                            className='tiny-content-input width100'
                                            placeholder="Last Name"
                                            name="vcard.lastName"
                                            value={formData.vcard.lastName}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </Grid>
                                <Grid item={true} xs={12} sm={6} className="width100">
                                    <div className="input-container">
                                        <input
                                            className='tiny-content-input width100'
                                            placeholder="Phone Number"
                                            name="vcard.phone"
                                            value={formData.vcard.phone}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </Grid>
                                <Grid item={true} xs={12} sm={6} className="width100">
                                    <div className="input-container">
                                        <input
                                            className='tiny-content-input width100'
                                            placeholder="Email"
                                            name="vcard.email"
                                            value={formData.vcard.email}
                                            onChange={handleInputChange}
                                            type="email"
                                        />
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item={true} xs={12} className="width100">
                            <label className="content-label">Company Information</label>
                            <Grid container spacing={2}>
                                <Grid item={true} xs={12} sm={6} className="width100">
                                    <div className="input-container">
                                        <input
                                            className='tiny-content-input width100'
                                            placeholder="Company"
                                            name="vcard.company"
                                            value={formData.vcard.company}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </Grid>
                                <Grid item={true} xs={12} sm={6} className="width100">
                                    <div className="input-container">
                                        <input
                                            className='tiny-content-input width100'
                                            placeholder="Job Title"
                                            name="vcard.job"
                                            value={formData.vcard.job}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item={true} xs={12}>
                            <label className="content-label">Address</label>
                            <Grid container spacing={2}>
                                <Grid item={true} xs={12} className="width100">
                                    <div className="input-container">
                                        <input
                                            className='tiny-content-input width100'
                                            placeholder="Street Address"
                                            name="vcard.street"
                                            value={formData.vcard.street}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </Grid>
                                <Grid item={true} xs={12} className="width100">
                                    <div className="input-container">
                                        <input
                                            className='tiny-content-input width100'
                                            placeholder="Apt, Suite, Bldg. (optional)"
                                            name="vcard.street2"
                                            value={formData.vcard.street2}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </Grid>
                                <Grid item={true} xs={12} sm={6} className="width100">
                                    <div className="input-container">
                                        <input
                                            className='tiny-content-input width100'
                                            placeholder="City"
                                            name="vcard.city"
                                            value={formData.vcard.city}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </Grid>
                                <Grid item={true} xs={12} sm={3} className="width100">
                                    <div className="input-container">
                                        <input
                                            className='tiny-content-input width100'
                                            placeholder="State"
                                            name="vcard.state"
                                            value={formData.vcard.state}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </Grid>
                                <Grid item={true} xs={12} sm={3} className="width100">
                                    <div className="input-container">
                                        <input
                                            className='tiny-content-input width100'
                                            placeholder="ZIP Code"
                                            name="vcard.zipcode"
                                            value={formData.vcard.zipcode}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item={true} xs={12}>
                        <label className="content-label">Website</label>
                        <div className="input-container">
                            <input
                                className='tiny-content-input width100'
                                placeholder="Website"
                                name="vcard.website"
                                value={formData.vcard.website}
                                onChange={handleInputChange}
                            />
                        </div>
                    </Grid>
                    </>
                );
            case 'text':
                return (
                    <Grid item={true} xs={12}>
                        <label htmlFor="text" className="content-label">Enter Text</label>
                        <div className="input-container">
                            <textarea
                                id="text"
                                className='tiny-content-input width100'
                                placeholder='Enter your text here'
                                name="text"
                                value={formData.text}
                                onChange={handleInputChange}
                                required
                                rows={6}
                            />
                        </div>
                    </Grid>
                );
            case 'email':
                return (
                    <>
                        {['address', 'subject', 'message'].map((field) => (
                            <Grid item={true} xs={12} key={field}>
                                <label htmlFor={`email.${field}`} className="content-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                <div className="input-container">
                                    {field === 'message' ? (
                                        <textarea
                                            id={`email.${field}`}
                                            className='tiny-content-input width100'
                                            placeholder={field}
                                            name={`email.${field}`}
                                            value={formData.email[field]}
                                            onChange={handleInputChange}
                                            required={field === 'address'}
                                            rows={4}
                                        />
                                    ) : (
                                        <input
                                            id={`email.${field}`}
                                            className='tiny-content-input width100'
                                            placeholder={field}
                                            name={`email.${field}`}
                                            value={formData.email[field]}
                                            onChange={handleInputChange}
                                            required={field === 'address'}
                                            type={field === 'address' ? 'email' : 'text'}
                                        />
                                    )}
                                </div>
                            </Grid>
                        ))}
                    </>
                );
            case 'sms':
                return (
                    <>
                        {['number', 'message'].map((field) => (
                            <Grid item={true} xs={12} key={field}>
                                <label htmlFor={`sms.${field}`} className="content-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                <div className="input-container">
                                    {field === 'message' ? (
                                        <textarea
                                            id={`sms.${field}`}
                                            className='tiny-content-input width100'
                                            placeholder={field}
                                            name={`sms.${field}`}
                                            value={formData.sms[field]}
                                            onChange={handleInputChange}
                                            required
                                            rows={4}
                                        />
                                    ) : (
                                        <input
                                            id={`sms.${field}`}
                                            className='tiny-content-input width100'
                                            placeholder={field}
                                            name={`sms.${field}`}
                                            value={formData.sms[field]}
                                            onChange={handleInputChange}
                                            required
                                            type="tel"
                                        />
                                    )}
                                </div>
                            </Grid>
                        ))}
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="card">
            <h1 id="form-title">Generate QR Code</h1>
            <div className="main-content-container width100">
                <form onSubmit={handleSubmit}>
                    <Grid container direction="column" spacing={2} className="form-bottom-padding width100">
                        <Grid item={true} xs={12}>
                            <label htmlFor="type" className="content-label">QR Code Type</label>
                            <div className="input-container">
                                <select
                                    id="type"
                                    className='tiny-content-input width100'
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    required
                                >
                                    {QR_CODE_TYPES.map(type => (
                                        <option key={type.value} value={type.value}>{type.label}</option>
                                    ))}
                                </select>
                            </div>
                        </Grid>

                        {renderInputFields()}

                        <Grid item={true} xs={12} className="util-btn">
                            <button type="submit" disabled={isSubmitting} className="width100">
                                {isSubmitting ? 'Generating...' : 'Generate QR Code'}
                            </button>
                        </Grid>

                        {error && (
                            <Grid item={true} xs={12} className="error-message" role="alert">
                                {error}
                            </Grid>
                        )}
                    </Grid>
                </form>
            </div>
        </div>
    );
};

export default QRCodeContent;
