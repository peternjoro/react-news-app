import axios from "axios";

const URL = 'https://newsapi.org/v2';
const API_KEY = "27cc202120c344819aed61b551f3dbbe";

export default axios.create({
    baseURL: URL,
    headers: {
        "Content-Type": "application/json",
        "X-Api-Key": API_KEY
    }
});