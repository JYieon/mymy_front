import React, { useState, useEffect } from "react";
import MypageApi from "../../api/MypageApi";

//사용자 팔로우, 언팔로우 상태를 관리하는 버튼
//현재 로그인한 사용자가 특정 프로필 사용자를 
// 팔로우하고 있는지 확인 후 버튼 상태를 변경
const FollowButton = ({ profileUser }) => {
    const [isFollowed, setIsFollowed] = useState(false);//팔로우 여부 상태
    const [loading, setLoading] = useState(false);  //버튼 누를 때 여러 번 요청이 안 가도록 막아줌
    const token = localStorage.getItem("accessToken");//로그인 한 사용자의 토큰 가져오기

    //팔로우 여부 확인
    useEffect(() => {
        if (!token || !profileUser) return;//사용자 정보가 없으면 실행하지 않음

        MypageApi.isFollowing(profileUser, token)  //서버에 내가 팔로우 한 사람인지 확인함
            .then((response) => {
                console.log(" 팔로우 여부:", response);
                setIsFollowed(response);//서버 응답 값을 기반으로 팔로우 상태 설정
            })
            .catch((error) => console.error(" 팔로우 여부 확인 실패:", error));
    }, [token, profileUser]);//token, profileuser 변경시 실행

    //팔로우, 언팔로우 토굴 핸들러(버튼 클릭시 변경 됨)
    const handleFollow = async () => {
        if (!token || !profileUser || loading) return;//조건이 맞지않으면 실행 종료

        setLoading(true); //버튼 상태를 언팔로우로 변경
        try {
            if (isFollowed) {
                await MypageApi.unfollowUser(profileUser, token);//언팔로우 api  //  token 추가
                console.log(" 언팔로우 성공");
                setIsFollowed(false);//버튼 상태를 팔로우로 변경
            } else {
                await MypageApi.followUser(profileUser, token);  // 팔로우 api
                console.log(" 팔로우 성공");
                setIsFollowed(true);//
            }
        } catch (error) {
            console.error(" 팔로우/언팔로우 요청 실패:", error);
        }
        setLoading(false); //요청이 끝나면 버튼을 다시 눌릴 수 있게 해줌
    };

    return (
        <button 
            className={`follow-btn ${isFollowed ? "unfollow" : "follow"}`} 
            onClick={handleFollow}
            disabled={loading}  //버튼을 누르는 동안에는 다시 못 누르게 함 
        >
            {/* 버튼 텍스트 변경경 */}
            {isFollowed ? "언팔로우" : "팔로우"}
        </button>
    );
};

export default FollowButton;
