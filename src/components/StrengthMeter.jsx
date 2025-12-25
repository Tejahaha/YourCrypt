import React from 'react';
import './components.css';

/**
 * StrengthMeter Component
 * Displays password strength EXCLUSIVELY from backend calculations
 * NO local strength calculation logic
 */
const StrengthMeter = ({ strength }) => {
    // If no strength data from backend, show empty state
    if (!strength) {
        return (
            <div className="strength-meter">
                <div className="strength-header">
                    <span className="strength-label">Password Strength</span>
                    <span className="strength-text" style={{ color: '#6b7280' }}>
                        No Password
                    </span>
                </div>
                <div className="strength-bar-container">
                    <div
                        className="strength-bar"
                        style={{
                            width: '0%',
                            backgroundColor: '#6b7280'
                        }}
                    ></div>
                </div>
            </div>
        );
    }

    // Map backend score (1-4) to vibrant colors (red to green)
    const getColorForScore = (score) => {
        switch (score) {
            case 1: return { bar: '#ef4444', text: '#ef4444', bg: '#fee2e2' }; // Vibrant red (Very Weak/Weak)
            case 2: return { bar: '#f59e0b', text: '#f59e0b', bg: '#fef3c7' }; // Vibrant amber (Fair)
            case 3: return { bar: '#10b981', text: '#10b981', bg: '#d1fae5' }; // Vibrant green (Good)
            case 4: return { bar: '#059669', text: '#059669', bg: '#a7f3d0' }; // Deep green (Strong)
            default: return { bar: '#6b7280', text: '#6b7280', bg: '#f3f4f6' };
        }
    };

    const colors = getColorForScore(strength.score);
    const percentage = (strength.score / 4) * 100;

    return (
        <div className="strength-meter">
            <div className="strength-header">
                <span className="strength-label">Password Strength</span>
                <span
                    className="strength-text"
                    style={{
                        color: colors.text,
                        backgroundColor: colors.bg,
                        borderColor: colors.bar
                    }}
                >
                    {strength.label}
                </span>
            </div>
            <div className="strength-bar-container">
                <div
                    className="strength-bar"
                    style={{
                        width: `${percentage}%`,
                        backgroundColor: colors.bar
                    }}
                ></div>
            </div>

            {/* Display additional strength metrics from backend */}
            {strength.entropy_bits !== undefined && (
                <div className="strength-details">
                    <div className="strength-detail-item">
                        <span className="detail-label">Entropy:</span>
                        <span className="detail-value">{strength.entropy_bits.toFixed(1)} bits</span>
                    </div>
                    {strength.estimated_crack_time && (
                        <div className="strength-detail-item">
                            <span className="detail-label">Crack Time:</span>
                            <span className="detail-value">{strength.estimated_crack_time}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StrengthMeter;
