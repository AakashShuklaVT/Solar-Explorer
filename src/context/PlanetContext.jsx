import { createContext, useContext, useState } from "react";
import { useFetch } from "../hooks/useFetch";

const PlanetContext = createContext()
const planets = ["Sun", "Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"]


export const PlanetProvider = ({ children }) => {
    const [activePlanet, setActivePlanet] = useState("Earth")
    const url = `/api/bodies/${activePlanet.toLowerCase()}`
    const {data, loading, error} = useFetch(url)
    const {data: sunData} = useFetch(`/api/bodies/sun`)
    console.log("Data Received:", data);
    
    const value = {
        planets,
        activePlanet,
        setActivePlanet,
        data,
        loading,
        error,
        sunData
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
