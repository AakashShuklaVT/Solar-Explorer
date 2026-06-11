import React from 'react';
import { Html } from '@react-three/drei';
import { usePlanetContext } from '../../context/PlanetContext';

const PlanetInfoUI = ({ planetData, isVisible, scale }) => {
  const { setActivePlanet } = usePlanetContext();
  if (!isVisible) return null;
  
  // Position the UI offset from the planet's surface
  const offset = scale * 1.5;

  return (
    <Html 
      position={[offset, offset, 0]} 
      center 
      distanceFactor={scale * 8.5} 
    >
      <div className="planet-card">
        <h3>
          {planetData.englishName}
          <button className="close-btn" onClick={() => setActivePlanet(null)}>×</button>
        </h3>
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
          <div className="info-item">
            <span>Number of moons : </span>
            <p>{planetData.moons?.length > 0? planetData.moons.length : 'N/A'}</p>
          </div>
        </div>
      </div>
    </Html>
  );
};

export default PlanetInfoUI;
