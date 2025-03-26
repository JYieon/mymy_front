import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MypageApi from "../../api/MypageApi";
import ChatApi from "../../api/ChatApi";
import style from "../../Css/BoardList.module.css";
import FollowButton from "./FollowButton";

const FollowerList = () => {
    const [followers, setFollowers] = useState([]);
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

        const fetchUserInfoAndFollowers = async () => {
            try {
                // 🔹 현재 로그인한 사용자 정보 가져오기
                const res = await ChatApi.getUserInfo(token);
                const currentUserId = res.data.nick;
                setUserId(currentUserId);

                // 🔹 팔로워 목록 가져오기
                const followersRes = await MypageApi.getFollowerList(currentUserId, token);
                const followerList = Array.isArray(followersRes) ? followersRes : [];
                setFollowers(followerList);

                // 🔹 팔로워들의 프로필 이미지 정보 요청
                const profilePromises = followerList.map(async (user) => {
                    try {
                        const profileData = await MypageApi.getUserInfoById(user.followerId);
                        return { userId: user.followerId, profileImg: profileData.member_profile };
                    } catch {
                        return { userId: user.followerId, profileImg: null };
                    }
                });

                const resolvedProfiles = await Promise.all(profilePromises);
                const profileMap = {};
                resolvedProfiles.forEach((p) => {
                    profileMap[p.userId] = p.profileImg;
                });
                setProfiles(profileMap);

            } catch (err) {
                console.error("팔로워 정보 불러오기 실패:", err);
                setError("팔로워 목록을 불러오는 중 오류가 발생했습니다.");
                navigate("/login");
            }
        };

        fetchUserInfoAndFollowers();
    }, [navigate]);

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
                            <li className={`Shadow ${style.bookmarkItem}`} key={user.followerId}>
                                <div className={style.followerPicContainer}>
                                    <img
                                        src={profiles[user.followerId] || "/images/defaultProfile.png"}
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
                                        to={`/profile/${user.followerId}`}
                                        className={`link ${style.bookmarkUserId}`}
                                    >
                                        {user.followerId}
                                    </Link>
                                </div>
                                <div className={style.bmController}>
                                    <FollowButton profileUser={user.followerId} />
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
