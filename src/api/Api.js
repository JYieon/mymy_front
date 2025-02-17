import axios from "axios";

const domain = "http://localhost:8080/mymy";

const Api = {
    login: async (id, pwd) => {
        const user = {
            id: id,
            pwd: pwd,
        };
        return await axios.post(domain + "/login", user);
    }
}

export default Api;