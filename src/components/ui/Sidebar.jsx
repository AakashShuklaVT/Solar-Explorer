import React from 'react'
import { usePlanetContext } from '../../context/PlanetContext'

const Sidebar = () => {
    const { planets, activePlanet, setActivePlanet } = usePlanetContext()

    return (
        <nav className="sidebar">
            <h2 style={{ fontSize: '14px', letterSpacing: '2px', marginBottom: '10px', color: '#2271b3' }}>PLANETS</h2>
            {
                planets.map((planet) => {
                    return (
                        <button 
                            key={planet}
                            className={activePlanet === planet ? 'active' : ''}
                            onClick={() => setActivePlanet(planet)}
                        >
                            {planet}
                        </button>
                    )
                })
            }
        </nav>
    )
}

export default Sidebar