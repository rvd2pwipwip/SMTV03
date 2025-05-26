import React from 'react';

const Header = ({ title }) => {
  return (
    <header className="header">
      <h1 className="app-title">{title}</h1>
    </header>
  );
};

export default Header; 