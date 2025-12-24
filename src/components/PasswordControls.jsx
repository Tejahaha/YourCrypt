import React from 'react';
import './components.css';

const PasswordControls = ({ options, onOptionsChange, mode }) => {
    const handleLengthChange = (e) => {
        onOptionsChange({ ...options, length: parseInt(e.target.value) });
    };

    const handleCheckboxChange = (option) => {
        onOptionsChange({ ...options, [option]: !options[option] });
    };

    // Customize labels based on mode
    const getLengthLabel = () => {
        if (mode === 'pin') return 'PIN Length';
        if (mode === 'memorable') return 'Number of Words';
        return 'Password Length';
    };

    const getLengthRange = () => {
        if (mode === 'pin') return { min: 4, max: 12 };
        if (mode === 'memorable') return { min: 2, max: 6 };
        return { min: 4, max: 32 };
    };

    const range = getLengthRange();

    return (
        <div className="password-controls">
            <div className="control-group">
                <div className="control-header">
                    <label htmlFor="length-slider">{getLengthLabel()}</label>
                    <span className="length-value">{options.length}</span>
                </div>
                <input
                    id="length-slider"
                    type="range"
                    min={range.min}
                    max={range.max}
                    value={options.length}
                    onChange={handleLengthChange}
                    className="length-slider"
                />
            </div>

            {/* Only show character options for random mode */}
            {mode === 'random' && (
                <>
                    <div className="control-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={options.uppercase}
                                onChange={() => handleCheckboxChange('uppercase')}
                            />
                            <span className="checkbox-custom"></span>
                            <span className="checkbox-text">Uppercase Letters (A-Z)</span>
                        </label>
                    </div>

                    <div className="control-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={options.lowercase}
                                onChange={() => handleCheckboxChange('lowercase')}
                            />
                            <span className="checkbox-custom"></span>
                            <span className="checkbox-text">Lowercase Letters (a-z)</span>
                        </label>
                    </div>

                    <div className="control-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={options.numbers}
                                onChange={() => handleCheckboxChange('numbers')}
                            />
                            <span className="checkbox-custom"></span>
                            <span className="checkbox-text">Numbers (0-9)</span>
                        </label>
                    </div>

                    <div className="control-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={options.symbols}
                                onChange={() => handleCheckboxChange('symbols')}
                            />
                            <span className="checkbox-custom"></span>
                            <span className="checkbox-text">Symbols (!@#$%^&*)</span>
                        </label>
                    </div>
                </>
            )}

            {/* Show separator options for memorable mode */}
            {mode === 'memorable' && (
                <div className="control-group">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={options.includeNumbers}
                            onChange={() => handleCheckboxChange('includeNumbers')}
                        />
                        <span className="checkbox-custom"></span>
                        <span className="checkbox-text">Include Numbers</span>
                    </label>
                </div>
            )}
        </div>
    );
};

export default PasswordControls;
