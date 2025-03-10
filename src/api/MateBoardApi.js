import axios from "axios";

const domain = "http://localhost:8080/mymy/mateboard";

const MateBoardApi = {
    // 게시글 작성
    writeMateBoard: async (postData) => {
        try {
            const response = await axios.post(`${domain}/write`, postData, {
                headers: { "Content-Type": "application/json" },
            });
            return response.data;
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

        // console.log("여행 메이트 검색 요청:", { page, category, searchType, keyword });

        try {
            const response = await axios.get(`${domain}/search`, {
                params: { page, category, searchType, keyword }
            });

            // console.log("검색 API 응답 데이터:", response.data);
            return response.data?.boardList || []; // `boardList`만 반환
        } catch (error) {
            // console.error("❌ 검색 API 요청 실패:", error);
            return []; // 
        }
    }
};

export default MateBoardApi;
