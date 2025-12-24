import React, { useState } from 'react';
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
                    {copied ? '✓' : '📋'}
                </button>
            </div>
            {copied && <span className="copy-feedback">Copied to clipboard!</span>}
        </div>
    );
};

export default PasswordDisplay;
