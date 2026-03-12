import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const AdminPanel = () => {
    const { logout, username } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/admin-login');
    };

    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="admin-layout">
            {/* Sidebar for Desktop / mobile overlay */}
            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div style={{ padding: '0 1rem 1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    Welcome, <strong>{username}</strong>
                </div>
                <NavLink to="/admin" end>📊 Dashboard</NavLink>
                <NavLink to="/admin/orders">📦 Orders</NavLink>
                <NavLink to="/admin/products">🧸 Products</NavLink>
                <NavLink to="/admin/gallery">📷 Gallery</NavLink>

                <button onClick={handleLogout} className="logout-btn">
                    <span>🚪</span> Logout
                </button>
            </aside>

            {/* clickable overlay when sidebar open */}
            {sidebarOpen && <div className="sidebar-backdrop" onClick={closeSidebar}></div>}
            {/* Main Content Area */}
            <main className="admin-content">
                {/* Mobile Navigation */}
                <div className="admin-mobile-nav">
                    <button
                        className="mobile-hamburger"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        aria-label="Menu"
                        style={{ fontSize: '1.2rem', background: 'none', border: 'none', color: 'var(--text-primary)' }}
                    >
                        ☰
                    </button>
                    <NavLink to="/admin" end onClick={closeSidebar}>Dashboard</NavLink>
                    <NavLink to="/admin/orders" onClick={closeSidebar}>Orders</NavLink>
                    <NavLink to="/admin/products" onClick={closeSidebar}>Products</NavLink>
                    <NavLink to="/admin/gallery" onClick={closeSidebar}>Gallery</NavLink>
                    <button onClick={handleLogout} className="btn btn-danger btn-sm" style={{ padding: '0.4rem 0.8rem' }}>Logout</button>
                </div>

                <Outlet />
            </main>
        </div>
    );
};

export default AdminPanel;
