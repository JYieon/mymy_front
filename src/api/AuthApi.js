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

    authOk: async(authNum, id) => {
        return await axios.post(domain + "/mail_auth", null, {
            params: {
                userAuth: authNum,
                id: id,
            }
        })
    }, 

    checkId: async(id) => {
        return await axios.post(domain + "/id_check", null, {
            params: {
                id: id,
            }
        })
    },

    signupMail: async(email) => {
        return await axios.post(domain + "/signup_email_send", null, {
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
    }
}

export default AuthApi;