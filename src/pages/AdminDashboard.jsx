import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';

const AdminDashboard = () => {
    const [counts, setCounts] = useState({ orders: 0, pending: 0, products: 0, gallery: 0 });
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
                <div className="glass-card stat-card">
                    <div className="stat-icon">🧸</div>
                    <div className="stat-value">{counts.products}</div>
                    <div className="stat-label">Products</div>
                </div>
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