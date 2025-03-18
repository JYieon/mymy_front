import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import MypageApi from "../../api/MypageApi";

const FollowerList = () => {
    const { userId } = useParams();
   
    const [followers, setFollowers] = useState([]);
    const [error, setError] = useState(null);
    console.log(" URL에서 가져온 userId:", userId);


    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            setError(" 로그인 후 확인 가능합니다.");
            return;
        }

        if (!userId) {
            setError(" 유저 ID가 없습니다.");
            return;
        }

        const fetchFollowers = async () => {
            try {
                const res = await MypageApi.getFollowerList(userId, token);
                console.log("팔로워 목록:", res);
                setFollowers(Array.isArray(res) ? res : []);
            } catch (error) {
                console.error(" 팔로워 목록 불러오기 실패:", error);
                setError(" 팔로워 목록을 불러오는 중 오류가 발생했습니다.");
            }
        };

        fetchFollowers();
    }, [userId]);

        

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
