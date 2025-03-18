import React, { useState, useEffect } from "react";
import MypageApi from "../../api/MypageApi";

const FollowButton = ({ profileUser }) => {
    const [isFollowed, setIsFollowed] = useState(false);
    const [loading, setLoading] = useState(false);  
    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        if (!token || !profileUser) return;

        MypageApi.isFollowing(profileUser, token)  
            .then((response) => {
                console.log(" 팔로우 여부:", response);
                setIsFollowed(response);
            })
            .catch((error) => console.error(" 팔로우 여부 확인 실패:", error));
    }, [token, profileUser]);

    const handleFollow = async () => {
        if (!token || !profileUser || loading) return;

        setLoading(true); 
        try {
            if (isFollowed) {
                await MypageApi.unfollowUser(profileUser, token);  //  token 추가
                console.log(" 언팔로우 성공");
                setIsFollowed(false);
            } else {
                await MypageApi.followUser(profileUser, token);  //  token 추가
                console.log(" 팔로우 성공");
                setIsFollowed(true);
            }
        } catch (error) {
            console.error(" 팔로우/언팔로우 요청 실패:", error);
        }
        setLoading(false); 
    };

    return (
        <button 
            className={`follow-btn ${isFollowed ? "unfollow" : "follow"}`} 
            onClick={handleFollow}
            disabled={loading}  
        >
            {isFollowed ? "언팔로우" : "팔로우"}
        </button>
    );
};

export default FollowButton;
