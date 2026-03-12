import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="navbar">
            <NavLink to="/" className="navbar-logo" onClick={() => setIsOpen(false)}>
                <span className="logo-icon">🧸</span> SS Khilona Ghar
            </NavLink>

            <button className="navbar-hamburger" onClick={() => setIsOpen(!isOpen)}>
                <span></span><span></span><span></span>
            </button>

            <ul className={`navbar-links ${isOpen ? 'open' : ''}`}>
                <li><NavLink to="/" onClick={() => setIsOpen(false)}>Home</NavLink></li>
                <li><NavLink to="/products" onClick={() => setIsOpen(false)}>Products</NavLink></li>
                <li><NavLink to="/contact" onClick={() => setIsOpen(false)}>Contact</NavLink></li>
            </ul>
        </nav>
    );
};

export default Navbar;
