import React, { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import MypageApi from "../../api/MypageApi";
import ChatApi from "../../api/ChatApi";
import style from "../../Css/BoardList.module.css";
import FollowButton from "./FollowButton";

//팔로잉 목록
const FollowingList = () => {
    const { userId } = useParams(); //  URL에서 userId 가져오기
    const [following, setFollowing] = useState([]);
    const [error, setError] = useState(null);


    useEffect(() => {
        const token = localStorage.getItem("accessToken");//콘솔에서 userid 확인
        if (!token) {
            setError(" 로그인 후 확인 가능합니다.");
            return;
        }

        // const fetchUserInfo = async () => {
        //     try {
        //         const res = await ChatApi.getUserInfo(token); // ✅ 로그인한 사용자 정보 가져오기
        //         console.log("백엔드에서 가져온 userId:", res.data.id);
        //         setUserId(res.data.id);
        //     } catch (error) {
        //         console.error("🚨 userId 가져오기 실패:", error);
        //         Navigate("/login"); // ✅ 실패하면 로그인 페이지로 이동
        //     }
        // };

        const fetchFollowing = async () => {
            try {
                const res = await MypageApi.getFollowingList(userId, token);//api 요청 
                console.log(" 팔로잉 목록:", res);
                //서버에서 받은 데이터가 배열인지 확인 후 저장 
                setFollowing(Array.isArray(res) ? res : []);
            } catch (error) {

                console.error(" 팔로잉 목록 불러오기 실패:", error);
                setError(" 팔로잉 목록을 불러오는 중 오류가 발생했습니다.");
            }
        };

        fetchFollowing();
    }, []);
    return (
        <div className="following-list">
            <h1>{userId}님의 팔로잉</h1>

            <div className={style.bookmarkContainer}>

                {following.length === 0 ? (
                    <p className={style.nonData}>팔로우한 사용자가 없습니다.</p>
                ) : (
                    <ul>
                        {following.map(user => (
                            <li className={`Shadow ${style.followItem}`} key={user?.followingId || Math.random()}>
                                <Link to={`/profile/${user?.followingId}`} className={`link`}>
                                    <img src="profile.jpg" alt="프로필 이미지" />
                                    <p>{user?.followingId}</p>
                                </Link>
                                <FollowButton profileUser={user?.followingId}/>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default FollowingList;
