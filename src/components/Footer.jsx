import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">

        <p>© {new Date().getFullYear()} SS Khilona Ghar. All rights reserved.</p>
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

        <a
          href="https://ssbackend-7xfx.onrender.com/admin/"
          className="admin-btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          Admin Portal
        </a>

      </div>
    </footer>
  );
};

export default Footer;
