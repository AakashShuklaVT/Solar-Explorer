import { createContext, useContext, useState } from "react";

const PlanetContext = createContext()
const planets = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"]


export const PlanetProvider = ({ children }) => {
    const [activePlanet, setActivePlanet] = useState("Earth")

    const value = {
        planets,
        activePlanet,
        setActivePlanet
    }

    return (
        <PlanetContext.Provider value={value}>
            {children}
        </PlanetContext.Provider>
    )
}


export const usePlanetContext = () => {
    const context = useContext(PlanetContext)
    if (!context) {
        throw new Error("usePlanetContext must be used within an PlanetProvider");
    }
    return context
}
