import React, { useEffect, useState } from "react";
import ChatApi from "../../api/ChatApi";
import { useNavigate } from "react-router-dom";
import chatStyle from "../../Css/ChatLayout.module.css";
import style from "../../Css/BoardList.module.css";
function ChatList() {
  const [chatRooms, setChatRooms] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    
    if(!localStorage.getItem("accessToken")){
      alert("로그인 사용자만 이용 가능합니다")
      navigate("/account/login");
      return;
    }

    // 서버로부터 채팅방 목록을 가져오는 API 호출
    const getChatRoom = async () => {
      try {
        const res = await ChatApi.getChatList(token);
        console.log(res.data);
        setChatRooms(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getChatRoom();
  }, []);

  const enterChatRoom = (roomNum) => {
    // 채팅방으로 이동하는 로직 작성
    console.log(`Entering chat room ${roomNum}`);
    navigate(`/groupChat/${roomNum}`);
  };

  const createChatRoom = () => {
    navigate("/chat/create");
  };

  return (
    <div className={chatStyle.ChatLayoutWrap} >
      <h1 >💬 채팅방 목록</h1>
      <div className={chatStyle.ChatroomContainer}>
      
      <ul>
        {chatRooms.map((room) => (
          <li key={room.roomNum} onClick={() => enterChatRoom(room.roomNum)} className={`Shadow ${chatStyle.ChatroomItem}`}>
            <span className={chatStyle.ChatroomTitle}>{room.roomName}</span>
            <span className={chatStyle.lastChatDate}>마지막 채팅 | {room.lastChat}</span>
          </li>
        ))}
      </ul>
      <button className={chatStyle.createChatRoomBtn} onClick={createChatRoom}>생성</button>
    </div>
    </div>
  );
}

export default ChatList;
