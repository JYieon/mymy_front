import React, { useEffect, useState } from "react";
import ChatApi from "../../api/ChatApi";
import { useNavigate } from "react-router-dom";
import chatStyle from "../../Css/ChatLayout.module.css";
import style from "../../Css/BoardList.module.css";
function ChatList() {
  const [chatRooms, setChatRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 서버로부터 채팅방 목록을 가져오는 API 호출
    const getChatRoom = async () => {
      try {
        const token = localStorage.getItem("accessToken");
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
    <div>
      <h1 >💬 채팅방 목록</h1>
      <div className={style.bookmarkContainer}>
      </div>
      <ul>
        {chatRooms.map((room) => (
          <li key={room.roomNum} onClick={() => enterChatRoom(room.roomNum)} className={`Shadow ${style.bookmarkItem}`}>
            <h3 className={style.bookmarkPostTitle}>{room.roomName}</h3>
          </li>
        ))}
      </ul>
      <button onClick={createChatRoom}>생성</button>
    </div>
  );
}

export default ChatList;
