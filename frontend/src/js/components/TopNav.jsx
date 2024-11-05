import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import '../../style/top-nav.css'
import { useMediaQuery, Modal, Box } from '@mui/material';
import DropDown from './DropDown';
import Login from './Login';
import Signup from './Signup';
import MyURL from './content/MyURL';

const FeaturesDropDown = ["TinyURL", "QRCodes", "Reddit Scraper(WIP)"]
const FeaturePositionClass = "feature-dropdown-container"

const TopNav = ({ onContentChange }) => {
    const [isVisible, setIsVisible] = useState(false);
    const isSmallScreen = useMediaQuery('(max-width:600px)');
    const [direction, setDirection] = useState('column');
    const [position, setPosition] = useState(FeaturePositionClass)
    const [openLogin, setOpenLogin] = useState(false);
    const [openSignup, setOpenSignup] = useState(false);
    const [openMyUrls, setOpenMyUrls] = useState(false);

    const setVisibility = () => {
        setIsVisible(!isVisible)
    }

    useEffect(() => {
        if (isSmallScreen) {
            setDirection('row');
            setPosition(FeaturePositionClass + " type-row")
        } else {
            setDirection('column');
            setPosition(FeaturePositionClass)
        }
    }, [isSmallScreen]);

    const handleFeatureClick = (feature) => {
        if (feature === 'TinyURL') {
            onContentChange('tinyurl');
        } else if (feature === 'QRCodes') {
            onContentChange('qrcode');
        }
        setIsVisible(false);
    };

    const handleOpenLogin = () => setOpenLogin(true);
    const handleCloseLogin = () => setOpenLogin(false);
    const handleOpenSignup = () => setOpenSignup(true);
    const handleCloseSignup = () => setOpenSignup(false);
    const handleOpenMyUrls = () => setOpenMyUrls(true);
    const handleCloseMyUrls = () => setOpenMyUrls(false);

    return (
        <>
            <Grid container direction="row" className="top-nav" wrap="nowrap">
                <Grid item={true} size={{ xs: 3, sm: 2 , md: 1, lg: 1, xl: 1 }} className="app-name">
                    <div>TinyUtils</div>
                </Grid>

                <Grid container 
                    direction={isSmallScreen ? 'column' : 'row'} 
                    size={{ xs: 3, sm: 10 , md: 11, lg: 11, xl: 12}} 
                    className="item row-container"
                    justifyContent={'flex-end'}
                >
                    <Grid item={true} className="item-container" onClick={handleOpenMyUrls}>
                        My URL's
                    </Grid>
                    <Grid item={true} className="item-container" onClick={setVisibility}>
                        Features
                        <DropDown 
                            isVisible={isVisible} 
                            dropDownItems={FeaturesDropDown} 
                            position={position} 
                            direction={direction}
                            onItemClick={handleFeatureClick}
                        />
                    </Grid>
                    <Grid item={true} className="item-container" onClick={handleOpenSignup}>
                        Sign Up
                    </Grid>
                    <Grid item={true} className="item-container" onClick={handleOpenLogin}>
                        Sign in
                    </Grid>
                </Grid> 
            </Grid>
            <Modal
                open={openLogin}
                onClose={handleCloseLogin}
                aria-labelledby="login-modal"
                aria-describedby="login-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'rgba(245, 222, 179, 0.95)', // Updated background color
                    boxShadow: 24,
                    p: 4,
                    borderRadius: '15px', // Added border radius
                }}>
                    <Login onClose={handleCloseLogin} />
                </Box>
            </Modal>
            <Modal
                open={openSignup}
                onClose={handleCloseSignup}
                aria-labelledby="signup-modal"
                aria-describedby="signup-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'rgba(245, 222, 179, 0.95)', // Updated background color
                    boxShadow: 24,
                    p: 4,
                    borderRadius: '15px', // Added border radius
                }}>
                    <Signup onClose={handleCloseSignup} />
                </Box>
            </Modal>
            <Modal
                open={openMyUrls}
                onClose={handleCloseMyUrls}
                aria-labelledby="my-urls-modal"
                aria-describedby="my-urls-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 600,
                    bgcolor: 'rgba(245, 222, 179, 0.95)',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: '15px',
                    maxHeight: '80vh',
                    overflowY: 'auto'
                }}>
                    <MyURL onClose={handleCloseMyUrls} />
                </Box>
            </Modal>
        </>
    );
}

export default TopNav;