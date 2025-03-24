import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MypageApi from "../../api/MypageApi";
import FollowButton from "./FollowButton";
import UserPost from "../mypage/userPost";
import MyPost from "../mypage/MyPost";


// 사용자 프로필 
const UserProfile = () => {
    const { userId } = useParams(); // URL에서 대상 유저 아이디
    const [myId, setMyId] = useState(""); // 로그인 유저 아이디
    const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const token = localStorage.getItem("accessToken");

    // 로그인한 내 userId 가져오기
    useEffect(() => {
        const fetchMyId = async () => {
            try {
                const res = await MypageApi.getUserInfo(token); // "/userinfo/me"
                setMyId(res.userId);
            } catch (err) {
                console.error("내 userId 불러오기 실패", err);
            }
        };
        fetchMyId();
    }, [token]);

    // 팔로워/팔로잉 수 가져오기
    useEffect(() => {
        if (!userId) return;

        MypageApi.getFollowerList(userId)
            .then((res) => setFollowerCount(res.length))
            .catch((err) => console.error("팔로워 오류", err));

        MypageApi.getFollowingList(userId)
            .then((res) => setFollowingCount(res.length))
            .catch((err) => console.error("팔로잉 오류", err));
    }, [userId]);

    return (
        <div className="user-profile">
            <h2>{userId}</h2>
            <p>팔로잉: {followingCount} | 팔로워: {followerCount}</p>
            <FollowButton profileUser={userId} />

            {/* 게시글 조건 분기 */}
            {myId === userId ? <MyPost /> : <UserPost />}
        </div>
    );
};

export default UserProfile;
