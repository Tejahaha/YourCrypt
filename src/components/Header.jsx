import React from 'react';
import { HiShieldCheck } from 'react-icons/hi2';
import './components.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-icon">
        <HiShieldCheck />
      </div>
      <h1 className="header-title">YourCrypt</h1>
      <p className="header-subtitle">Generate secure, random passwords instantly</p>
    </header>
  );
};

export default Header;
