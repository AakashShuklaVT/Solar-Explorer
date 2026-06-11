import React from 'react';

const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="spinner"></div>
      <div className="loader-text">Initializing Solar System...</div>
    </div>
  );
};

export default Loader;
