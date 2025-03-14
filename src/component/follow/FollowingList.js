import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const FollowingList = () => {
    const { userId } = useParams(); //  URL에서 userId 가져오기
    const [following, setFollowing] = useState([]);

    useEffect(() => { console.log("🔍 팔로우 목록 요청 시작:", userId);
        if (!userId) return; // userId가 없으면 실행 안 함

        console.log("팔로잉 목록 불러오기:", userId);

        axios.get(`http://localhost:8080/mymy/follow/following/${userId}`)
    .then(response => {
        console.log("팔로잉 목록 응답 데이터:", response.data);
        setFollowing(response.data || []);
    })
    .catch(error => console.error("팔로우 목록 불러오기 실패:", error));


    }, [userId]);

    return (
        <div className="following-list">
            <h2>{userId}의 팔로잉 목록 (내가 팔로우한 사람)</h2>

            <div className="user-grid">
                {following.length === 0 ? (
                    <p>팔로우한 사용자가 없습니다.</p>
                ) : (
                    <ul>
                        {following.map(user => (
                            <div className="user-card" key={user?.followingId || Math.random()}>
                                <Link to={`/profile/${user?.followingId}`}>
                                    <img src="profile.jpg" alt="프로필 이미지" />
                                    <p>{user?.followingId}</p>
                                </Link>
                            </div>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default FollowingList;
