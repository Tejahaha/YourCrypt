import React from 'react';
import './components.css';

const StrengthMeter = ({ password, options }) => {
    const calculateStrength = () => {
        if (!password) return { level: 0, text: 'No password', color: '#6b7280' };

        let strength = 0;
        const { length, uppercase, lowercase, numbers, symbols } = options;

        // Length contribution
        if (length >= 8) strength += 1;
        if (length >= 12) strength += 1;
        if (length >= 16) strength += 1;

        // Character variety contribution
        if (uppercase) strength += 1;
        if (lowercase) strength += 1;
        if (numbers) strength += 1;
        if (symbols) strength += 1;

        // Determine strength level
        if (strength <= 2) return { level: 1, text: 'Weak', color: '#f55353' };
        if (strength <= 4) return { level: 2, text: 'Fair', color: '#feb139' };
        if (strength <= 6) return { level: 3, text: 'Good', color: '#2ed573' };
        return { level: 4, text: 'Strong', color: '#143f6b' };
    };

    const strength = calculateStrength();
    const percentage = (strength.level / 4) * 100;

    return (
        <div className="strength-meter">
            <div className="strength-header">
                <span className="strength-label">Password Strength</span>
                <span className="strength-text" style={{ color: strength.color }}>
                    {strength.text}
                </span>
            </div>
            <div className="strength-bar-container">
                <div
                    className="strength-bar"
                    style={{
                        width: `${percentage}%`,
                        backgroundColor: strength.color
                    }}
                ></div>
            </div>
        </div>
    );
};

export default StrengthMeter;
