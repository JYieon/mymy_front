import axios from "axios";

const api = axios.create({
    baseURL: "http://3.39.66.94:8080/mymy/",
    headers: {
        "Content-Type" : "application/json",
    },
});