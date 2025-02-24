import axios from "axios";

const domain = "http://localhost:8080/mymy/board";

const BoardApi = {

    // 게시글 상세 조회
    detail: async (boardNo) => {
        return await axios.get(`${domain}/detail?boardNo=${boardNo}`);
    },

    // 게시글 저장 (글쓰기)
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


    // 게시글 수정
    modify: async (postData) => {
        try {
            console.log("📤 수정 요청 데이터:", postData);
            return await axios.post(`${domain}/modify`, postData, {
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("❌ BoardApi modify 에러:", error);
            throw error;
        }
    },

    // 게시글 수정 폼 데이터 조회 (게시글 + 해시태그)
    getModifyFormData: async (boardNo) => {
        try {
            const res = await axios.get(`${domain}/modifyForm/${boardNo}`);
            return res.data;  // { post: {...}, hashtags: [...] }
        } catch (error) {
            console.error("❌ BoardApi getModifyFormData 에러:", error);
            throw error;
        }
    },

    // 게시글 삭제
    delete: async (boardNo) => {
        try {
            return await axios.delete(`${domain}/delete/${boardNo}`);
        } catch (error) {
            console.error("❌ BoardApi delete 에러:", error);
            throw error;
        }
    },

    // 좋아요 상태와 개수 확인
    checkLike: async (boardNo) => {
        try {
            const res = await axios.get(`${domain}/like/check?boardNo=${boardNo}`);
            return res.data; // { liked: true/false, likes: number } 형태로 반환
        } catch (error) {
            console.error("❌ BoardApi checkLike 에러:", error);
            throw error;
        }
    },

    // 좋아요 토글
    toggleLike: async (boardNo) => {
        try {
            const res = await axios.post(
                `${domain}/like/toggle`,
                { boardNo: boardNo },
                { headers: { "Content-Type": "application/json" } }
            );
            return res.data;  // { liked: true/false, likes: number }
        } catch (error) {
            console.error("❌ BoardApi toggleLike 에러:", error);
            throw error;
        }
    },
    // 북마크 상태 확인
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

    // BoardApi.js 수정
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
    },
    // 북마크된 게시글 목록 불러오기
    getBookmarkList: async () => {
        try {
            const response = await axios.get(`${domain}/bookmark/list`, {
                params: { id: "a" }
            });
            console.log("📚 북마크 리스트 응답 데이터:", response.data); // 디버깅 로그 추가
            return response.data;  // ✅ 배열 반환 (boardList 또는 빈 배열)
        } catch (error) {
            console.error("❌ BoardApi getBookmarkList 에러:", error);
            return [];
        }
    },

    // 댓글 목록 조회
    getReplies: async (boardNo) => {
        try {
            const response = await axios.get(`${domain}/replyList/${boardNo}`);
            return response;
        } catch (error) {
            console.error("❌ BoardApi getReplies 에러:", error);
            throw error;
        }
    },

    // 댓글 작성
    addReply: async (replyData) => {
        try {
            const response = await axios.post(`${domain}/addReply`, replyData, {
                headers: { "Content-Type": "application/json" },
            });
            return response;
        } catch (error) {
            console.error("❌ BoardApi addReply 에러:", error);
            throw error;
        }
    },

    // 댓글 삭제
    deleteReply: async (replyNo) => {
        try {
            const response = await axios.delete(`${domain}/deleteReply/${replyNo}`);
            return response;
        } catch (error) {
            console.error("❌ BoardApi deleteReply 에러:", error);
            throw error;
        }
    },

    // 해시태그 조회 API
    getTags: async (boardNo) => {
        try {
            const response = await axios.get(`${domain}/tags/${boardNo}`);
            return response.data;  // 해시태그 배열 반환
        } catch (error) {
            console.error("❌ BoardApi getTags 에러:", error);
            return [];
        }
    },

};

export default BoardApi;
