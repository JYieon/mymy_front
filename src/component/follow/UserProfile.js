import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MypageApi from "../../api/MypageApi";
import FollowButton from "./FollowButton";

//사용자 프로필 
const UserProfile = ({ loggedInUser }) => {
    const { userId } = useParams();//사용자 id가져오기기
    const [followerCount, setFollowerCount] = useState(0);//팔로워 수 저장 
    const [followingCount, setFollowingCount] = useState(0);//팔로잉 수 저장 

    // 팔로워 & 팔로잉 숫자 불러오기
    useEffect(() => {
        console.log(" 사용자 프로필 조회:", userId);
        if (!userId) return;

        // 사용자의 팔로워 가져오기기
        MypageApi.getFollowerList()
            .then((res) => {
                console.log(" 팔로워 목록:", res);
                //사용자를 팔로우한 사람들만 필터링해서 개수 저장장
                const userFollowers = res.filter(user => user.followerId === userId);
                setFollowerCount(userFollowers.length);
            })
            .catch((err) => console.error(" 팔로워 불러오기 오류", err));

        // 팔로잉 목록 가져오기
        MypageApi.getFollowingList()
            .then((res) => {
                console.log(" 팔로잉 목록:", res);
                //필터링해서 개수 저장장
                const userFollowing = res.filter(user => user.followingId === userId);
                setFollowingCount(userFollowing.length);
            })
            .catch((err) => console.error(" 팔로잉 불러오기 오류", err));
    }, [userId]);//id가 변경될 때마다 실행

    return (
        <div className="user-profile">
            <h2>{userId}</h2>
            <p>팔로워: {followerCount} | 팔로잉: {followingCount}</p>
            <FollowButton loggedInUser={loggedInUser} profileUser={userId} />
        </div>
    );
};

export default UserProfile;
