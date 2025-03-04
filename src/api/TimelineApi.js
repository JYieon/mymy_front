import axios from "axios";

const domain = "http://localhost:8080/mymy/timeline";

const TimelineApi = {
    // ✅ 타임라인 저장 (일정 추가)
    addTimeline: async (timelineData) => {
        console.log("📤 전송 데이터:", timelineData);
        try {
            // todo 필드가 객체라면 JSON 문자열로 변환
            if (typeof timelineData.todo !== "string") {
                timelineData.todo = JSON.stringify(timelineData.todo);
            }

            const response = await axios.post(`${domain}/add`, timelineData, {
                headers: { "Content-Type": "application/json" },
            });
            return response;
        } catch (error) {
            console.error("❌ TimelineApi addTimeline 에러:", error);
            throw error;
        }
    },

    // ✅ 특정 게시글의 타임라인 불러오기
    getTimeline: async (boardNo) => {
        try {
            const response = await axios.get(`${domain}/${boardNo}`);
            return response.data;
        } catch (error) {
            console.error("❌ TimelineApi getTimeline 에러:", error);
            throw error;
        }
    },
};

export default TimelineApi;
