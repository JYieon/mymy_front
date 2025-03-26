import React, { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import MypageApi from "../../api/MypageApi";
import ChatApi from "../../api/ChatApi";
import style from "../../Css/BoardList.module.css";
import FollowButton from "./FollowButton";

const FollowingList = () => {
    const { userId } = useParams();
    const [following, setFollowing] = useState([]);
    const [error, setError] = useState(null);
    const [profiles, setProfiles] = useState({});

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            setError(" 로그인 후 확인 가능합니다.");
            return;
        }

        const fetchFollowing = async () => {
            try {
                const res = await MypageApi.getFollowingList(userId, token);
                setFollowing(Array.isArray(res) ? res : []);

                const profilePromises = res.map(async (user) => {
                    try {
                        const profileData = await MypageApi.getUserInfoById(user.followingId);
                        return { userId: user.followingId, profileImg: profileData.member_profile };
                    } catch {
                        return { userId: user.followingId, profileImg: null };
                    }
                });

                const resolvedProfiles = await Promise.all(profilePromises);
                const profileMap = {};
                resolvedProfiles.forEach((p) => {
                    profileMap[p.userId] = p.profileImg;
                });

                setProfiles(profileMap);
            } catch (error) {
                console.error("팔로잉 목록 불러오기 실패:", error);
                setError("팔로잉 목록을 불러오는 중 오류가 발생했습니다.");
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
                                    <img
                                        src={profiles[user.followingId]}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "/images/defaultProfile.png";
                                        }}
                                        alt="프로필 이미지"
                                        className={style.followerPic}
                                    />
                                    <p>{user?.followingId}</p>
                                </Link>
                                <FollowButton profileUser={user?.followingId} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default FollowingList;
