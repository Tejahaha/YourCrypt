import React from 'react';
import { Shuffle, Brain, Hash } from 'lucide-react';
import './components.css';

const ModeSelector = ({ selectedMode, onModeChange }) => {
    const modes = [
        {
            id: 'random',
            name: 'Random Password',
            icon: Shuffle,
            description: 'Fully random & secure'
        },
        {
            id: 'memorable',
            name: 'Memorable',
            icon: Brain,
            description: 'Easy to remember'
        },
        {
            id: 'pin',
            name: 'PIN',
            icon: Hash,
            description: 'Numeric only'
        }
    ];

    return (
        <div className="mode-selector">
            <h3 className="mode-selector-title">Generation Mode</h3>
            <div className="mode-buttons">
                {modes.map(mode => {
                    const IconComponent = mode.icon;
                    return (
                        <button
                            key={mode.id}
                            className={`mode-button ${selectedMode === mode.id ? 'active' : ''}`}
                            onClick={() => onModeChange(mode.id)}
                        >
                            <span className="mode-icon">
                                <IconComponent size={28} strokeWidth={2.5} />
                            </span>
                            <div className="mode-info">
                                <span className="mode-name">{mode.name}</span>
                                <span className="mode-description">{mode.description}</span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ModeSelector;
