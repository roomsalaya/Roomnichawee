import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear(); // Get the current year

    return (
        <footer className="footer">
            <p>© {currentYear} หอพักณิชชาวีร์ สงวนลิขสิทธิ์</p>
        </footer>
    );
}

export default Footer;
