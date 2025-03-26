import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MypageApi from "../../api/MypageApi";
import ChatApi from "../../api/ChatApi";
import style from "../../Css/BoardList.module.css";
import FollowButton from "./FollowButton";

const FollowingList = () => {
    const [following, setFollowing] = useState([]);
    const [error, setError] = useState(null);
    const [profiles, setProfiles] = useState({});
    const [userId, setUserId] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            setError("로그인 후 확인 가능합니다.");
            return;
        }

        const fetchUserInfoAndFollowing = async () => {
            try {
                // 🔹 로그인한 사용자 정보 조회
                const res = await ChatApi.getUserInfo(token);
                const currentUserId = res.data.nick;
                setUserId(currentUserId);

                // 🔹 팔로잉 목록 조회
                const followingRes = await MypageApi.getFollowingList(currentUserId, token);
                const followingList = Array.isArray(followingRes) ? followingRes : [];
                setFollowing(followingList);

                // 🔹 프로필 이미지 동시 요청
                const profilePromises = followingList.map(async (user) => {
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
            } catch (err) {
                console.error("팔로잉 목록 불러오기 실패:", err);
                setError("팔로잉 목록을 불러오는 중 오류가 발생했습니다.");
                navigate("/login");
            }
        };

        fetchUserInfoAndFollowing();
    }, [navigate]);

    return (
        <div className="following-list">
            <h1>{userId}님의 팔로잉</h1>

            {error && <p className="error-message">{error}</p>}

            <div className={style.bookmarkContainer}>
                {following.length === 0 ? (
                    <p className={style.nonData}>팔로우한 사용자가 없습니다.</p>
                ) : (
                    <ul>
                        {following.map(user => (
                            <li className={`Shadow ${style.bookmarkItem}`} key={user.followingId}>
                                <div className={style.followerPicContainer}>
                                    <img
                                        src={profiles[user.followingId] || "/images/defaultProfile.png"}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "/images/defaultProfile.png";
                                        }}
                                        alt="프로필 이미지"
                                        className={style.followerPic}
                                    />
                                </div>
                                <div>
                                    <Link
                                        to={`/profile/${user.followingId}`}
                                        className={`link ${style.bookmarkUserId}`}
                                    >
                                        {user.followingId}
                                    </Link>
                                </div>
                                <div className={style.bmController}>
                                    <FollowButton profileUser={user.followingId} />
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default FollowingList;
