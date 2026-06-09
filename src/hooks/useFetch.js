import { useEffect, useState } from "react"

export const useFetch = (url) => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!url) return
        
        const fetchPlanetData = async () => {
            setLoading(true)
            setError(null)
            try {
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${import.meta.env.VITE_API_KEY}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} - ${response.statusText}`);
                }
                
                const result = await response.json()
                setData(result)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        
        fetchPlanetData()
    }, [url])

    return { data, loading, error };
}
