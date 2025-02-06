import axios from "axios";
import { badWords } from "./badwords";

const URL = import.meta.env.VITE_RENDER_URL

export const searchGamesByName = async (setGames, query, page) => {
    try {
        const response = await axios.get(URL + "searchGame/" + query + "?ordering=added&page=" + page)
        
        const filteredGames = response.data.results.filter(game => {
            const hasBadTitle = badWords.some(word => game.name.toLowerCase().includes(word.toLowerCase()));
            const hasBadTag = game.tags.some(tag => badWords.some(word => tag.name.toLowerCase().includes(word.toLowerCase())));
            return !hasBadTag && !hasBadTitle;
        })
        console.log(response);
        
        setGames(filteredGames)
    } catch (error) {
        console.log(error)
    }
}

export const getTags = async (setTags) => {
    try {
        const response = await axios.get(URL + "getGenres/")
        setTags(response.json())
    } catch (error) {
        console.log(error);
    }
}