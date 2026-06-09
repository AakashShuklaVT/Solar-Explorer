import { createContext, useContext, useState } from "react";
import { useFetch } from "../hooks/useFetch";

const PlanetContext = createContext()
const planets = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"]


export const PlanetProvider = ({ children }) => {
    const [activePlanet, setActivePlanet] = useState("Earth")
    // Reverting to the direct ID-based path
    const url = `/api/bodies/${activePlanet.toLowerCase()}`
    const {data, loading, error} = useFetch(url)

    console.log("--- Planet Context Debug ---");
    console.log("Target URL:", url);
    console.log("Data Received:", data);
    
    const value = {
        planets,
        activePlanet,
        setActivePlanet,
        data,
        loading,
        error
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
