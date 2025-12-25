import React from 'react';
import { AlertTriangle } from 'lucide-react';
import './components.css';

const PinWarning = () => {
    return (
        <div className="pin-warning-box">
            <div className="pin-warning-icon">
                <AlertTriangle size={24} />
            </div>
            <div className="pin-warning-content">
                <h3 className="pin-warning-title">⚠️ Security Notice</h3>
                <p className="pin-warning-text">
                    PIN passwords are weak because they are easy to <strong>brute-force</strong>.
                    Use them only for low-security scenarios.
                </p>
            </div>
        </div>
    );
};

export default PinWarning;
