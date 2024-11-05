import React, { useState } from 'react';
import { Button, Typography } from '@mui/material';
import '../../style/home.css'; // Import the CSS file

const Signup = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords don't match");
            return;
        }
        // TODO: Implement signup logic
        console.log('Signup submitted', { email, password });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit}>
            <Typography variant="h5" component="h2" gutterBottom id="form-title">
                Sign Up
            </Typography>
            <div className="main-content-container">
                <label htmlFor="email" className="content-label">Email</label>
                <input
                    id="email"
                    type="email"
                    className="tiny-content-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label htmlFor="password" className="content-label">Password</label>
                <input
                    id="password"
                    type="password"
                    className="tiny-content-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <label htmlFor="confirmPassword" className="content-label">Confirm Password</label>
                <input
                    id="confirmPassword"
                    type="password"
                    className="tiny-content-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <div className="util-btn">
                    <Button type="submit" variant="contained" fullWidth>
                        Sign Up
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default Signup;
