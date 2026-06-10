import React from 'react'
import { usePlanetContext } from '../../context/PlanetContext'

const Sidebar = () => {
    const { planetsData, activePlanet, setActivePlanet } = usePlanetContext()

    return (
        <nav className="sidebar">
            <h2 style={{ fontSize: '14px', letterSpacing: '2px', marginBottom: '10px', color: '#2271b3' }}>PLANETS</h2>
            {
                planetsData && planetsData.map((planet) => {
                    return (
                        <button 
                            key={planet.id}
                            className={activePlanet === planet.englishName ? 'active' : ''}
                            onClick={() => setActivePlanet(planet.englishName)}
                        >
                            {planet.englishName}
                        </button>
                    )
                })
            }
        </nav>
    )
}

export default Sidebar