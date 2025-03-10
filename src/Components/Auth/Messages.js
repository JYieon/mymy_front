import React, { useEffect, useState } from "react";
import ChatApi from "../../api/ChatApi";
import MyChat from "./MyChat";
import OtherChat from "./OtherChat";

export default function Message({ chatMessages }) {
    const [user, setUser] = useState(null); // 유저 상태를 관리
    const token = localStorage.getItem("accessToken");
    console.log("Messages.js: ", chatMessages)

    useEffect(() => {
        // 토큰이 있으면 서버로부터 유저 정보 가져오기
        const fetchUser = async () => {
            if (token) {
                try {
                    const res = await ChatApi.getUserInfo(token); // 예시 API 요청
                    setUser(res.data.id); // 유저 정보 저장
                } catch (error) {
                    console.error("유저 정보를 가져오는 데 실패했습니다.", error);
                }
            }
        };

        fetchUser();
    }, [token]); // 토큰이 변경될 때마다 실행

    if (!user) {
        return <div>Loading user...</div>; // 유저 정보가 로딩 중일 때는 "Loading user..." 표시
    }

    if (!chatMessages || chatMessages.length === 0) {
        return <div>No messages</div>; // 메시지가 없을 때 "No messages" 표시
    }
    chatMessages.map((c)=>{
        console.log(c)
        console.log("??", c.id)
        console.log(">>>>", user)
        console.log(c.id === user)
    })
    
    return (
        
        chatMessages.map((chatMessage) => {
            return (
                chatMessage.id === user ? <MyChat chatMessage={chatMessage} /> : <OtherChat chatMessage={chatMessage} />
            );
        })
    );
}

