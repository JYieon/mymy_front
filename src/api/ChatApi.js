import axios from "axios";

const domain = "http://localhost:8080/mymy/chat";

const ChatApi =  {
    getChatList : async (token) => {
        return await axios.get(domain + "/list" , {
            params: {
                token: token
            }
        })
    },

    getUserInfo : async (token) => {
        return await axios.get(domain + "/user/info", {
            params:{
                token: token
            }
        })
    },

    getChatMessages : async (roomNum) => {
        return await axios.get(domain + "/join", {
            params:{
                roomNum: roomNum
            }
        })
    },

    createRoom : async (token, roomName) => {
        return await axios.post(domain + "/create", null, {
            params:{
                token: token,
                roomName: roomName
            }
        })
    },

    inviteChatUser : async (inviteUser, roomNum) => {
        return await axios.post(domain + "/invite", null, {
            params: {
                inviteUser: inviteUser, 
                roomNum: roomNum

            }
        })
    }
}

export default ChatApi