import axios from "axios";

const domain = "http://localhost:8080/mymy/timeline";

const TimelineApi = {
    // 타임라인 추가
    addTimeline: async (timelineData, token) => {
        try {
            return await axios.post(`${domain}/add`, timelineData, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error("❌ addTimeline 에러:", error);
            throw error;
        }
    },

    // 타임라인 조회
    getTimeline: async (boardNo) => {
            return await axios.get(`${domain}/${boardNo}`, {
            });
    },

    // 타임라인 삭제
    deleteTimeline: async (timelineId) => {
        try {
            return await axios.delete(`${domain}/delete/${timelineId}`);
        } catch (error) {
            console.error("❌ deleteTimeline 에러:", error);
            throw error;
        }
    },

    // 타임라인 일정 수정
    updateTimelineTodo: async (data) => {
        try {
            return await axios.post(`${domain}/updateTodo`, data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
        } catch (error) {
            console.error("❌ updateTimelineTodo 에러:", error);
            throw error;
        }
    },
};

export default TimelineApi;
