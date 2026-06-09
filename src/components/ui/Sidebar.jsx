import React from 'react'
import { usePlanetContext } from '../../context/PlanetContext'

const Sidebar = () => {
    const { planets, activePlanet, setActivePlanet } = usePlanetContext()
    console.log(activePlanet);

    return (
        <ul>
            {
                planets.map((planet, index) => {
                    return (
                        <li key={index}><span>{planet}</span> <button onClick={() => {
                            setActivePlanet(planet)
                        }}>Select</button></li>
                    )
                })
            }
        </ul>
    )
}

export default Sidebar