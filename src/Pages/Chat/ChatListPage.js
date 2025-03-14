import React, { useEffect, useState } from "react";
import ChatApi from "../../api/ChatApi";
import { useNavigate } from "react-router-dom";

const ChatListPage=()=>{
    const [chatRooms, setChatRooms] = useState([]);
    const navigate = useNavigate();
  
    useEffect(() => {
      // 서버로부터 채팅방 목록을 가져오는 API 호출
      const getChatRoom = async () => {
        try {
          const token = localStorage.getItem("accessToken")
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
      navigate(`/chatting/${roomNum}`);
    };
  
    const createChatRoom = () => {
      navigate("/chat-create");
    };
  
    return (
      <div>
        <h2>채팅방 목록</h2>
        <ul>
          {chatRooms.map((room) => (
            <li
              key={room.roomNum}
              onClick={() => enterChatRoom(room.roomNum)}
            >
              <p>{room.roomName}</p>
              {/* <p>room.regDate</p> */}
            </li>
          ))}
        </ul>
        <button onClick={createChatRoom}>생성</button>
      </div>
    );
};

export default ChatListPage;