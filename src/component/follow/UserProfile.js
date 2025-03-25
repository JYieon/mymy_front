import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MypageApi from "../../api/MypageApi";
import FollowButton from "./FollowButton";
import MyPost from "../mypage/MyPost";
import style from "../../Css/Profile.module.css";

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
            <div className={style.header}>
                <img src="" alt="profilePic" className={style.profilePic} />
                {/* <h1 className={style.userId}>{userId}</h1> */}
                <h1 className={style.userId}>난너를보면티라미수케잌</h1>
                <div className={style.followContainer}>
                    <span>팔로잉 {followingCount} 팔로워 {followerCount}</span>
                    <FollowButton profileUser={userId} />
                </div>
            </div>
            <hr className={`hr`} />
            {/*  해당 회원이 작성한 게시글 불러오기 */}

            <div className={style.mypost}>
                <h2 className={style.category}>📄 작성한 게시글</h2>
                <MyPost />

            </div>
        </div>
    );
};

export default UserProfile;
