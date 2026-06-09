import { useEffect, useState } from "react"

export const useFetch = (url) => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchPlanetData = async () => {

            setLoading(true)
            setError(null)
            try {
                const response = await fetch('https://api.le-systeme-solaire.net/rest/bodies/earth', {
                    headers: {
                        Authorization: `Bearer 97e35323-1f8e-42ce-a0af-160f7a70b3f3`,
                        'Content-Type': 'application/json'
                    },
                    method: 'GET'
                })
                const data = await response.json();
                console.log("=========>>>Data", data)
            }
            catch (error) {
                console.log("=========>>>Error", error)
            }
        }
        if (!url) return
        fetchPlanetData()
    }, [url])

    return { data, loading, error };
}