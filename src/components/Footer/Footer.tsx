import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-inner">
                    <p className='footer-text'>&copy; 2024 Трекер каллорий.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;