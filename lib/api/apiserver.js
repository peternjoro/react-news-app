import axios from "axios";

const URL = process.env.DOCKER_API_HOST;

export default axios.create({
    baseURL: URL,
    auth: {}
});