import axios from "axios";

const domain = "http://localhost:8080/mymy/board";

const BoardApi = {
    // ✅ 게시글 상세 조회
    detail: async (boardNo) => {
        return await axios.get(`${domain}/detail?boardNo=${boardNo}`);
    },

    // ✅ 게시글 저장 (글쓰기)
    writeSave: async (postData) => {
        console.log("📤 전송 데이터:", postData);
        try {
            return await axios.post(`${domain}/writeSave`, postData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
        } catch (error) {
            console.error("❌ BoardApi writeSave 에러:", error);
            throw error;
        }
    },
    

    // ✅ 게시글 수정
    modify: async (postData) => {
        try {
            return await axios.post(`${domain}/modify`, postData, {
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("❌ BoardApi modify 에러:", error);
            throw error;
        }
    },

    // ✅ 게시글 삭제
    delete: async (boardNo) => {
        try {
            return await axios.delete(`${domain}/delete/${boardNo}`);
        } catch (error) {
            console.error("❌ BoardApi delete 에러:", error);
            throw error;
        }
    },

    // ✅ 좋아요 상태 확인
    checkLike: async (boardNo) => {
        try {
            return await axios.get(`${domain}/like/check?boardNo=${boardNo}`);
        } catch (error) {
            console.error("❌ BoardApi checkLike 에러:", error);
            throw error;
        }
    },

    // ✅ 좋아요 토글
    toggleLike: async (boardNo) => {
        try {
            return await axios.post(`${domain}/like?boardNo=${boardNo}`);
        } catch (error) {
            console.error("❌ BoardApi toggleLike 에러:", error);
            throw error;
        }
    },

    // ✅ 북마크 상태 확인
    checkBookmark: async (boardNo) => {
        try {
            return await axios.get(`${domain}/bookmark/check`, {
                params: { id: "a", boardNo: boardNo }
        });
        } catch (error) {
            console.error("❌ BoardApi checkBookmark 에러:", error);
            throw error;
        }
    },

    // ✅ BoardApi.js 수정
toggleBookmark: async (boardNo) => {
    try {
        const res = await axios.post(`${domain}/bookmark/toggle`, null, {
            params: { id: "a", boardNo: boardNo }
        });
        return res.status === 200; // 성공 시 true 반환
    } catch (error) {
        console.error("❌ BoardApi toggleBookmark 에러:", error);
        throw error;
    }
}

};

export default BoardApi;
