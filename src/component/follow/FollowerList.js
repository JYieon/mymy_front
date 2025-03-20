import React, { useState, useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import MypageApi from "../../api/MypageApi";
import ChatApi from "../../api/ChatApi";

//팔로워 목록
const FollowerList = () => {
    // const { userId } = useParams();
   
    const [followers, setFollowers] = useState([]);
    const [error, setError] = useState(null);


    useEffect(() => {
        const token = localStorage.getItem("accessToken");//사용자 토큰 확인인
        if (!token) {
            setError(" 로그인 후 확인 가능합니다.");
            return;
        }
        const fetchUserInfo = async () => {
            try {
                const res = await ChatApi.getUserInfo(token); // ✅ 로그인한 사용자 정보 가져오기
                console.log("백엔드에서 가져온 userId:", res.data.id);
                setUserId(res.data.id);
            } catch (error) {
                console.error("🚨 userId 가져오기 실패:", error);
                Navigate("/login"); // ✅ 실패하면 로그인 페이지로 이동
            }
        };

        //서버에서 팔로워 정보를 가져옴옴
        const fetchFollowers = async () => {
            try {
                const res = await MypageApi.getFollowerList(userId, token); //api 요청청
                console.log("팔로워 목록:", res);
                //서버에서 받은 데이터가 배열인지 확인 후 저장장
                setFollowers(Array.isArray(res) ? res : []);
            } catch (error) {
                console.error(" 팔로워 목록 불러오기 실패:", error);
                setError(" 팔로워 목록을 불러오는 중 오류가 발생했습니다.");
            }
        };

        fetchFollowers();
    }, []);

        

        // axios.get(`http://localhost:8080/mymy/follow/followers?token=${token}`)
        //     .then(response => {
        //         console.log("팔로워 목록 응답:", response.data);
        //         setFollowers(Array.isArray(response.data) ? response.data : []); //  응답이 배열인지 체크
        //     })
        //     .catch(error => {
        //         console.error("팔로워 목록 불러오기 실패:", error);
        //         setError("팔로워 목록을 불러오는 중 오류가 발생했습니다.");
        //     });

    

    return (
        <div className="follower-list">
            <h2>{userId}의 팔로워 (나를 팔로우하는 사람)</h2>

            {error && <p className="error-message">{error}</p>}

            <div className="user-grid">
                {followers.length === 0 ? (
                    <p>팔로워가 없습니다.</p>
                ) : (
                    <ul>
                        {followers.map(user => (
                            <div className="user-card" key={user?.followerId || Math.random()}>
                                <Link to={`/profile/${user?.followerId}`}>
                                    <img src="profile.jpg" alt="프로필 이미지" />
                                    <p>{user?.followerId}</p>
                                </Link>
                            </div>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default FollowerList;
