import React, { useState, useEffect } from 'react';
import api from '../api';

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
        quantity: 1
    });
    const [orderStatus, setOrderStatus] = useState(null);
    const [waLink, setWaLink] = useState(null);
    const [orderLoading, setOrderLoading] = useState(false);

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
        setOrderLoading(true);
        try {
            const res = await api.post('/api/orders/', {
                ...orderForm,
                product: selectedProduct.id
            });
            setOrderStatus('success');

            // store whatsapp link in state instead of opening it
            let link = null;
            if (res.data && res.data.whatsapp_url) {
                link = res.data.whatsapp_url;
            } else {
                const msg = encodeURIComponent(
                    `Hello, I just placed an order for ${selectedProduct.name} (qty ${orderForm.quantity}). My name: ${orderForm.customer_name}, phone: ${orderForm.phone}, address: ${orderForm.address}`
                );
                link = `https://wa.me/917897391004?text=${msg}`;
            }
            setWaLink(link);
        } catch (error) {
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
                <div className="spinner"></div>
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
                        <h3>{selectedProduct.name}</h3>
                        {selectedProduct.image && (
                            <img
                                src={selectedProduct.image}
                                alt={selectedProduct.name}
                                style={{ width: '100%', borderRadius: '8px', margin: '0.5rem 0' }}
                            />
                        )}
                        <p style={{ color: 'var(--text-secondary)', margin: '0.75rem 0' }}>{selectedProduct.description}</p>
                        <div className="price">₹{selectedProduct.price}</div>

                        {!showOrderForm ? (
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
                        ) : (
                            <>
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
                                    <div className="error-msg">Failed to place order. Please try again.</div>
                                )}

                                {!orderStatus && (
                                    <>
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
                                                />
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
                                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={orderLoading}>
                                                    {orderLoading ? 'Processing...' : 'Submit Order'}
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary"
                                                    onClick={() => setSelectedProduct(null)}
                                                    disabled={orderLoading}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
