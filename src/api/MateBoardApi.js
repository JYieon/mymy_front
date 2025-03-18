import axios from "axios";

const domain = "http://localhost:8080/mymy/mateboard";

const MateBoardApi = {
    // 게시글 작성
    writeMateBoard: async (postData, token) => {
        try {
            return await axios.post(`${domain}/write`, postData, {
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, 
                },
            });
        } catch (error) {
            console.error("❌ MateBoardApi writeMateBoard 에러:", error);
            throw error;
        }
    },

    // 목록 조회
    getMateBoardList: async (page = 1) => {
        try {
            const response = await axios.get(`${domain}/list`, { params: { page } });
            return response.data;
        } catch (error) {
            console.error("❌ MateBoardApi getMateBoardList 에러:", error);
            return [];
        }
    },

    // 게시글 상세 조회 
    getMateBoardDetail: async (boardNo) => {
        try {
            const response = await axios.get(`${domain}/detail/${boardNo}`);
            return response.data;
        } catch (error) {
            console.error("❌ MateBoardApi getMateBoardDetail 에러:", error);
            return null;
        }
    },

    // 댓글 목록 조회
    getReplies: async (boardNo) => {
        try {
            const response = await axios.get(`${domain}/replyList/${boardNo}`);
            return response.data;
        } catch (error) {
            console.error("❌ MateBoardApi getReplies 에러:", error);
            throw error;
        }
    },

    // 댓글 작성
    addReply: async (replyData, token) => {
        try {
            return await axios.post(`${domain}/addReply`, replyData, {
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`  // 토큰을 헤더에 포함
                }
            });
        } catch (error) {
            console.error("❌ MateBoardApi addReply 에러:", error);
            throw error;
        }
    },

    // 댓글 삭제
    deleteReply: async (replyNo, token) => {
        try {
            const response = await axios.delete(`${domain}/deleteReply/${replyNo}`, {
                headers: { 
                    "Authorization": `Bearer ${token}`  // 토큰을 헤더에 포함
                }
            });
            return response.data;
        } catch (error) {
            console.error("❌ MateBoardApi deleteReply 에러:", error);
            throw error;
        }
    },

    // 게시글 수정
    modifyMateBoard: async (boardNo, updatedData) => {
        try {
            const response = await axios.post(`${domain}/modify/${boardNo}`, updatedData, {
                headers: { "Content-Type": "application/json" },
            });
            return response.data;
        } catch (error) {
            console.error("❌ MateBoardApi modifyMateBoard 에러:", error);
            throw error;
        }
    },

    // 게시글 삭제
    deleteMateBoard: async (boardNo) => {
        try {
            const response = await axios.delete(`${domain}/delete/${boardNo}`);
            return response.data;
        } catch (error) {
            console.error("❌ MateBoardApi deleteMateBoard 에러:", error);
            throw error;
        }
    },

    // 검색 기능
    searchMateBoardList: async (page, category, searchType, keyword) => {
        keyword = keyword || "";

        // `%`로 감싸져 있다면 제거
        if (keyword.startsWith("%") && keyword.endsWith("%")) {
            keyword = keyword.substring(1, keyword.length - 1);
        }

        try {
            const response = await axios.get(`${domain}/search`, {
                params: { page, category, searchType, keyword }
            });

            return response.data?.boardList || [];
        } catch (error) {
            return [];
        }
    }
};

export default MateBoardApi;
