import axios from "axios";

const URL = import.meta.env.VITE_RENDER_URL

export const searchGamesByName = async (setGames, query) => {
    try {
        const response = await axios.get(URL + "searchGame/" + query)
        
        setGames(response.data.results)
    } catch (error) {
        console.log(error)
    }
}