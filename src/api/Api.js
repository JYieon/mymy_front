import axios from "axios";

const domain = "http://localhost:8080/mymy";

const Api = {
    login: async (id, pwd) => {
        const user = {
            id: id,
            pwd: pwd,
        };
        return await axios.post(domain + "/login", user);
    },

    sendMail: async (id, email) => {
        console.log(id, email)
        return await axios.post(domain + "/find_pwd", null, {
            params: {
                id: id,
                email: email,
            }
        });
    },

    resetPassword: async(id, newPwd) => {
        return await axios.post(domain + "/reset_pwd", null, {
            params: {
                id: id,
                pwd: newPwd,
            }
        })
    }, 

    AuthOk: async(authNum, id) => {
        return await axios.post(domain + "/find_pwd/auth", null, {
            params: {
                userAuth: authNum,
                id: id,
            }
        })
    }
}

export default Api;