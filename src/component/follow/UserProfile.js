import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MypageApi from "../../api/MypageApi";
import FollowButton from "./FollowButton";

const UserProfile = ({ loggedInUser }) => {
    const { userId } = useParams();
    const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

    // 팔로워 & 팔로잉 숫자 불러오기
    useEffect(() => {
        console.log(" 사용자 프로필 조회:", userId);
        if (!userId) return;

        // 팔로워 목록 가져오기
        MypageApi.getFollowerList()
            .then((res) => {
                console.log(" 팔로워 목록:", res);
                const userFollowers = res.filter(user => user.followerId === userId);
                setFollowerCount(userFollowers.length);
            })
            .catch((err) => console.error(" 팔로워 불러오기 오류", err));

        // 팔로잉 목록 가져오기
        MypageApi.getFollowingList()
            .then((res) => {
                console.log(" 팔로잉 목록:", res);
                const userFollowing = res.filter(user => user.followingId === userId);
                setFollowingCount(userFollowing.length);
            })
            .catch((err) => console.error(" 팔로잉 불러오기 오류", err));
    }, [userId]);

    return (
        <div className="user-profile">
            <h2>{userId}</h2>
            <p>팔로워: {followerCount} | 팔로잉: {followingCount}</p>
            <FollowButton loggedInUser={loggedInUser} profileUser={userId} />
        </div>
    );
};

export default UserProfile;
