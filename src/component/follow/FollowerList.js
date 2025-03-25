import React, { useState, useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import MypageApi from "../../api/MypageApi";
import ChatApi from "../../api/ChatApi";
import style from "../../Css/BoardList.module.css";
import FollowButton from "./FollowButton";

//팔로워 목록
const FollowerList = () => {
    const { userId } = useParams();
    const [followers, setFollowers] = useState([]);
    const [error, setError] = useState(null);


    useEffect(() => {
        const token = localStorage.getItem("accessToken");//사용자 토큰 확인인
        if (!token) {
            setError(" 로그인 후 확인 가능합니다.");
            return;
        }
        const fetchUserInfo = async () => {
            try {
                const res = await ChatApi.getUserInfo(token); // ✅ 로그인한 사용자 정보 가져오기
                console.log("백엔드에서 가져온 userId:", res.data);
                // setUserId(res.data.id);
            } catch (error) {
                console.error("🚨 userId 가져오기 실패:", error);
                Navigate("/login"); // ✅ 실패하면 로그인 페이지로 이동
            }
        };

        //서버에서 팔로워 정보를 가져옴
        const fetchFollowers = async () => {
            try {
                const res = await MypageApi.getFollowerList(userId, token); //api 요청청
                console.log("팔로워 목록:", res);
                //서버에서 받은 데이터가 배열인지 확인 후 저장
                setFollowers(Array.isArray(res) ? res : []);


            } catch (error) {
                console.error(" 팔로워 목록 불러오기 실패:", error);
                setError(" 팔로워 목록을 불러오는 중 오류가 발생했습니다.");
            }
        };
        fetchUserInfo();
        fetchFollowers();
    }, []);



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
        <div>
            <h1>{userId}님의 팔로워</h1>

            {error && <p className="error-message">{error}</p>}

            <div className={style.bookmarkContainer}>
                {followers.length === 0 ? (
                    <p className={style.nonData}>팔로워가 없습니다.</p>
                ) : (
                    <ul>
                        {followers.map(user => (
                            <li className={`Shadow ${style.bookmarkItem}`} key={user?.followerId || Math.random()}>
                            <div className={style.followerPicContainer}>
                                    <img src="../../Assets/temPic.jpg" alt="프로필 이미지" className={style.followerPic} />
                                    </div>
                                <div>
                                    <Link to={`/profile/${user?.followerId}`}
                                        className={`link ${style.bookmarkUserId}`}>
                                        {user?.followerId}
                                        <p className={style.bookmarkUserId} ></p>
                                    </Link>
                                </div>
                                <div className={style.bmController}>
                                        <FollowButton profileUser={user?.followingId} />
                                    </div>

                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default FollowerList;
