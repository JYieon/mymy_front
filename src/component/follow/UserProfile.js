import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MypageApi from "../../api/MypageApi";
import FollowButton from "./FollowButton";
import MyPost from "../mypage/MyPost"; 


//사용자 프로필 
const UserProfile = ({ loggedInUser }) => {
    const { userId } = useParams();//사용자 id가져오기기
    const [followerCount, setFollowerCount] = useState(0);//팔로워 수 저장 
    const [followingCount, setFollowingCount] = useState(0);//팔로잉 수 저장 
    const token = localStorage.getItem("accessToken"); 
  
    
    // 팔로워 & 팔로잉 숫자 불러오기
    useEffect(() => {
        if (!userId) return;

        //  팔로워 수 가져오기
        MypageApi.getFollowerList()
            .then((res) => {
                setFollowerCount(res.length);
            })
            .catch((err) => console.error(" 팔로워 불러오기 오류", err));

        //  팔로잉 수 가져오기
        MypageApi.getFollowingList()
            .then((res) => {
                setFollowingCount(res.length);
            })
            .catch((err) => console.error(" 팔로잉 불러오기 오류", err));
    }, [userId]);

    return (
        <div className="user-profile">
            <h2>{userId}</h2>
            <p>팔로잉: {followingCount} | 팔로워: {followerCount}</p>
            <FollowButton profileUser={userId} />

            {/*  해당 회원이 작성한 게시글 불러오기 */}
            <MyPost />
        </div>
    );
};

export default UserProfile;
