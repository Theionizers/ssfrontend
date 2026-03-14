import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import LoadingScreen from '../components/LoadingScreen';

const Home = () => {
    const [featured, setFeatured] = useState([]);
    const [featuredLoading, setFeaturedLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [orderForm, setOrderForm] = useState({ customer_name: '', phone: '', address: '', quantity: 1, location: '' });
    const [orderLoading, setOrderLoading] = useState(false);
    const [orderStatus, setOrderStatus] = useState(null); // 'success', 'error'
    const [waLink, setWaLink] = useState(null);
    const [phoneError, setPhoneError] = useState('');
    const [locationLoading, setLocationLoading] = useState(false);

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }
        setLocationLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
                setOrderForm(prev => ({ ...prev, location: mapsUrl }));
                setLocationLoading(false);
            },
            (error) => {
                console.error("Error getting location:", error);
                alert("Unable to retrieve your location. Please enter it manually.");
                setLocationLoading(false);
            }
        );
    };
    const [gallery, setGallery] = useState([]);
    const [galleryLoading, setGalleryLoading] = useState(true);

    useEffect(() => {
        // Fetch fresh products for the featured section
        api.get('/api/products/')
            .then(res => {
                const data = res.data.slice(0, 4);
                setFeatured(data);
            })
            .catch(err => console.error(err))
            .finally(() => setFeaturedLoading(false));

        // fetch gallery images for home page
        api.get('/api/gallery/')
            .then(res => {
                setGallery(res.data);
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
                    <p>Handpicked favorites for endless fun</p>
                </div>

                {featuredLoading ? (
                    <div className="spinner"><LoadingScreen /></div>
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
                    <div className="spinner"><LoadingScreen /></div>
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
                        {selectedProduct.buy && (
                            <div className="modal-content" style={{ paddingBottom: '0' }}>
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

                                    // Append location to address for backend
                                    const mergedAddress = `${orderForm.address}${orderForm.location ? `\n📍 Location: ${orderForm.location}` : ''}`;

                                    try {
                                        const res = await api.post('/api/orders/', {
                                            ...orderForm,
                                            address: mergedAddress,
                                            product: selectedProduct.id
                                        });
                                        setOrderStatus('success');
                                        const waMsg = `Hello, I just placed an order for ${selectedProduct.name} (qty ${orderForm.quantity}).\nName: ${orderForm.customer_name}\nPhone: ${orderForm.phone}\nAddress: ${orderForm.address}${orderForm.location ? `\nLocation: ${orderForm.location}` : ''}`;
                                        const link = res.data?.whatsapp_url || `https://wa.me/917897391004?text=${encodeURIComponent(waMsg)}`;
                                        setWaLink(link);
                                    } catch (err) {
                                        setOrderStatus('error');
                                    } finally {
                                        setOrderLoading(false);
                                    }
                                }}>
                                    {orderStatus === 'success' && (
                                        <div style={{ marginBottom: '1rem' }}>
                                            <div className="success-msg">✓ Order placed successfully!</div>
                                            {orderLoading ? (
                                                <div className="spinner" style={{ marginTop: '1rem' }}><LoadingScreen /></div>
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
                                                            setOrderForm({ customer_name: '', phone: '', address: '', quantity: 1, location: '' });
                                                        }, 1000);
                                                    }}
                                                >
                                                    📱 Confirm on WhatsApp
                                                </button>
                                            )}
                                        </div>
                                    )}
                                    {orderStatus === 'error' && <div className="error-msg" style={{ marginBottom: '1rem' }}>Order failed.</div>}

                                    {!orderStatus && (
                                        <div style={{ marginBottom: '1.5rem', background: 'rgba(255,107,53,0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,107,53,0.2)' }}>
                                            <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Complete Your Order</h4>
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
                                                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    Delivery Location / Landmark
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-secondary btn-sm" 
                                                        style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
                                                        onClick={handleGetLocation}
                                                        disabled={locationLoading}
                                                    >
                                                        {locationLoading ? '📍 Locating...' : '📍 Use Live Location'}
                                                    </button>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter landmark or GPS link"
                                                    value={orderForm.location}
                                                    onChange={e => setOrderForm({ ...orderForm, location: e.target.value })}
                                                />
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
                                                    {orderLoading ? <><span className="btn-spinner"></span> Submitting...</> : 'Submit Details'}
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary"
                                                    onClick={() => setSelectedProduct({ ...selectedProduct, buy: false })}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </form>
                            </div>
                        )}

                        <img 
                            src={selectedProduct.image || 'https://via.placeholder.com/300x220?text=No+Image'} 
                            alt={selectedProduct.name} 
                            className="modal-product-img"
                        />
                        <div className="modal-content">
                            <h3>{selectedProduct.name}</h3>
                            <p className="product-description">{selectedProduct.description}</p>
                            <div className="price">₹{selectedProduct.price}</div>
                            
                            {!selectedProduct.buy && (
                                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => setSelectedProduct({ ...selectedProduct, buy: true })}
                                    >
                                        Buy Now
                                    </button>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => setSelectedProduct(null)}
                                    >
                                        Close
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
