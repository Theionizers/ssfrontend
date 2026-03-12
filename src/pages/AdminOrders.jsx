import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
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
        setUpdatingId(id);
        try {
            await api.post(`/api/orders/${id}/update_status/`, { status }, {
                headers: { Authorization: `Token ${token}` }
            });
            fetchOrders(); // refresh
        } catch (err) {
            alert('Failed to update status');
        } finally {
            setUpdatingId(null);
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
                                        <div className="action-row" style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                className="btn btn-success btn-sm"
                                                style={{ justifyContent: 'center', flex: 1 }}
                                                onClick={() => updateStatus(order.id, 'delivered')}
                                                disabled={updatingId === order.id}
                                            >
                                                {updatingId === order.id ? <><span className="btn-spinner"></span> Updating...</> : 'Deliver'}
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                style={{ justifyContent: 'center', flex: 1 }}
                                                onClick={() => updateStatus(order.id, 'cancelled')}
                                                disabled={updatingId === order.id}
                                            >
                                                {updatingId === order.id ? <><span className="btn-spinner"></span> Updating...</> : 'Cancel'}
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
