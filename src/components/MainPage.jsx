import { useState } from 'react';
import Header from './Header';
import ModeSelector from './ModeSelector';
import PasswordDisplay from './PasswordDisplay';
import PasswordControls from './PasswordControls';
import StrengthMeter from './StrengthMeter';
import EncryptButton from './EncryptButton';
import ThemeToggle from './ThemeToggle';
import PinWarning from './PinWarning';
import ScrollIndicator from './ScrollIndicator';
import AboutUs from './AboutUs';
import { generatePassword as apiGeneratePassword } from '../services/api';
import '../App.css';

function MainPage() {
    const [password, setPassword] = useState('');
    const [strength, setStrength] = useState(null);
    const [mode, setMode] = useState('random');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [options, setOptions] = useState({
        length: 16,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
        includeNumbers: false
    });

    // Main generation function - calls backend API
    const generatePassword = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await apiGeneratePassword(mode, options);

            // Set password and strength from backend response
            setPassword(response.password);
            setStrength(response.strength);
        } catch (err) {
            setError(err.message);
            setPassword('');
            setStrength(null);
            console.error('Password generation error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle mode change
    const handleModeChange = (newMode) => {
        setMode(newMode);
        setPassword(''); // Clear password when mode changes
        setStrength(null); // Clear strength when mode changes
        setError(null); // Clear any errors

        // Adjust default length based on mode
        if (newMode === 'pin') {
            setOptions({ ...options, length: 6 });
        } else if (newMode === 'memorable') {
            setOptions({ ...options, length: 4 }); // 4 words
        } else {
            setOptions({ ...options, length: 16 });
        }
    };

    // Check if generate button should be disabled
    const isGenerateDisabled = mode === 'random' &&
        !options.uppercase && !options.lowercase && !options.numbers && !options.symbols;

    return (
        <div className="app-container">
            <ThemeToggle />
            <Header />

            <div className="app-grid">
                <div className="left-column">
                    <ModeSelector selectedMode={mode} onModeChange={handleModeChange} />
                    <PasswordDisplay password={password} />
                    <StrengthMeter strength={strength} />
                </div>

                <div className="right-column">
                    <PasswordControls options={options} onOptionsChange={setOptions} mode={mode} />
                    <EncryptButton
                        onClick={generatePassword}
                        disabled={isGenerateDisabled || isLoading}
                    />
                    {mode === 'pin' && <PinWarning />}
                </div>
            </div>

            <ScrollIndicator />

            <AboutUs />

            {isGenerateDisabled && (
                <p className="warning-text">Please select at least one character type</p>
            )}

            {error && (
                <p className="error-text">{error}</p>
            )}

        </div>
    );
}

export default MainPage;
