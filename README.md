# YourCrypt

**A privacy-first password generator with entropy-based security analysis.**

YourCrypt is a web application that generates cryptographically secure passwords without storing, logging, or transmitting any user data. All passwords are generated server-side and immediately discarded after being sent to the client. The application provides three generation modes and real-time entropy-based strength analysis.

---

## Table of Contents

- [Core Problem \& Solution](#core-problem--solution)
- [Architecture Overview](#architecture-overview)
- [Features](#features)
- [Security \& Privacy](#security--privacy)
- [Setup \& Installation](#setup--installation)
- [Usage Guide](#usage-guide)
- [Developer Guide](#developer-guide)
- [API Documentation](#api-documentation)
- [Design Philosophy](#design-philosophy)

---

## Core Problem & Solution

### Problem
Users need strong, unique passwords for every account, but:
- Humans are bad at creating random passwords
- Password managers require trust in a third party
- Many generators don't explain password strength meaningfully
- Users don't know if their passwords are being logged or stored

### Solution
YourCrypt generates passwords **server-side** using cryptographically secure randomness, calculates entropy-based strength metrics, and **immediately discards** all data. The frontend never generates passwords locally, ensuring consistent cryptographic quality. No data is stored, logged, or transmitted beyond the single request-response cycle.

### Target Users
- Security-conscious individuals who want transparency
- Developers who need to generate secure credentials
- Anyone who wants to understand password strength beyond "weak/strong" labels

---

## Architecture Overview

YourCrypt is a **client-server application** with a clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Mode Selector│  │ Password     │  │ Strength     │      │
│  │              │  │ Controls     │  │ Meter        │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                           │                                  │
│                           ▼                                  │
│                    ┌──────────────┐                          │
│                    │  API Service │                          │
│                    │  (api.js)    │                          │
│                    └──────────────┘                          │
└─────────────────────────│───────────────────────────────────┘
                          │ HTTP POST
                          │ /api/generate/
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Django)                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Password Generation Engine                          │   │
│  │  - Random: cryptographically secure RNG             │   │
│  │  - Memorable: wordlist-based with separators        │   │
│  │  - PIN: numeric-only generation                     │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Entropy Calculator                                  │   │
│  │  - Calculates bits of entropy                       │   │
│  │  - Estimates crack time (offline attack)            │   │
│  │  - Assigns strength score (1-4)                     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Component Interaction

1. **User selects mode and options** → State managed in `MainPage.jsx`
2. **User clicks "Generate Password"** → `generatePassword()` function called
3. **Frontend builds request payload** → `api.js` transforms frontend state to backend format
4. **HTTP POST to backend** → `http://127.0.0.1:8000/api/generate/`
5. **Backend generates password** → Uses appropriate algorithm based on mode
6. **Backend calculates strength** → Entropy analysis, crack time estimation
7. **Backend responds with JSON** → `{ password, strength: { score, label, entropy_bits, estimated_crack_time } }`
8. **Frontend displays results** → Password shown in `PasswordDisplay`, strength in `StrengthMeter`
9. **Backend discards all data** → No persistence, no logging

### Data Flow

```
User Input → Frontend State → API Request → Backend Generation
                                                    ↓
User Display ← Frontend State ← API Response ← Entropy Calculation
```

**Critical**: The password exists in memory only during the request-response cycle. Once the response is sent, the backend has no record of it.

---

## Features

### 1. Three Generation Modes

#### Random Password
- **Purpose**: Maximum security for high-value accounts
- **Algorithm**: Cryptographically secure random number generator (CSPRNG)
- **Configuration**:
  - Length: 4-32 characters
  - Character sets: Uppercase (A-Z), Lowercase (a-z), Numbers (0-9), Symbols (!@#$%^&*)
  - At least one character set must be selected
- **Example**: `K9#mL2$pQ7@nR4`
- **Entropy**: ~6.5 bits per character (all sets enabled)

#### Memorable Password
- **Purpose**: Passwords you need to type frequently or remember temporarily
- **Algorithm**: Random word selection from a curated wordlist + optional numeric separators
- **Configuration**:
  - Word count: 2-6 words
  - Include numbers: Adds random digits between words
- **Example**: `correct-horse-battery-staple` or `apple42tree19cloud`
- **Entropy**: ~12.9 bits per word (assuming 7776-word list)
- **Note**: Wordlists are **random, not themed**. This prevents pattern-based attacks.

#### PIN Mode
- **Purpose**: Numeric codes for low-security scenarios (phone locks, temporary access)
- **Algorithm**: Random numeric generation
- **Configuration**:
  - Length: 4-12 digits
- **Example**: `847392`
- **Entropy**: ~3.32 bits per digit
- **Warning**: PINs are inherently weak due to limited character space. A 6-digit PIN has only ~20 bits of entropy.

### 2. Entropy-Based Strength Analysis

**Unlike most password generators**, YourCrypt calculates **actual entropy** rather than using heuristics.

#### Strength Metrics

| Metric | Description | Source |
|--------|-------------|--------|
| **Score** | 1-4 rating (Weak, Fair, Good, Strong) | Backend calculation |
| **Label** | Human-readable strength | Backend calculation |
| **Entropy (bits)** | Information-theoretic randomness | `log2(possible_combinations)` |
| **Crack Time** | Estimated time for offline brute-force | Based on 10 billion guesses/second |

#### Strength Scoring Logic

The backend assigns scores based on entropy thresholds:

- **Score 1 (Weak)**: < 40 bits of entropy
- **Score 2 (Fair)**: 40-59 bits
- **Score 3 (Good)**: 60-79 bits
- **Score 4 (Strong)**: ≥ 80 bits

**Why entropy matters**: A password with 80 bits of entropy has 2^80 possible combinations (~1.2 × 10^24). At 10 billion guesses per second, this would take ~3.8 million years to crack.

#### Visual Feedback

The strength meter uses a **red-to-green gradient**:
- Red (#ef4444): Weak/Very Weak
- Amber (#f59e0b): Fair
- Green (#10b981): Good
- Deep Green (#059669): Strong

The progress bar fills proportionally (25%, 50%, 75%, 100%) and includes a shimmer animation for visual polish.

### 3. Dark Mode Support

- **Toggle**: Fixed button in top-right corner
- **Persistence**: Theme preference saved to `localStorage`
- **Implementation**: CSS custom properties with `[data-theme="dark"]` selector
- **Colors**: Dark mode uses darker versions of light mode colors (same hue, lower luminosity)

### 4. User Experience Features

- **Real-time validation**: Generate button disabled if no character sets selected (random mode)
- **Mode-specific defaults**: Switching modes adjusts length automatically (PIN→6, Memorable→4 words, Random→16 chars)
- **Copy to clipboard**: One-click copy button on password display
- **Error handling**: Network errors and backend failures shown with clear messages
- **Loading states**: Button shows loading indicator during generation
- **Responsive design**: Mobile-optimized layout (single column on small screens)

### 5. "Why Us?" Section

Interactive grid explaining security features:
- **Privacy First**: Zero storage policy
- **Entropy-Based Security**: Crack time calculator
- **Memorable & Secure**: Smart wordlist design
- **Our Promise**: "We designed the system so we can't have your data"

---

## Security & Privacy

### Where Passwords Are Generated

**All password generation happens on the backend** (Django server). The frontend **never** generates passwords locally.

**Rationale**: 
- JavaScript's `Math.random()` is **not cryptographically secure**
- `crypto.getRandomValues()` is better but still subject to browser implementation quirks
- Server-side generation using OS-level CSPRNGs (e.g., `/dev/urandom` on Linux) provides consistent, auditable security

### Randomness Sources

The backend uses Python's `secrets` module, which:
- Pulls from OS-provided CSPRNG (`/dev/urandom` on Unix, `CryptGenRandom` on Windows)
- Is suitable for generating passwords, tokens, and security-sensitive data
- Provides cryptographic-quality randomness (not pseudo-random)

### Data Storage & Transmission

| Data Type | Stored? | Logged? | Transmitted? |
|-----------|---------|---------|--------------|
| Generated password | ❌ No | ❌ No | ✅ Yes (HTTPS only in production) |
| User options (length, character sets) | ❌ No | ❌ No | ✅ Yes (request body) |
| Strength metrics | ❌ No | ❌ No | ✅ Yes (response body) |
| IP address | ⚠️ Depends on server logs | ⚠️ Depends on server logs | N/A |

**Critical clarifications**:
1. **Passwords are ephemeral**: Generated in memory, sent to client, immediately garbage-collected
2. **No database**: The application has no persistence layer for passwords
3. **No analytics**: No tracking, no telemetry, no third-party scripts
4. **HTTPS required in production**: Passwords transmitted over HTTP are vulnerable to interception

**Limitation**: If the backend server logs HTTP requests (e.g., via Django's default logging or reverse proxy logs), request bodies containing user options could theoretically be logged. **The current implementation does not explicitly disable request logging.** This is a known limitation and should be addressed in production deployments.

### Security Assumptions

1. **Backend is trusted**: Users must trust that the backend code is running as advertised
2. **Network is secure**: HTTPS must be used in production to prevent man-in-the-middle attacks
3. **Client-side storage is temporary**: Passwords displayed in the browser are vulnerable if the device is compromised
4. **Entropy calculations are estimates**: Crack time assumes a specific attack model (offline brute-force at 10 billion guesses/second)

### Known Limitations

- **No password history**: If you navigate away, the password is lost forever
- **No account system**: No way to retrieve a generated password later
- **Single-user deployment**: Backend runs on `localhost:8000`, not designed for multi-user hosting
- **No rate limiting**: Currently no protection against brute-force generation requests (though this is not a meaningful attack vector)

---

## Setup & Installation

### Prerequisites

- **Node.js**: v18+ (for frontend)
- **Python**: v3.8+ (for backend)
- **npm**: v9+ (comes with Node.js)
- **pip**: v21+ (comes with Python)

### Backend Setup (Django)

**Note**: The backend code is **not included in this repository**. The frontend expects a Django backend running at `http://127.0.0.1:8000/api/generate/`.

If you have the backend repository:

```bash
# Navigate to backend directory
cd /path/to/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations (if applicable)
python manage.py migrate

# Start development server
python manage.py runserver
```

The backend should now be running at `http://127.0.0.1:8000`.

### Frontend Setup (React + Vite)

```bash
# Clone repository
git clone https://github.com/Tejahaha/YourCrypt.git
cd YourCrypt

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start at `http://localhost:5173` (Vite's default port).

### Environment Configuration

No environment variables are required for local development. The API base URL is hardcoded in `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://127.0.0.1:8000/api';
```

For production deployment, you would need to:
1. Update `API_BASE_URL` to your production backend URL
2. Enable HTTPS for both frontend and backend
3. Configure CORS settings on the backend

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

The build output will be in the `dist/` directory.

---

## Usage Guide

### Generating a Password

1. **Select a generation mode**:
   - Click one of the three mode buttons (Random, Memorable, PIN)
   - The active mode is highlighted with a colored border

2. **Configure options**:
   - **Random mode**: Adjust length (4-32), toggle character sets
   - **Memorable mode**: Adjust word count (2-6), toggle number inclusion
   - **PIN mode**: Adjust length (4-12 digits)

3. **Click "Generate Password"**:
   - Button shows loading state during generation
   - Password appears in the display box
   - Strength meter updates with entropy and crack time

4. **Copy password**:
   - Click the copy icon button next to the password
   - Password is copied to clipboard

### Understanding Strength Metrics

- **Entropy (bits)**: Higher is better. 80+ bits is considered strong.
- **Crack Time**: Estimated time for offline brute-force attack at 10 billion guesses/second
  - "Instant": < 1 second
  - "Seconds/Minutes/Hours": Self-explanatory
  - "Years/Centuries": Effectively uncrackable with current technology

### Best Practices

- **High-security accounts** (email, banking): Use Random mode, 16+ characters, all character sets
- **Frequently-typed passwords**: Use Memorable mode, 4-5 words, include numbers
- **Temporary access**: Use PIN mode only for low-security scenarios
- **Never reuse passwords**: Generate a unique password for every account
- **Use a password manager**: YourCrypt generates passwords; you still need to store them securely

---

## Developer Guide

### Project Structure

```
YourCrypt/
├── public/                  # Static assets
├── src/
│   ├── assets/             # Images, icons
│   ├── components/         # React components
│   │   ├── AboutUs.jsx     # "Why Us" section with feature grid
│   │   ├── EncryptButton.jsx   # Generate button
│   │   ├── Footer.jsx      # Footer with links
│   │   ├── Header.jsx      # App title and icon
│   │   ├── MainPage.jsx    # Main app logic and state management
│   │   ├── ModeSelector.jsx    # Mode selection buttons
│   │   ├── PasswordControls.jsx # Length slider and checkboxes
│   │   ├── PasswordDisplay.jsx  # Password output and copy button
│   │   ├── PinWarning.jsx  # Warning for PIN mode
│   │   ├── ScrollIndicator.jsx  # Scroll-down indicator
│   │   ├── StrengthMeter.jsx    # Strength visualization
│   │   ├── ThemeToggle.jsx # Dark mode toggle
│   │   └── components.css  # Component-specific styles
│   ├── services/
│   │   └── api.js          # Backend API communication
│   ├── App.css             # App-level styles
│   ├── App.jsx             # Root component
│   ├── index.css           # Global styles and CSS variables
│   ├── main.jsx            # React entry point
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
└── README.md               # This file
```

### Key Files

| File | Purpose | Why It Matters |
|------|---------|----------------|
| `MainPage.jsx` | Central state management | All password generation logic, mode switching, error handling |
| `api.js` | Backend communication | Transforms frontend state to backend API format, handles errors |
| `StrengthMeter.jsx` | Strength visualization | **No local calculation**—displays backend data only |
| `PasswordControls.jsx` | User input | Mode-specific UI (character sets for random, word count for memorable) |
| `index.css` | Design system | CSS custom properties for colors, shadows, borders (neubrutalism theme) |

### State Management

All state is managed in `MainPage.jsx` using React's `useState`:

```javascript
const [password, setPassword] = useState('');       // Generated password
const [strength, setStrength] = useState(null);     // Strength object from backend
const [mode, setMode] = useState('random');         // Current generation mode
const [isLoading, setIsLoading] = useState(false);  // Loading state
const [error, setError] = useState(null);           // Error message
const [options, setOptions] = useState({            // User-configurable options
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    includeNumbers: false
});
```

### Adding a New Generation Mode

1. **Update `ModeSelector.jsx`**:
   ```javascript
   const modes = [
       // ... existing modes
       {
           id: 'custom',
           name: 'Custom Mode',
           icon: YourIcon,
           description: 'Your description'
       }
   ];
   ```

2. **Update `api.js`** to handle the new mode:
   ```javascript
   function buildRequestPayload(mode, options) {
       switch (mode) {
           // ... existing cases
           case 'custom':
               return {
                   mode: 'custom',
                   config: { /* your config */ }
               };
       }
   }
   ```

3. **Update `PasswordControls.jsx`** to show mode-specific options:
   ```javascript
   {mode === 'custom' && (
       <div className="control-group">
           {/* Your custom controls */}
       </div>
   )}
   ```

4. **Implement backend handler** in Django (not covered here)

### Styling System

YourCrypt uses a **neubrutalism** design system with:
- **Thick borders** (3px)
- **Brutal shadows** (6-12px offset, no blur)
- **Vibrant colors** (no pastels)
- **Bold typography** (Outfit font, 900 weight)

CSS custom properties in `index.css`:

```css
:root {
    --color-primary: #6366f1;    /* Indigo */
    --color-secondary: #f59e0b;  /* Amber */
    --color-accent: #10b981;     /* Green */
    --shadow-brutal: 6px 6px 0px var(--color-border);
    --border-thick: 3px;
}
```

Dark mode overrides:

```css
[data-theme="dark"] {
    --color-background: #0f0f0f;
    --color-text: #e5e5e5;
    /* Colors maintain same hue, darker luminosity */
}
```

### Common Pitfalls

1. **Don't calculate strength locally**: `StrengthMeter` displays backend data only. Never add client-side entropy calculations.
2. **Don't store passwords in state longer than necessary**: Clear password on mode change to avoid confusion.
3. **Don't assume backend is always available**: Handle network errors gracefully in `api.js`.
4. **Don't modify CSS custom properties directly**: Use the theme toggle to switch between light/dark modes.

### Testing

**Current state**: No automated tests are included in this repository.

**Recommended testing approach**:
1. **Unit tests**: Test `buildRequestPayload()` in `api.js` with different modes
2. **Integration tests**: Mock backend responses and test `MainPage` state updates
3. **E2E tests**: Use Playwright or Cypress to test full generation flow
4. **Manual testing**: Verify password generation for all modes, test error states (backend down, invalid options)

---

## API Documentation

### Endpoint: `POST /api/generate/`

**Base URL**: `http://127.0.0.1:8000/api`

**Request Format**:

```json
{
    "mode": "random" | "memorable" | "pin",
    "config": {
        // Mode-specific configuration
    }
}
```

### Request Examples

#### Random Mode

```json
{
    "mode": "random",
    "config": {
        "length": 16,
        "character_sets": {
            "uppercase": true,
            "lowercase": true,
            "numbers": true,
            "symbols": true
        }
    }
}
```

**Validation**:
- `length`: 4-32 (integer)
- At least one character set must be `true`

#### Memorable Mode

```json
{
    "mode": "memorable",
    "config": {
        "word_count": 4,
        "include_numbers": false
    }
}
```

**Validation**:
- `word_count`: 2-6 (integer)
- `include_numbers`: boolean

#### PIN Mode

```json
{
    "mode": "pin",
    "config": {
        "length": 6
    }
}
```

**Validation**:
- `length`: 4-12 (integer)

### Response Format

**Success (200 OK)**:

```json
{
    "password": "K9#mL2$pQ7@nR4",
    "strength": {
        "score": 4,
        "label": "Strong",
        "entropy_bits": 95.2,
        "estimated_crack_time": "3.8 million years"
    }
}
```

**Error (400 Bad Request)**:

```json
{
    "error": "At least one character set must be selected"
}
```

**Error (500 Internal Server Error)**:

```json
{
    "error": "Internal server error"
}
```

### Frontend Error Handling

The `api.js` service handles errors as follows:

1. **Network errors** (backend unreachable):
   ```
   "Unable to connect to backend. Is the server running at http://127.0.0.1:8000?"
   ```

2. **HTTP errors** (4xx, 5xx):
   ```
   "HTTP 400: Bad Request" (or backend's error message if available)
   ```

3. **Invalid response format**:
   ```
   "Invalid response format from backend"
   ```

---

## Design Philosophy

### Why Server-Side Generation?

**Trade-off**: Requires a backend server, adds network latency (~50-200ms)

**Benefits**:
- **Consistent cryptographic quality**: No reliance on browser RNG implementations
- **Auditable security**: Backend code can be reviewed and verified
- **Centralized entropy calculation**: Complex strength analysis happens in one place
- **Future extensibility**: Easy to add new modes or algorithms without frontend changes

**Alternative considered**: Client-side generation using `crypto.getRandomValues()`
- **Rejected because**: Harder to audit, browser implementation differences, no centralized strength calculation

### Why No Password Storage?

**Trade-off**: Users must copy passwords immediately or lose them forever

**Benefits**:
- **Zero trust required**: We can't leak what we don't have
- **No database to compromise**: No attack surface for password theft
- **Regulatory simplicity**: No GDPR/CCPA concerns for password data
- **User control**: Users decide where to store passwords (password manager, paper, etc.)

**Alternative considered**: Optional account system with encrypted storage
- **Rejected because**: Adds complexity, requires user trust, creates liability

### Why Entropy-Based Strength?

**Trade-off**: More complex to explain than "weak/strong" labels

**Benefits**:
- **Objective measurement**: Entropy is mathematically defined, not heuristic
- **Educational**: Users learn what makes passwords strong
- **Accurate crack time estimates**: Based on information theory, not guesswork
- **Transparent**: Users can verify calculations themselves

**Alternative considered**: Heuristic scoring (length + character diversity)
- **Rejected because**: Misleading (e.g., "Password123!" scores high but is weak due to patterns)

### Why Neubrutalism Design?

**Trade-off**: Polarizing aesthetic, not "professional" looking

**Benefits**:
- **Memorable**: Stands out from generic password generators
- **Accessible**: High contrast, large text, clear visual hierarchy
- **Honest**: Bold, direct design matches the "zero BS" security approach
- **Fun**: Makes a boring task (password generation) more engaging

**Alternative considered**: Minimalist flat design
- **Rejected because**: Generic, doesn't convey personality or trustworthiness

---

## License

This project is currently unlicensed. All rights reserved.

---

## Contributing

This is a personal project and is not currently accepting contributions. However, feel free to fork and adapt for your own use.

---

## Acknowledgments

- **Design inspiration**: Neubrutalism movement, Google Antigravity
- **Icons**: Lucide React, React Icons
- **Fonts**: Outfit (headings), Inter (body), JetBrains Mono (passwords)

---

## Contact

For questions or feedback, please open an issue on GitHub.

**Repository**: https://github.com/Tejahaha/YourCrypt

---

**Last Updated**: December 25, 2024
