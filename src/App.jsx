import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import Contact from './pages/Contact';

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import AdminOrders from './pages/AdminOrders';
import AdminProducts from './pages/AdminProducts';
import AdminGallery from './pages/AdminGallery';
import AdminDashboard from './pages/AdminDashboard';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Navigate to="/admin-login" replace />;
    return children;
};

// Main Layout (Navbar + Footer) for public pages
const PublicLayout = ({ children }) => (
    <>
        <Navbar />
        {children}
        <Footer />

        {/* floating contact buttons for mobile */}
        <div className="mobile-contact-buttons">
            <a href="tel:+917897391004" className="mobile-icon" aria-label="Call us">📞</a>
            <a href="https://wa.me/917897391004" className="mobile-icon" aria-label="WhatsApp us" target="_blank" rel="noopener noreferrer">💬</a>
        </div>
    </>
);

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
                    <Route path="/products" element={<PublicLayout><Products /></PublicLayout>} />
                    {/* gallery page removed; images shown on home */}
                    <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

                    {/* Admin Login (No Navbar/Footer) */}
                    <Route path="/admin-login" element={<AdminLogin />} />

                    {/* Protected Admin Routes */}
                    <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="orders" element={<AdminOrders />} />
                        <Route path="products" element={<AdminProducts />} />
                        <Route path="gallery" element={<AdminGallery />} />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
