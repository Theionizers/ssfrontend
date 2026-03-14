import React, { useState, useEffect } from 'react';

const TimeoutCallButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Set timeout for 90 seconds (1 minute 30 seconds)
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 90000);

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="timeout-call-overlay">
            <div className="timeout-call-card">
                <button className="timeout-call-close" onClick={() => setIsVisible(false)}>×</button>
                <h4>Having Trouble?</h4>
                <p>If the website is slow to respond, you can call us directly for quicker assistance!</p>
                <a href="tel:+917897391004" className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                    📞 Call Now
                </a>
            </div>
        </div>
    );
};

export default TimeoutCallButton;
