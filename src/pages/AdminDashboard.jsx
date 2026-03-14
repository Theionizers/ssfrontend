import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';
import LoadingScreen from '../components/LoadingScreen';

const AdminDashboard = () => {
    const [counts, setCounts] = useState(null);
    const { token } = useAuth();

    const fetchCounts = async () => {
        try {
            const [ordersRes, productsRes, galleryRes] = await Promise.all([
                api.get('/api/orders/', { headers: { Authorization: `Token ${token}` } }),
                api.get('/api/products/', { headers: { Authorization: `Token ${token}` } }),
                api.get('/api/gallery/', { headers: { Authorization: `Token ${token}` } }),
            ]);
            const orders = ordersRes.data;
            setCounts({
                orders: orders.length,
                pending: orders.filter(o => o.status === 'pending').length,
                products: productsRes.data.length,
                gallery: galleryRes.data.length,
            });
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchCounts();
    }, [token]);

    if (!counts) return <div className="spinner"><LoadingScreen /></div>;

    return (
        <div>
            <div className="admin-header">
                <h1>Dashboard</h1>
            </div>

            <div className="stats-grid">
                <div className="glass-card stat-card">
                    <div className="stat-icon">📦</div>
                    <div className="stat-value">{counts.orders}</div>
                    <div className="stat-label">Total Orders</div>
                </div>
                <div className="glass-card stat-card">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-value">{counts.pending}</div>
                    <div className="stat-label">Pending</div>
                </div>
                <a 
                    href="https://ssbackend-7xfx.onrender.com/admin/shop/product/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="glass-card stat-card"
                    style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                >
                    <div className="stat-icon">🧸</div>
                    <div className="stat-value">{counts.products}</div>
                    <div className="stat-label">Products (Manage)</div>
                </a>
                <div className="glass-card stat-card">
                    <div className="stat-icon">📷</div>
                    <div className="stat-value">{counts.gallery}</div>
                    <div className="stat-label">Gallery Images</div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;