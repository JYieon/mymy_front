import axios from "axios";

const domain = "http://localhost:8080/mymy/board";

const BoardApi = {

    //기록 게시판 검색
    searchBoardList: async (page, category, searchType, keyword) => {
        console.log("계획 검색 요청:", { page, category, searchType, keyword });
        return await axios.get(`${domain}/search`, {
            params: { page, category, searchType, keyword },
        }).then(response => {
            //console.log("검색 API 응답 데이터:", response.data);  // 응답 확인
            return response.data;
        }).catch(error => {
            console.error("❌ 검색 API 요청 실패:", error);
            throw error;
        });
    },

    // 게시글 목록 조회 (카테고리 추가)
    getBoardList: async (page, category, token) => {
        return await axios.get(`${domain}/list`, {
            params: { page, category, token },  // 쿼리 파라미터로 전달
        }).catch(error => {
            console.error("게시글 목록 조회 실패:", error);
            throw error;
        });

    },

    // 게시글 상세 조회
    detail: async (boardNo) => {
        return await axios.get(`${domain}/detail?boardNo=${boardNo}`);
    },

    // 게시글 저장 (글쓰기)
    writeSave: async (postData, token) => {
        //console.log("전송 데이터:", postData);
        try {
            return await axios.post(`${domain}/writeSave`, postData, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error("❌ BoardApi writeSave 에러:", error);
            throw error;
        }
    },


    // 게시글 수정
    modify: async (postData, token) => {
        console.log("토큰 확인:", token);
        try {
            return await axios.post(`${domain}/modify`, postData, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`  // 수정 요청에 토큰 추가
                },
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
    delete: async (boardNo, token) => {
        try {
            return await axios.delete(`${domain}/delete/${boardNo}`, {
                headers: { "Authorization": `Bearer ${token}`}
            });
        } catch (error) {
            console.error("❌ BoardApi delete 에러:", error);
            throw error;
        }
    },

    // 사용자가 좋아요 눌렀는지 확인
    checkLike: async (boardNo, token) => {
        const res = await axios.get(`${domain}/likes/check`, {
            params: { boardNo, token } // 
        }); return res.data; // 
    },

    // 좋아요 상태와 개수 확인
    getLikes: async (boardNo) => {
        const res = await axios.get(`${domain}/likes/count`, { params: { boardNo } });
        return res.data.likes;  // 
    },

    // 좋아요 토글
    toggleLike: async (boardNo, token) => {
        try {
            const res = await axios.post(`${domain}/likes/toggle`, null, {
                params: { boardNo, token }
            });
            return res.data;  // { liked: true/false, likes: number }
        } catch (error) {
            console.error("❌ BoardApi toggleLike 에러:", error);
            throw null;
        }
    },
    // 북마크 상태 확인
    checkBookmark: async (boardNo, token) => {

        return await axios.get(`${domain}/bookmark/check`, {
            params: { boardNo: boardNo, token: token },
        });

    },

    // 북마크 추가
    toggleBookmark: async (boardNo, token) => {
        return await axios.post(`${domain}/bookmark/toggle`, null, {
            params: { boardNo: boardNo, token: token },
        });
    },
    // 북마크된 게시글 목록 불러오기
    getBookmarkList: async (token) => {
        return await axios.get(`${domain}/bookmark/list`, {
            params: { token },
        });
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
    addReply: async (replyData, token) => {
        try {
            return await axios.post(`${domain}/addReply`, replyData, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`  // 토큰을 헤더에 포함
                }
            });

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
