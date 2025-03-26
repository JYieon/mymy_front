import axios from "axios";

const domain = "http://localhost:8080/mymy";


const MypageApi = {
    // 회원 정보 수정
    modify: async (formData) => {
        return await axios.post(`${domain}/modify`, formData, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`//인증 토큰
            },
            withCredentials: true// 쿠키 전송을 위한 설정
        });
    },

    getUserInfo: async () => {
        const token = localStorage.getItem('token');
        return await axios.get(`${domain}/userinfo/me`, {
            headers: {
                Authorization: token
            },
            withCredentials: true
        });
    },

    // 회원 탈퇴
    deleteAccount: async (keepPosts) => {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            console.error("토큰이 없습니다. 로그인 후 시도해주세요.");
            return;
        }

        try {
            const response = await axios.post(
                `${domain}/userinfo/delete`,
                null,
                {
                    params: { keepPosts },
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }
            );
            return response;
        } catch (error) {
            console.error("회원 탈퇴 실패:", error);
            throw error;
        }
    },

    // 내가 쓴 글 목록 조회
    getMyPosts: async (token) => {
        try {
            const res = await axios.get(`${domain}/myboard/my-posts`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}}`//인증 토큰
                }
            });
            return res.data;
        } catch (error) {
            console.error(" MyBoardApi getMyPosts 에러:", error);
            return [];
        }
    },

    // 내가 쓴 댓글 목록 조회
    getMyComments: async (token) => {
        try {
            const res = await axios.get(`${domain}/myboard/my-comments`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}}`//인증 토큰
                }
            });
            return res.data;
        } catch (error) {
            console.error("MyBoardApi getMyComments 에러:", error);
            return [];
        }
    },
    //유저의 글
    getUserPosts: async (userId) => {
        const res = await axios.get(`${domain}/myboard/userposts`, {
            params: {
                userId: userId
            }
        });
        return res.data
    },

    //레벨 등업, 다운에 대한 api
    updateLevel: async (token) => {
        try {
            const response = await axios.post(
                `${domain}/level/update`,
                null,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }
            );
            return response.data;
        } catch (error) {
            console.error("레벨 갱신 실패:", error);
            throw error;
        }
    },




    // 알림 관련 API
    //알림 셋팅 업데이트트
    updateAlarmSettings: async (settings) => {
        return await axios.post(`${domain}/alarm/settings/update`, settings, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`, // 토큰 추가
                "Content-Type": "application/json"
            },
            withCredentials: true
        });
    },


    // 알림 설정 조회
    getAlarmSettings: async (token) => {
        return await axios.get(`${domain}/alarm/settings`, { //  memberId를 경로에 추가
            headers: {
                "Authorization": `Bearer ${token}`
            },
            withCredentials: true
        });
    },

    //알림 목록
    getAlarms: async (token) => {

        try {
            const response = await axios.get(`${domain}/alarm/list`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*"  // ✅ CORS 해결을 위한 헤더 추가 }, // ✅ userId를 헤더로 전달
                },
                withCredentials: true
            });
            return response;
        } catch (error) {
            console.error("🚨 알림 가져오기 실패:", error);
            return [];
        }
    },
    markAlarmsAsRead: async (token, no) => {
        console.log("mark")
        try {
            const response = await axios.post(
                "http://localhost:8080/mymy/alarm/mark/read",
                null,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    params: {no: no},
                    withCredentials: true 
                }
            );
            console.log("✅ 알림 읽음 처리 성공:", response.data);
        } catch (error) {
            if (error.response) {
                console.error("🚨 [서버 응답 오류]", error.response.status, error.response.data);
            } else if (error.request) {
                console.error("🚨 [요청 실패] 서버로부터 응답이 없습니다.");
            } else {
                console.error("🚨 [알 수 없는 오류]", error.message);
            }
        }
    },







    //알림 삭제
    deleteAlarms: async (userId) => {
        return await axios.delete(`${domain}/alarm/delete/${userId}`, { params: { userId } }); // 
    },

    //팔로우 관련
    // //언팔로우우
    // unfollowUser: async (followingId, token) => {
    //     try {
    //         const response = await axios.delete(`${domain}/follow/${followingId}`, {
    //             headers: { 
    //                 "Authorization": `Bearer ${token}`,
    //                 "Content-Type": "application/json" // ✅ 추가
    //             },
    //             withCredentials: true
    //         });
    //         console.log(" 언팔로우 성공:", response.data);
    //         return response.data;
    //     } catch (error) {
    //         console.error(" 언팔로우 실패:", error.response?.data || error);
    //         throw error;
    //     }
    // },



    // 팔로우 관련 API
    //팔로우 관련
    followUser: async (followingId) => {
        const token = localStorage.getItem("accessToken");

        if (!token) {
            console.error(" 토큰이 없습니다! API 요청 중단.");
            return;
        }

        try {
            const response = await axios.put(`${domain}/follow/${followingId}`, {}, {
                headers: { "Authorization": `Bearer ${token}` },
                withCredentials: true
            });

            console.log(" 팔로우 성공:", response.data);
            return response.data;
        } catch (error) {
            console.error(" 팔로우 실패:", error);
            throw error;
        }
    },

    //언팔로우 관련
    unfollowUser: async (followingId, token) => {
        try {
            const response = await axios.delete(`${domain}/follow/${followingId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            console.log(" 언팔로우 성공:", response.data);
            return response.data;
        } catch (error) {
            console.error(" 언팔로우 실패:", error);
            throw error;
        }
    },

    //팔로우 여부 확인
    isFollowing: async (followingId, token) => {
        try {
            const response = await axios.get(`${domain}/follow/isFollowing/${followingId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error(" 팔로우 여부 확인 실패:", error);
            return false; // 기본값 반환
        }
    },

    //내가 팔로우한 사람 가져오기
    getFollowingList: async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            console.error(" 토큰이 없습니다! API 요청 중단.");
            return [];
        }
        try {
            const response = await axios.get(`${domain}/follow/following`, {
                headers: { "Authorization": `Bearer ${token}` },
                withCredentials: true
            });

            console.log(" 팔로우우 목록 응답:", response.data);
            return response.data;
        } catch (error) {
            console.error(" 팔로우 목록 가져오기 실패:", error);
            return [];
        }
    },

    //나를 팔로우한 사람 가져오기
    getFollowerList: async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            console.error(" 토큰이 없습니다! API 요청 중단.");
            return [];
        }

        try {
            const response = await axios.get(`${domain}/follow/followers`, {
                headers: { "Authorization": `Bearer ${token}` },
                withCredentials: true
            });

            return response.data;
        } catch (error) {
            console.error("🚨 팔로워 목록 가져오기 실패:", error);
            return [];
        }
    },

    //팔로우 이미지 파일에 대한(임시)
    getProfileImage: async (userId) => {
        try {
            const response = await axios.get(`${domain}/user/profile/${userId}`);
            return response.data;
        } catch (error) {
            console.error("프로필 이미지 가져오기 실패:", error);
            return { profileImage: "/default-profile.jpg" }; // 기본 이미지 제공
        }
    },

    // 여행자 테스트 결과 저장
    saveTestResult: async (testResult, token) => {
        return await axios.post(`${domain}/userinfo/updateTestResult`, null, {
            params: { testResult, token }
        });
    },

    // 여행자 테스트 결과 조회 (수정)
    getTestResult: async (token) => {
        try {
            const res = await axios.get(`${domain}/userinfo/testResult`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data; // ✅ 응답 데이터 반환!
        } catch (error) {
            console.error("❌ 여행자 테스트 결과 가져오기 실패:", error);
            return ""; // 🚨 오류 발생 시 빈 값 반환
        }
    },






    // getFollowerList: async (token) => {
    //     return await axios.get(`${domain}/follow/followers/${token}`)
    // },
    // getFollowerList: async (followingId) => {
    //     return await axios.get(`${domain}/follow/followers/${followingId}`)
    // },
};

export default MypageApi;