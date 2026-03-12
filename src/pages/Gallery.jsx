import React, { useState, useEffect } from 'react';
import api from '../api';

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchGallery = () => {
        setLoading(true);
        api.get('/api/gallery/')
            .then(res => {
                setImages(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchGallery();
    }, []);

    return (
        <div className="section" style={{ paddingTop: '8rem', minHeight: '100vh' }}>
            <div className="section-header">
                <h2>Shop Gallery</h2>
                <p>Glimpses of joy from our store</p>
            </div>


            {loading ? (
                <div className="spinner"></div>
            ) : images.length > 0 ? (
                <div className="gallery-grid">
                    {images.map(item => (
                        <div key={item.id} className="gallery-item">
                            <img src={item.image} alt={item.caption} />
                            <div className="gallery-overlay">
                                {item.caption || 'SS Khilona Ghar Moments'}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <span className="empty-icon">📷</span>
                    <p>No gallery images uploaded yet.</p>
                </div>
            )}
        </div>
    );
};

export default Gallery;
