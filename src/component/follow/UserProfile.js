import React, { useState, useEffect } from "react";
import axios from "axios";
import FollowButton from "./FollowButton";
import { useParams } from "react-router-dom";

const UserProfile = ({ loggedInUser }) => {
    const { userId } = useParams();
    const [followerCount, setFollowerCount] = useState(0);

    useEffect(() => {
        //  상대방의 팔로워 수 조회
        console.log("사용자 프로필 불러오기:", userId);
        if (!userId) return;

        axios.get(`http://localhost:8080/mymy/follow/followers/${userId}`)
        then((res) => {
            console.log("API 응답 데이터: ", res.data);
            setFollowers(res.data); // followers 목록 업데이트
        })
        .catch((err) => console.error("팔로워 불러오기 오류", err));
    }, [userId]);

    return (
        <div className="user-profile">
            <h2>{userId}</h2>
            <p>팔로워: {followerCount}</p>
            <FollowButton loggedInUser={loggedInUser} profileUser={userId} />
        </div>
    );
};

export default UserProfile;
