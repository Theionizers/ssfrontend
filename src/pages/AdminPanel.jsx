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
                <NavLink to="/" className="home-link-sidebar">🏠 Go to Home</NavLink>
                <NavLink to="/admin" end>📊 Dashboard</NavLink>
                <NavLink to="/admin/orders">📦 Orders</NavLink>
                <a
                  href="https://ssbackend-7xfx.onrender.com/admin/shop/product/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="django-admin-btn"
                >
                  🧸 Products (Main Admin)
                </a>
                <a
                  href="https://ssbackend-7xfx.onrender.com/admin/shop/galleryimage/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="django-admin-btn"
                >
                  📷 Gallery (Main Admin)
                </a>

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
                    <NavLink to="/" className="home-link-mobile">🏠 Home</NavLink>
                    <NavLink to="/admin" end onClick={closeSidebar}>Dashboard</NavLink>
                    <NavLink to="/admin/orders" onClick={closeSidebar}>Orders</NavLink>
                    <a 
                      href="https://ssbackend-7xfx.onrender.com/admin/shop/product/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="nav-link"
                      onClick={closeSidebar}
                    >
                      Products
                    </a>
                    <a 
                      href="https://ssbackend-7xfx.onrender.com/admin/shop/galleryimage/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="nav-link"
                      onClick={closeSidebar}
                    >
                      Gallery
                    </a>
                    <button onClick={handleLogout} className="btn btn-danger btn-sm" style={{ padding: '0.4rem 0.8rem' }}>Logout</button>
                </div>

                <Outlet />
            </main>
        </div>
    );
};

export default AdminPanel;
