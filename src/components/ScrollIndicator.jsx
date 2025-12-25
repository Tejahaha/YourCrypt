import React from 'react';
import './components.css';

const ScrollIndicator = () => {
    return (
        <div className="scroll-indicator">
            <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="scroll-arrow"
            >
                {/* Arrow pointing down */}
                <path
                    d="M20 5 L20 30 M20 30 L12 22 M20 30 L28 22"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            <span className="scroll-text">Scroll Down</span>
        </div>
    );
};

export default ScrollIndicator;
