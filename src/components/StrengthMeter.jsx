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

    // Map backend score (1-4) to color
    const getColorForScore = (score) => {
        switch (score) {
            case 1: return '#b87a7a'; // Muted red (Very Weak/Weak)
            case 2: return '#b8956a'; // Muted amber (Fair)
            case 3: return '#7a9e8a'; // Muted green (Good)
            case 4: return '#7a8a9e'; // Muted blue (Strong)
            default: return '#6b7280';
        }
    };

    const color = getColorForScore(strength.score);
    const percentage = (strength.score / 4) * 100;

    return (
        <div className="strength-meter">
            <div className="strength-header">
                <span className="strength-label">Password Strength</span>
                <span className="strength-text" style={{ color }}>
                    {strength.label}
                </span>
            </div>
            <div className="strength-bar-container">
                <div
                    className="strength-bar"
                    style={{
                        width: `${percentage}%`,
                        backgroundColor: color
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
