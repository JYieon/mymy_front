import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/mymy/",
    headers: {
        "Content-Type" : "application/json",
    },
});