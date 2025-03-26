import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MypageApi from "../../api/MypageApi";
import FollowButton from "./FollowButton";
import MyPost from "../mypage/MyPost";
import UserPost from "../mypage/userPost";
import style from "../../Css/Profile.module.css";
import ChatApi from "../../api/ChatApi";

//사용자 프로필 
const UserProfile = ({ loggedInUser }) => {
    const { userId } = useParams(); // URL에서 대상 유저 아이디
    const [myId, setMyId] = useState(""); // 로그인 유저 아이디
    const [followerCount, setFollowerCount] = useState(0);//팔로워 수 저장 
    const [followingCount, setFollowingCount] = useState(0);//팔로잉 수 저장 
    const token = localStorage.getItem("accessToken");

    // 로그인한 내 userId 가져오기
    useEffect(() => {
        const fetchMyId = async () => {
            try {
                const res = await ChatApi.getUserInfo(token); // "/userinfo/me"
                setMyId(res.userId);
            } catch (err) {
                console.error("내 userId 불러오기 실패", err);
            }
        };
        fetchMyId();
    }, [token]);

    console.log('loggedInUser',loggedInUser)

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
                <h1 className={style.userId}>{userId}</h1>
                <div className={style.followContainer}>
                    <span>팔로잉 {followingCount} 팔로워 {followerCount}</span>
                    <FollowButton profileUser={userId} />
                </div>
            </div>
            <hr className={`hr`} />
            {/*  해당 회원이 작성한 게시글 불러오기 */}

            <div className={style.mypost}>
                <h2 className={style.category}>📄 작성한 게시글</h2>
                {/* <MyPost userId={userId}/> */}
            {myId === userId ? <MyPost /> : <UserPost userId={userId}/> }


            </div>
        </div>
    );
};

export default UserProfile;