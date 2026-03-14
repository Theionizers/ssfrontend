import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} SS Khilona Ghar. All rights reserved.</p>
        <p>Bringing joy to children since 2024 ✨</p>

        <div className="footer-map-container">
          <iframe
            title="SS Khilona Ghar location"
            src="https://www.google.com/maps?q=26.347428375310308,81.98207216813019&output=embed"
            width="250"
            height="150"
            style={{ border: 0, borderRadius: "8px" }}
            loading="lazy"
          ></iframe>
        </div>

        {/* React Admin Login Page */}
        <Link to="/admin-login" className="admin-btn">
          Admin Login
        </Link>


      </div>
    </footer>
  );
};

export default Footer;
