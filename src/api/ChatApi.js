import axios from "axios";
import { param } from "jquery";

const domain = "http://3.39.66.94:8080/mymy/chat";

const ChatApi =  {
    getChatList : async (token) => {
        return await axios.get(domain + "/list" , {
            params: {
                token: token
            }
        })
    },

    getUserInfo : async (token) => {
        return await axios.get(domain + "/user/info", { headers: { Authorization: `Bearer ${token}` } })
        //     params:{
        //         token: token
        //     }
        // })
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

    inviteChatUser : async (token, inviteUser, roomNum) => {
        return await axios.post(domain + "/invite", null, {
            params: {
                token: token,
                inviteUser: inviteUser, 
                roomNum: roomNum

            }
        })
    },

    endChat : async (roomNum, token) => {
        return await axios.delete(domain + "/endChat", {
            params: {
                roomNum: roomNum,
                token: token
            }
        })
    },

    checkUserBank : async (token, bankCode, bankNum) => {
        return await axios.get(domain + "/bank/check/name", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            params: {
                bankCode, bankCode,
                bankNum, bankNum
            }
        })
    },

    getAdjustmentList : async (roomNum) => {
        return await axios.get(domain + "/settlement/list", {
            params: {
                roomNum: roomNum
            }
        })
    },

    addAdjustment : async (amount, toMember, roomNum, memberNum) => {
        return await axios.post(domain + "/settlement/add", null, {
            params: {
                money: amount,
                roomNum: roomNum, 
                toMember: toMember, 
                roomMember: memberNum
            }
        })
    },

    sendAdjustment : async (token, adNum, adMemberNum) => {
        return await axios.post(domain + "/settlement", null, {
            params: {
                token: token,
                settleNum: adNum,
                settleMember: adMemberNum
            }
        })
    },

    getAdjustmentServiceList : async (adNum) => {
        return await axios.get(domain + "/settlement/service", {
            params: {
                settleNum: adNum
            }
        })
    },

    getBankList : async (roomNum) => {
        return await axios.get(domain + "/bank/check", {
            params: {
                roomNum: roomNum
            }
        })
    },

    makeBank : async (roomNum, bankName, targetMoney) => {
        return await axios.post(domain + "/bank/make", null, {
            params: {
                roomNum: roomNum,
                bankName: bankName,
                target: targetMoney
            }
        })
    },

    getBankServiceList : async (bankNum) => {
        return await axios.get(domain + "/bank/service/info", {
            params: {
                bankNum: bankNum
            }
        })
    },

    updateBank : async (token, bankNum, roomNum, type, money) => {
        return await axios.post(domain + "/bank/service", null,  {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            params: {
                bankNum: bankNum,
                roomNum: roomNum,
                type: type,
                money: money
            }
        })
    }
}

export default ChatApi