import axios from "axios";

const domain = "http://localhost:8080/mymy";


const MypageApi = {
    // 회원 정보 수정
    modify: async (formData) => {
        return await axios.post(`${domain}/modify`, formData, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
        });
    },

    // 알림 관련 API
    getAlarmSettings: async (userId) => {
        return await axios.get(`${domain}/alarm/settings/${userId}`);
    },
    getAlarms: async (userId) => {
        return await axios.get(`${domain}/alarm/list`, { params: { userId } });
    },
    deleteAlarms: async (userId) => {
        return await axios.delete(`${domain}/alarm/delete`, { params: { userId } }); // 
    },
    updateAlarmSettings: async (userId, settings) => {
        return await axios.post(`${domain}/alarm/settings/update`, { userId, ...settings });
    },

    // 팔로우 관련 API
    followUser: async (followerId, followingId) => {
        return await axios.put(`${domain}/follow/${followerId}/${followingId}`); //  
    },
    unfollowUser: async (followerId, followingId) => {
        return await axios.delete(`${domain}/follow/${followerId}/${followingId}`); // 
    },
    isFollowing: async (followerId, followingId) => {
        return await axios.get(`${domain}/follow/isFollowing/${followerId}/${followingId}`)
            .then(response => response.data);
    },
    getFollowingList: async (followerId) => {
        return await axios.get(`${domain}/follow/following/${followerId}`)
            .then(response => response.data);
    },
    getFollowerList: async (followingId) => {
        return await axios.get(`${domain}/follow/followers/${followingId}`)
            .then(response => response.data);
    },
};

export default MypageApi;