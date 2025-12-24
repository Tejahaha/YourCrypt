import { useState } from 'react';
import Header from './components/Header';
import ModeSelector from './components/ModeSelector';
import PasswordDisplay from './components/PasswordDisplay';
import PasswordControls from './components/PasswordControls';
import StrengthMeter from './components/StrengthMeter';
import EncryptButton from './components/EncryptButton';
import ThemeToggle from './components/ThemeToggle';
import './App.css';

function App() {
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('random');
  const [options, setOptions] = useState({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    includeNumbers: false
  });

  // Main generation function - will be connected to backend API
  const generatePassword = () => {
    // TODO: Replace with backend API call
    // This will send mode and options to the backend
    // and receive a securely generated password
    console.log('Generate password with mode:', mode, 'and options:', options);
    setPassword('Backend API integration pending...');
  };

  // Handle mode change
  const handleModeChange = (newMode) => {
    setMode(newMode);
    setPassword(''); // Clear password when mode changes

    // Adjust default length based on mode
    if (newMode === 'pin') {
      setOptions({ ...options, length: 6 });
    } else if (newMode === 'memorable') {
      setOptions({ ...options, length: 4 });
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
          <StrengthMeter password={password} options={options} />
        </div>

        <div className="right-column">
          <PasswordControls options={options} onOptionsChange={setOptions} mode={mode} />
<EncryptButton
text="Customize me"
speed={100}
maxIterations={20}
characters="ABCD1234!?"
className="revealed"
parentClassName="all-letters"
encryptedClassName="encrypted"
onClick={generatePassword}
disabled={isGenerateDisabled}
/>        </div>
      </div>

      {isGenerateDisabled && (
        <p className="warning-text">Please select at least one character type</p>
      )}
    </div>
  );
}

export default App;
