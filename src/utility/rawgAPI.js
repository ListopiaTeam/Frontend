import axios from "axios";
import { badWords } from "./badwords";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebaseApp";

const URL = import.meta.env.VITE_RENDER_URL

export const searchGamesByName = async (setGames, query, url, setNextPageUrl, setPrevPageUrl) => {
    try {
        const response = await axios.get(url || URL + "searchGame/" + query + "?ordering=relevance")
        
        const filteredGames = response.data.results.filter(game => {
            const hasBadTitle = badWords.some(word => game.name.toLowerCase().includes(word.toLowerCase()));
            const hasBadTag = game.tags.some(tag => badWords.some(word => tag.name.toLowerCase().includes(word.toLowerCase())));
            return !hasBadTag && !hasBadTitle;
        })
        setNextPageUrl(response.data.next || null);
        setPrevPageUrl(response.data.previous || null);
        setGames(filteredGames)
    } catch (error) {
        console.log("searchGamesByName Error: " + error)
    }
}

export const getTags = async () => {
    try {
        console.log("Fetching tags from:", URL + "getGenres");

        const response = await axios.get(URL + "getGenres", {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });

        console.log("Full API Response:", response.data);

        if (!response.data || !response.data.results) {
            throw new Error("Invalid API response: Missing 'results' field");
        }

        return response.data.results.map(tag => tag.name);
    } catch (error) {
        console.error("getTags Error:", error);
        return [];
    }
};

export const deleteUser = async (uid) => {
    const userDocRef = doc(db, "Users", uid)
    try {
        const resp= await axios.delete(URL + "deleteUser/"+uid)
        await deleteDoc(userDocRef)
        return resp.data
    } catch (error) {
        console.log(error)
        return("Deletion failed?!")
    }
}