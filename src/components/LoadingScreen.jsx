import React from 'react';
import logo from '../assets/logo.png';

const LoadingScreen = ({ fullScreen = false }) => {
    if (fullScreen) {
        return (
            <div className="branding-loading-screen">
                <div className="loader-logo-wrap">
                    <div className="loader-spinner-ring"></div>
                    <img src={logo} alt="SS Khilona Ghar Logo" className="loader-logo" />
                </div>
                <div className="loader-text">SS Khilona Ghar</div>
                <p className="loader-subtext">Loading your magical world of toys...</p>
                <div className="loader-call-btn" style={{ animationDelay: '2s' }}>
                    <a href="tel:+917897391004" className="btn btn-secondary btn-sm">
                        📞 Call us: +91 7897391004
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="branded-inline-loader">
            <div className="loader-logo-wrap" style={{ width: '80px', height: '80px', marginBottom: '1rem' }}>
                <div className="loader-spinner-ring" style={{ borderWidth: '2px' }}></div>
                <img src={logo} alt="Loading..." className="loader-logo" />
            </div>
            <div className="loader-subtext">Fetching toys...</div>
        </div>
    );
};

export default LoadingScreen;
