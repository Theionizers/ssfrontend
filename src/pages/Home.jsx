import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const Home = () => {
    const [featured, setFeatured] = useState([]);
    const [featuredLoading, setFeaturedLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [orderForm, setOrderForm] = useState({ customer_name: '', phone: '', address: '', quantity: 1 });
    const [phoneError, setPhoneError] = useState('');
    const [orderStatus, setOrderStatus] = useState(null);
    const [waLink, setWaLink] = useState(null);
    const [orderLoading, setOrderLoading] = useState(false);
    const [gallery, setGallery] = useState([]);
    const [galleryLoading, setGalleryLoading] = useState(true);

    useEffect(() => {
        // Try to load from cache first
        const cachedFeatured = localStorage.getItem('featured_products');
        const cachedGallery = localStorage.getItem('gallery');

        if (cachedFeatured) {
            setFeatured(JSON.parse(cachedFeatured));
            setFeaturedLoading(false);
        }
        if (cachedGallery) {
            setGallery(JSON.parse(cachedGallery));
            setGalleryLoading(false);
        }

        // Fetch fresh products for the featured section
        api.get('/api/products/')
            .then(res => {
                const data = res.data.slice(0, 4);
                setFeatured(data);
                localStorage.setItem('featured_products', JSON.stringify(data));
            })
            .catch(err => console.error(err))
            .finally(() => setFeaturedLoading(false));

        // fetch gallery images for home page
        api.get('/api/gallery/')
            .then(res => {
                setGallery(res.data);
                localStorage.setItem('gallery', JSON.stringify(res.data));
            })
            .catch(err => console.error(err))
            .finally(() => setGalleryLoading(false));
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <div className="hero-badge">🧸 Premium Quality Toys</div>
                    <h1>
                        Welcome to <br />
                        <span className="gradient-text">SS Khilona Ghar</span>
                    </h1>
                    <p>
                        Discover a magical world of toys, games, and learning tailored just for your little ones. Unleash their imagination today!
                    </p>
                    <div className="hero-buttons">
                        <Link to="/products" className="btn btn-primary">Shop Now</Link>
                        <Link to="/contact" className="btn btn-secondary">Contact Us</Link>
                    </div>
                    <div className="hero-emojis">
                        🚀 🦄 🚂 🎨
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="section featured-section">
                <div className="section-header">
                    <h2>Featured Toys</h2>
                    <p>Handpicked favorites for endless fun</p>
                </div>

                {featuredLoading ? (
                    <div className="spinner"></div>
                ) : featured.length > 0 ? (
                    <div className="featured-scroll">
                        {featured.map(product => (
                            <div key={product.id} className="product-card" onClick={() => setSelectedProduct(product)}>
                                <img
                                    src={product.image || 'https://via.placeholder.com/300x220?text=No+Image'}
                                    alt={product.name}
                                    className="product-card-img"
                                    loading="lazy"
                                />
                                <div className="product-card-body">
                                    <span className="category-badge">{product.category}</span>
                                    <h3>{product.name}</h3>
                                    <div className="price">₹{product.price}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <span className="empty-icon">🎈</span>
                        <p>No featured toys yet.</p>
                    </div>
                )}
            </section>

            {/* View All Products Link */}
            <div style={{ textAlign: 'center', margin: '2rem 0' }}>
                <Link to="/products" className="btn btn-secondary">View All Products</Link>
            </div>

            {/* Gallery preview on home */}
            <section className="section gallery-section">
                <div className="section-header">
                    <h2>Shop Gallery</h2>
                    <p>A glimpse of joyful moments</p>
                </div>
                {galleryLoading ? (
                    <div className="spinner"></div>
                ) : gallery.length > 0 ? (
                    <div className="gallery-grid">
                        {gallery.map(img => (
                             <div key={img.id} className="gallery-item">
                                <img src={img.image} alt={img.caption} loading="lazy" />
                                <div className="gallery-overlay">
                                    {img.caption || 'SS Khilona Ghar Moment'}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <span className="empty-icon">📷</span>
                        <p>No gallery images yet.</p>
                    </div>
                )}
            </section>

            {/* product/order modal on home */}
            {selectedProduct && (
                <div className="order-modal-overlay">
                    <div className="glass-card order-modal home-product-modal">
                        <h3>{selectedProduct.name}</h3>
                        <p className="product-description">{selectedProduct.description}</p>
                        <div className="price">₹{selectedProduct.price}</div>
                        <button
                            className="btn btn-primary btn-buy"
                            onClick={() => setSelectedProduct({ ...selectedProduct, buy: true })}
                        >
                            Buy Now
                        </button>
                        <button
                            className="btn btn-secondary"
                            style={{ marginLeft: '1rem' }}
                            onClick={() => setSelectedProduct(null)}
                        >
                            Close
                        </button>

                        {selectedProduct.buy && (
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                // validate phone before submitting
                                const phoneMatch = orderForm.phone.match(/^\d{10}$/);
                                if (!phoneMatch) {
                                    setPhoneError('Enter a 10-digit phone number');
                                    return;
                                }
                                setPhoneError('');
                                setOrderLoading(true);
                                try {
                                    const res = await api.post('/api/orders/', {
                                        ...orderForm,
                                        product: selectedProduct.id
                                    });
                                    setOrderStatus('success');
                                    const link = res.data?.whatsapp_url || `https://wa.me/917897391004?text=${encodeURIComponent(`Hello, I just placed an order for ${selectedProduct.name} (qty ${orderForm.quantity}). My name: ${orderForm.customer_name}, phone: ${orderForm.phone}, address: ${orderForm.address}`)}`;
                                    setWaLink(link);
                                } catch (err) {
                                    setOrderStatus('error');
                                } finally {
                                    setOrderLoading(false);
                                }
                            }}>
                                {orderStatus === 'success' && (
                                    <div>
                                        <div className="success-msg">✓ Order placed successfully!</div>
                                        {orderLoading ? (
                                            <div className="spinner" style={{ marginTop: '1rem' }}></div>
                                        ) : (
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                style={{ width: '100%', marginTop: '1rem' }}
                                                onClick={() => {
                                                    window.open(waLink, '_blank');
                                                    setTimeout(() => {
                                                        setSelectedProduct(null);
                                                        setOrderStatus(null);
                                                        setWaLink(null);
                                                        setOrderForm({ customer_name: '', phone: '', address: '', quantity: 1 });
                                                    }, 1000);
                                                }}
                                            >
                                                📱 Confirm on WhatsApp
                                            </button>
                                        )}
                                    </div>
                                )}
                                {orderStatus === 'error' && <div className="error-msg">Order failed.</div>}

                                {!orderStatus && (
                                    <>
                                        <div className="form-group">
                                            <label>Your Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                required
                                                value={orderForm.customer_name}
                                                onChange={e => setOrderForm({ ...orderForm, customer_name: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Phone</label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                required
                                                value={orderForm.phone}
                                                onChange={e => setOrderForm({ ...orderForm, phone: e.target.value })}
                                                onBlur={() => {
                                                    if (orderForm.phone && !/^\d{10}$/.test(orderForm.phone)) {
                                                        setPhoneError('Phone must be 10 digits');
                                                    } else {
                                                        setPhoneError('');
                                                    }
                                                }}
                                            />
                                            {phoneError && <div className="error-msg" style={{ marginTop: '0.25rem' }}>{phoneError}</div>}
                                        </div>
                                        <div className="form-group">
                                            <label>Address</label>
                                            <textarea
                                                className="form-control"
                                                rows="2"
                                                required
                                                value={orderForm.address}
                                                onChange={e => setOrderForm({ ...orderForm, address: e.target.value })}
                                            ></textarea>
                                        </div>
                                        <div className="form-group">
                                            <label>Quantity</label>
                                            <input
                                                type="number"
                                                min="1"
                                                className="form-control"
                                                required
                                                value={orderForm.quantity}
                                                onChange={e => setOrderForm({ ...orderForm, quantity: e.target.value })}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                            <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={orderLoading}>
                                                {orderLoading ? <><span className="btn-spinner"></span> Submitting...</> : 'Submit'}
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={() => setSelectedProduct(null)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </>
                                )}
                            </form>
                        )}

                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
