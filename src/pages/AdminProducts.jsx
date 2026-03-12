import React, { useState, useEffect, useRef } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const { token } = useAuth();
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'toys',
        stock: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const fetchProducts = () => {
        api.get('/api/products/')
            .then(res => {
                setProducts(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });
        if (imageFile) {
            data.append('image', imageFile);
        }

        setActionLoading(true);
        try {
            await api.post('/api/products/', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Token ${token}`
                }
            });

            // Reset form
            setFormData({ name: '', description: '', price: '', category: 'toys', stock: '' });
            setImageFile(null);
            setImagePreview(null);
            setShowForm(false);
            fetchProducts();

            alert('Product Added Successfully!');
        } catch (err) {
            alert('Failed to add product');
            console.error(err);
        } finally {
            setActionLoading(false);
        }
    };

    const deleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setDeletingId(id);
            try {
                await api.delete(`/api/products/${id}/`, {
                    headers: { Authorization: `Token ${token}` }
                });
                fetchProducts();
            } catch (err) {
                alert('Failed to delete');
            } finally {
                setDeletingId(null);
            }
        }
    };

    if (loading) return <div className="spinner"></div>;

    return (
        <div>
            <div className="admin-header">
                <h1>Products Management</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Cancel' : '+ Add New Product'}
                </button>
            </div>

            {showForm && (
                <div className="glass-card product-form">
                    <h3>Add New Toy</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Product Name</label>
                            <input
                                type="text"
                                className="form-control"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.2rem' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Price (₹)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-control"
                                    required
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Stock Quantity</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    required
                                    value={formData.stock}
                                    onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Category</label>
                            <select
                                className="form-control"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="toys">General Toys</option>
                                <option value="games">Board Games & Puzzles</option>
                                <option value="dolls">Dolls & Figures</option>
                                <option value="vehicles">Cars & Vehicles</option>
                                <option value="educational">Educational & STEM</option>
                                <option value="outdoor">Outdoor Play</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Product Image</label>
                            <div
                                className="image-upload"
                                onClick={() => fileInputRef.current.click()}
                            >
                                <span className="upload-icon">📸</span>
                                <p>Click to upload an image</p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                />
                                {imagePreview && (
                                    <img src={imagePreview} alt="Preview" className="image-preview" />
                                )}
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={actionLoading}>
                            {actionLoading ? <><span className="btn-spinner"></span> Saving...</> : 'Save Product'}
                        </button>
                    </form>
                </div>
            )}

            {/* Product List */}
            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>
                                    <img
                                        src={product.image || 'https://via.placeholder.com/50'}
                                        alt={product.name}
                                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                                    />
                                </td>
                                <td><strong>{product.name}</strong></td>
                                <td><span className="category-badge">{product.category}</span></td>
                                <td>₹{product.price}</td>
                                <td>{product.stock}</td>
                                <td>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        style={{ justifyContent: 'center' }}
                                        onClick={() => deleteProduct(product.id)}
                                        disabled={deletingId === product.id}
                                    >
                                        {deletingId === product.id ? <><span className="btn-spinner"></span> Deleting...</> : 'Delete'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No products found. Add one above!</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProducts;
