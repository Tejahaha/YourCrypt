import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import './components.css';

const PasswordDisplay = ({ password }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (password) {
            await navigator.clipboard.writeText(password);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="password-display-container">
            {/* Fun SVG arrow that appears when password is generated */}
            {password && (
                <div className="password-arrow">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 33" fill="currentColor" width="80" height="80">
                        <path d="M0.734436 32.0433C28.1185 20.8631 58.321 14.4162 87.6991 11.2271C93.6909 10.5767 99.7856 10.1329 105.681 8.82643C106.565 8.6305 107.666 8.45126 108.257 7.71167" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                        <path d="M105.295 7.55369C103.251 6.41332 98.0697 4.73081 97.3989 2.01718C97.3762 1.92544 97.3095 1.31771 97.3374 1.37859C98.1737 3.20315 97.6004 7.32036 97.4208 9.32238C97.3735 9.84973 96.396 15.3811 96.8612 15.1485C101.235 12.9619 105.361 8.83254 109.442 6.05271" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                    </svg>
                    <span className="arrow-text">Here's your password!</span>
                </div>
            )}

            <div className="password-display">
                <input
                    type="text"
                    value={password || 'Click generate to create password'}
                    readOnly
                    className="password-input"
                />
                <button
                    onClick={handleCopy}
                    className={`copy-button ${copied ? 'copied' : ''}`}
                    disabled={!password}
                >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
            </div>
            {copied && <span className="copy-feedback">Copied to clipboard!</span>}
        </div>
    );
};

export default PasswordDisplay;
