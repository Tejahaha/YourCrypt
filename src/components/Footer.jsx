import React from 'react';
import { Github, Twitter, Mail, Heart } from 'lucide-react';
import './components.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-main">
                    <div className="footer-brand">
                        <div className="footer-logo">🔐</div>
                        <h3 className="footer-title">YOURCRYPT</h3>
                        <p className="footer-tagline">Secure passwords, zero tracking</p>
                    </div>

                    <div className="footer-links">
                        <div className="footer-section">
                            <h4 className="footer-heading">Product</h4>
                            <ul className="footer-list">
                                <li><a href="#features">Features</a></li>
                                <li><a href="#security">Security</a></li>
                                <li><a href="#why-us">Why Us</a></li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h4 className="footer-heading">Resources</h4>
                            <ul className="footer-list">
                                <li><a href="#docs">Documentation</a></li>
                                <li><a href="#api">API</a></li>
                                <li><a href="#support">Support</a></li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h4 className="footer-heading">Connect</h4>
                            <div className="footer-social">
                                <a href="#github" className="social-link" aria-label="GitHub">
                                    <Github size={20} />
                                </a>
                                <a href="#twitter" className="social-link" aria-label="Twitter">
                                    <Twitter size={20} />
                                </a>
                                <a href="#email" className="social-link" aria-label="Email">
                                    <Mail size={20} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="footer-copyright">
                        © {currentYear} YourCrypt. Made with <Heart size={16} className="heart-icon" /> for security.
                    </p>
                    <div className="footer-legal">
                        <a href="#privacy">Privacy Policy</a>
                        <span className="separator">•</span>
                        <a href="#terms">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
