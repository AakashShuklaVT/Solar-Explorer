import { createContext, useContext, useState, useEffect } from "react";
import { useFetch } from "../hooks/useFetch";

const PlanetContext = createContext();

export const PlanetProvider = ({ children }) => {
    const [activePlanet, setActivePlanet] = useState("Earth");
    const [isCameraAtDestination, setIsCameraAtDestination] = useState(false)
    const { data: sunData } = useFetch(`/api/bodies/soleil`);
    const { data: allPlanetsResponse, loading, error } = useFetch(`/api/bodies?filter[]=isPlanet,eq,true`);

    const planetsData = allPlanetsResponse ? allPlanetsResponse.bodies : [];

    const activePlanetData = planetsData.find(
        (p) => p.englishName.toLowerCase() === activePlanet.toLowerCase()
    );
    
    const value = {
        planetsData,       
        activePlanet,      
        setActivePlanet,   
        activePlanetData,  
        isCameraAtDestination,
        sunData,
        loading,
        error
    };

    return (
        <PlanetContext.Provider value={value}>
            {children}
        </PlanetContext.Provider>
    );
};

export const usePlanetContext = () => {
    const context = useContext(PlanetContext);
    if (!context) {
        throw new Error("usePlanetContext must be used within a PlanetProvider");
    }
    return context;
};
