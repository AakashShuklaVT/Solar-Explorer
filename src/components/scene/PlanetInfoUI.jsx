import React from 'react';
import { Html } from '@react-three/drei';

const PlanetInfoUI = ({ planetData, isVisible, scale }) => {
  if (!isVisible) return null;

  // Position the UI offset from the planet's surface
  // The planet radius is 1, visually it's 1 * scale
  const offset = scale * 1.5;

  return (
    <Html 
      position={[offset, offset, 0]} 
      center 
      distanceFactor={scale * 4.5} 
    >
      <div className="planet-card">
        <h3>{planetData.englishName}</h3>
        <div className="info-grid">
          <div className="info-item">
            <span>Mass</span>
            <p>{planetData.mass?.massValue}e{planetData.mass?.massExponent} kg</p>
          </div>
          <div className="info-item">
            <span>Gravity</span>
            <p>{planetData.gravity} m/s²</p>
          </div>
          <div className="info-item">
            <span>Mean Radius</span>
            <p>{planetData.meanRadius.toLocaleString()} km</p>
          </div>
          <div className="info-item">
            <span>Avg Temp</span>
            <p>{planetData.avgTemp ? (planetData.avgTemp - 273.15).toFixed(1) : 'N/A'}°C</p>
          </div>
        </div>
      </div>
    </Html>
  );
};

export default PlanetInfoUI;
