import React, { useState, useEffect } from "react";
import axios from "axios";

const FollowButton = ({ loggedInUser, profileUser }) => {
    const [isFollowed, setIsFollowed] = useState(false);

    useEffect(() => {
        //  팔로우 여부 확인
        console.log("팔로우 여부 확인 중:", loggedInUser, "→", profileUser);
        if (!loggedInUser || !profileUser) return;

        axios.get(`http://localhost:8080/mymy/follow/isFollowing/${loggedInUser}/${profileUser}`)
            .then(response => {
                console.log("팔로우 여부 확인 응답:", response.data);
                setIsFollowed(response.data);
            })
            .catch(error => console.error("팔로우 여부 확인 실패:", error));

    }, [loggedInUser, profileUser]);

    //  팔로우 / 언팔로우 버튼 클릭 시 실행
    const handleFollow = () => {
        if (!loggedInUser || !profileUser) return;

        if (isFollowed) {
            // 언팔로우 요청 (DELETE)
            axios.delete(`http://localhost:8080/mymy/follow/${loggedInUser}/${profileUser}`)
                .then(() => {
                    console.log("언팔로우 성공");
                    setIsFollowed(false);
                })
                .catch(error => console.error("언팔로우 실패:", error));
        } else {
            // 팔로우 요청 (PUT)
            axios.put(`http://localhost:8080/mymy/follow/${loggedInUser}/${profileUser}`)
                .then(() => {
                    console.log("팔로우 성공");
                    setIsFollowed(true);
                })
                .catch(error => console.error("팔로우 실패:", error));
        }
    };

    return (
        <button className={`follow-btn ${isFollowed ? "unfollow" : "follow"}`} onClick={handleFollow}>
            {isFollowed ? "언팔로우" : "팔로우"}
        </button>
    );
};

export default FollowButton;
