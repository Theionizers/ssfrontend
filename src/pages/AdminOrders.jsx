import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    const fetchOrders = () => {
        api.get('/api/orders/', {
            headers: { Authorization: `Token ${token}` }
        })
            .then(res => {
                setOrders(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchOrders();
    }, [token]);

    const updateStatus = async (id, status) => {
        try {
            await api.post(`/api/orders/${id}/update_status/`, { status }, {
                headers: { Authorization: `Token ${token}` }
            });
            fetchOrders(); // refresh
        } catch (err) {
            alert('Failed to update status');
        }
    };

    if (loading) return <div className="spinner"></div>;

    return (
        <div>
            <div className="admin-header">
                <h1>Recent Orders</h1>
            </div>

            <div className="stats-grid">
                <div className="glass-card stat-card">
                    <div className="stat-icon">📦</div>
                    <div className="stat-value">{orders.length}</div>
                    <div className="stat-label">Total Orders</div>
                </div>
                <div className="glass-card stat-card">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-value">{orders.filter(o => o.status === 'pending').length}</div>
                    <div className="stat-label">Pending Delivery</div>
                </div>
            </div>

            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Customer</th>
                            <th>Phone</th>
                            <th>Product</th>
                            <th>Qty</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? orders.map(order => (
                            <tr key={order.id}>
                                <td>#{order.id}</td>
                                <td>
                                    <strong>{order.customer_name}</strong>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.address}</div>
                                </td>
                                <td>{order.phone}</td>
                                <td>{order.product_name}</td>
                                <td>{order.quantity}</td>
                                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                <td>
                                    <span className={`status-badge status-${order.status}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td>
                                    {order.status === 'pending' && (
                                        <div className="action-row">
                                            <button
                                                className="btn btn-success btn-sm"
                                                onClick={() => updateStatus(order.id, 'delivered')}
                                            >
                                                Deliver
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => updateStatus(order.id, 'cancelled')}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>No orders yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrders;
