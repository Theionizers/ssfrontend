import React, { useState, useEffect } from 'react';
import api from '../api';
import LoadingScreen from '../components/LoadingScreen';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtered, setFiltered] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showOrderForm, setShowOrderForm] = useState(false);

    // Order form state
    const [orderForm, setOrderForm] = useState({
        customer_name: '',
        phone: '',
        address: '',
        quantity: 1,
        location: ''
    });
    const [phoneError, setPhoneError] = useState('');
    const [orderLoading, setOrderLoading] = useState(false);
    const [orderStatus, setOrderStatus] = useState(null);
    const [waLink, setWaLink] = useState(null);
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

    useEffect(() => {
        api.get('/api/products/')
            .then(res => {
                setProducts(res.data);
                setFiltered(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFiltered(products);
        } else {
            const term = searchTerm.toLowerCase();
            setFiltered(products.filter(p => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term)));
        }
    }, [searchTerm, products]);

    const handleOrderSubmit = async (e) => {
        e.preventDefault();

        // validate phone
        if (!/^\d{10}$/.test(orderForm.phone)) {
            setPhoneError('Phone must be 10 digits');
            return;
        }
        setPhoneError('');
        setOrderLoading(true);

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
    };

    return (
        <div className="section" style={{ paddingTop: '8rem' }}>
            <div className="section-header">
                <h2>Our Toy Collection</h2>
                <p>Find the perfect gift from our wide selection</p>
            </div>

            {loading ? (
                <div className="spinner"><LoadingScreen /></div>
            ) : filtered.length > 0 ? (
                <div className="products-search">
                    <input
                        type="text"
                        placeholder="Search toys or categories..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            ) : null}
            {loading ? null : filtered.length > 0 ? (
                <div className="products-grid">
                    {filtered.map(product => (
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
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.8rem' }}>
                                    {product.description.substring(0, 60)}...
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div className="price">₹{product.price}</div>
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); }}
                                    >
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <span className="empty-icon">📦</span>
                    <p>No products available right now.</p>
                </div>
            )}

            {/* Order Modal */}
            {selectedProduct && (
                <div className="order-modal-overlay">
                    <div className="glass-card order-modal">
                        {showOrderForm && (
                            <div className="modal-content" style={{ paddingBottom: '0' }}>
                                <div className="product-order-form-container">
                                    {orderStatus === 'success' && (
                                        <div style={{ marginBottom: '1.5rem' }}>
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
                                                            setShowOrderForm(false);
                                                        }, 1000);
                                                    }}
                                                >
                                                    📱 Confirm on WhatsApp
                                                </button>
                                            )}
                                        </div>
                                    )}
                                    {orderStatus === 'error' && (
                                        <div className="error-msg" style={{ marginBottom: '1rem' }}>Failed to place order. Please try again.</div>
                                    )}

                                    {!orderStatus && (
                                        <div style={{ marginBottom: '1rem', background: 'rgba(255,107,53,0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,107,53,0.2)' }}>
                                            <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Complete Your Order</h4>
                                            <form onSubmit={handleOrderSubmit}>
                                                <div className="form-group">
                                                    <label>Your Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        required
                                                        disabled={orderLoading}
                                                        value={orderForm.customer_name}
                                                        onChange={e => setOrderForm({ ...orderForm, customer_name: e.target.value })}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Phone Number</label>
                                                    <input
                                                        type="tel"
                                                        className="form-control"
                                                        required
                                                        disabled={orderLoading}
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
                                                    <label>Delivery Address</label>
                                                    <textarea
                                                        className="form-control"
                                                        rows="2"
                                                        required
                                                        disabled={orderLoading}
                                                        value={orderForm.address}
                                                        onChange={e => setOrderForm({ ...orderForm, address: e.target.value })}
                                                    ></textarea>
                                                </div>
                                                <div className="form-group">
                                                    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        Location / Landmark
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
                                                        disabled={orderLoading}
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
                                                        disabled={orderLoading}
                                                        value={orderForm.quantity}
                                                        onChange={e => setOrderForm({ ...orderForm, quantity: e.target.value })}
                                                    />
                                                </div>

                                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                                    <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={orderLoading}>
                                                        {orderLoading ? <><span className="btn-spinner"></span> Processing...</> : 'Submit Details'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary"
                                                        onClick={() => setShowOrderForm(false)}
                                                        disabled={orderLoading}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {selectedProduct.image && (
                            <img
                                src={selectedProduct.image}
                                alt={selectedProduct.name}
                                className="modal-product-img"
                                style={{ width: '100%', borderRadius: '8px', margin: '0 0 1rem' }}
                            />
                        )}

                        <div className="modal-content">
                            <h3>{selectedProduct.name}</h3>
                            <p style={{ color: 'var(--text-secondary)', margin: '0.75rem 0' }}>{selectedProduct.description}</p>
                            <div className="price">₹{selectedProduct.price}</div>

                            {!showOrderForm && (
                                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => setShowOrderForm(true)}
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

export default Products;
