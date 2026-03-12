import React from 'react';

const Contact = () => {
    return (
        <div className="contact-page">
            <div className="section-header">
                <h2>Get in Touch</h2>
                <p>We'd love to hear from you!</p>
            </div>

            <div className="contact-grid">
                <div className="glass-card contact-card">
                    <span className="contact-icon">📍</span>
                    <h3>Visit Us</h3>
                    <p>
                      <a
                        href="https://www.google.com/maps/search/?api=1&query=SS+Khilona+Ghar+Main+Market+Road+Toyland+City+123456"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        SS Khilona Ghar<br />Main Market Road<br />Toyland City, 123456
                      </a>
                    </p>
                </div>

                <div className="glass-card contact-card">
                    <span className="contact-icon">📞</span>
                    <h3>Call Us</h3>
                    <p>We're available mapping to 10 AM - 9 PM</p>
                    <a href="tel:+917897391004" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                        +91 98765 43210
                    </a>
                </div>

                <div className="glass-card contact-card">
                    <span className="contact-icon">💬</span>
                    <h3>WhatsApp Us</h3>
                    <p>For quick queries and orders</p>
                    <a
                        href="https://wa.me/917897391004"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-whatsapp"
                        style={{ width: '100%', justifyContent: 'center' }}
                    >
                        Chat on WhatsApp
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Contact;
