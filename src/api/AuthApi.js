import axios from "axios";

const domain = "http://localhost:8080/mymy/auth";

const AuthApi = {
    login: async (id, pwd) => {
        const user = {
            id: id,
            pwd: pwd,
        };
        return await axios.post(domain + "/login", user);
    },

    findId: async (name, email) => {
        return await axios.get(domain + "/find/id", {
            params:{
                name: name,
                email: email
            }
        })
    },

    sendMail: async (id, email) => {
        return await axios.post(domain + "/find/pwd", null, {
            params: {
                id: id,
                email: email,
            }
        });
    },

    resetPassword: async(id, newPwd) => {
        return await axios.post(domain + "/reset/pwd", null, {
            params: {
                id: id,
                pwd: newPwd,
            }
        })
    }, 

    authOk: async(authNum, id) => {
        return await axios.post(domain + "/mail/auth", null, {
            params: {
                userAuth: authNum,
                id: id,
            }
        })
    }, 

    checkId: async(id) => {
        return await axios.get(domain + "/check/id", {
            params: {
                id: id,
            }
        })
    },

    checkNick: async(nick) => {
        return await axios.get(domain + "/check/nick", {
            params: {
                nick: nick,
            }
        })
    },

    signupMail: async(email) => {
        return await axios.post(domain + "/signup/email/send", null, {
            params: {
                toEmail: email
            }
        })
    },

    signup: async(userData) => {
        return await axios.post(domain + "/signup", userData)
    },

    kakaoLogin: async() => {
        return await axios.get(domain + "/kakao")
    },

    kakaoCallback: async(code) => {
        return await axios.get(domain + `/kakao/callback?code=${code}`)
    },

    kakaoLogout: async() => {
        return await axios.get(domain + "/kakao/logout")
    }
}

export default AuthApi;