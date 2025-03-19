import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ChatApi from "../../api/ChatApi";
import Message from "./Messages";
import SockJs from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import style from "../../Css/ChatLayout.module.css";
import SendIcon from "../../Assets/send.svg";

const ChttingRoom = () => {
  const { roomNum } = useParams();
  const [chatUserInfo, setChatUserInfo] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatInfo, setChatInfo] = useState([]);
  const [webSocket, setWebSocket] = useState(null);
  const [userId, setUserId] = useState("");
  const [invite, setInvite] = useState("");
  const [memberNum, setMemberNum] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const [sideOpen, setSideOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  // 스크롤 자동으로 아래로 내리기
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const getChatRoom = async () => {
      try {
        const res = await ChatApi.getChatMessages(roomNum);
        console.log(res.data);
        setMemberNum(res.data.member.length);
        // setChatUserInfo(res.data.member);
        // console.log("msg", res.data.member)
        const filteredUser = res.data.member.filter(user => user.member !== userId)
        setChatUserInfo(filteredUser)
        if (res.data.messages.length > 0) {
          const newMessages = res.data.messages.map((element) => ({
            id: element.member, 
            msg: element.msg,
            type: element.type,
            nick: element.nick,
            profile: element.profile
          }));
          setMessages(newMessages);
        } else {
          setMessages([]);
        }
        setChatInfo(res.data.chat);
      } catch (error) {
        console.log(error);
      }

      setTimeout(() => {
        scrollToBottom();
      }, 100);
    };
    getChatRoom();
  }, [roomNum]);

  useEffect(() => {
    const CreateWebSocket = () => new SockJs("http://localhost:8080/mymy/ws");
    const stompClient = Stomp.over(CreateWebSocket);
    stompClient.connect({}, (frame) => {
      console.log(frame);
      stompClient.subscribe(`/topic/chatRoomNo/${roomNum}/message`, async (frame) => {
        let jsonMessage = frame.body;
        let parsedMessage = await JSON.parse(jsonMessage);
        setMessages((preState) => [...preState, { id: parsedMessage.member, msg: parsedMessage.msg }]);
      });

      stompClient.subscribe(`/topic/chatRoomNo/${roomNum}/enternleave`, async (frame) => {
        let jsonMessage = frame.body;
        let parsedMessage = await JSON.parse(jsonMessage);
        setChatUserInfo(parsedMessage);
      });
    });
    setWebSocket(stompClient);

    const getUserInfo = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await ChatApi.getUserInfo(token);
        setUserId(res.data.id);
      } catch (error) {
        console.log(error);
      }
    };
    getUserInfo();

    return () => {
      stompClient.disconnect();
    };
  }, [roomNum]);

  const sendMessage = () => {
    const chatMessage = {
      msg: message,
      roomNum,
      member: userId,
    };

    if (!message) {
      alert("전송이 불가한 메세지.");
      return;
    }
    if (!webSocket) {
      alert("웹소켓 연결중입니다");
      return;
    }


    webSocket.send(`/app/sendMessage/chatRoomNo/${roomNum}`, {}, JSON.stringify(chatMessage));
    setMessage("");
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };

  const submitMessage = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
      setTimeout(() => {
        textareaRef.current.value = "";
      });
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  };

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // ChatSidebar.js로 이동

  // const inviteChatUser = async () => {
  //   setInviteOpen(!inviteOpen);
  //   const res = await ChatApi.inviteChatUser(invite, roomNum);
  //   if (res.data === 1) {
  //     setInvite("");
  //   } else {
  //     alert("존재하지 않는 회원입니다.");
  //     setInvite("");
  //   }
  // };

  // const endChat = async () => {
  //   const isConfirmed = window.confirm("채팅방을 정말 나가시겠습니까?");
  //   if (!isConfirmed) return; // 사용자가 취소하면 종료
  
  //   try {
  //     const res = await ChatApi.endChat(roomNum, localStorage.getItem("accessToken"));
  //     console.log("delete", res);
  //     if (res.status === 200) {
  //       window.location.href = "/chatlist"; // 채팅방 목록으로 이동
  //     } else {
  //       alert("채팅방 나가기 실패");
  //     }
  //   } catch (error) {
  //     console.error("채팅방 나가기 오류:", error);
  //     alert("서버 오류로 인해 채팅방을 나갈 수 없습니다.");
  //   }
  // };

  return (
    // <ChatContainer>
    //   <ChatSection>
    //     <HamburgerButton onClick={() => setIsMenuOpen(!isMenuOpen)}>☰</HamburgerButton> {/* 햄버거 버튼 */}
    //     <h2>채팅룸 {roomNum} {memberNum}</h2>
    //     <div>
    //       <input type="text" onChange={(e) => setInvite(e.target.value)} value={invite} />
    //       <button onClick={inviteChatUser}>초대하기</button>
    //     </div>

    //     <ChatList>
    //       <Message chatMessages={messages} />
    //       <li ref={bottomRef} />
    //     </ChatList>

    //     <div>
    //       <textarea 
    //         rows="3" 
    //         name="message" 
    //         ref={textareaRef} 
    //         onKeyDown={submitMessage}
    //         onChange={(e) => setMessage(e.target.value)}
    //         value={message}
    //       />
    //       <button onClick={sendMessage}>전송</button>
    //     </div>
    //   </ChatSection>

    //   <SideMenu isOpen={isMenuOpen}>
    //     <button onClick={() => setIsMenuOpen(false)}>닫기</button>
    //     <h3>참여자</h3>
    //     {chatUserInfo.map((user) => (
    //       <div key={user.id}>
    //       <img src={`/images/${user.profile}.jpg`} style={{ width: "30px", borderRadius: "50px" }} />
    //         {user.nick}
    //       </div>
    //     ))}
    //     <button onClick={endChat}>채팅방 나가기</button>
    //   </SideMenu>
    // </ChatContainer>
    // <>
      <div className={style.ChatLayoutWrap}>
        <div className={style.GroupChatContiner}>
          <h1 className={style.RoomTitle}>{chatInfo.roomName} {roomNum}</h1>

        {/* ✅ 메시지 리스트가 스크롤 가능하도록 ChatList 사용 */}
        <ul className={style.MessageList}>
          <Message chatMessages={messages} />
          <li ref={bottomRef} />
        </ul>
        <div className={style.Mymessages}>
          <textarea
            rows="3"
            name="message"
            ref={textareaRef}
            onKeyDown={submitMessage}
            onChange={(e) => setMessage(e.target.value)}
            className={style.Textarea}
            value={message}
          />
          <button className={style.SendBtn} onClick={sendMessage}>
            <img src={SendIcon} className={style.SendIcon} alt="" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChttingRoom;
