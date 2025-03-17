import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ChatApi from "../../api/ChatApi";
import Message from "./Messages";
import SockJs from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import style from "../../Css/ChatLayout.module.css";
import SendIcon from "../../Assets/send.svg";

// /* ✅ 채팅 메시지 리스트 */
// const ChatList = styled.ul`
//   flex: 1; /* ✅ 남은 공간을 자동으로 채우도록 설정 */
//   overflow-y: auto; /* ✅ 메시지가 많아지면 스크롤 가능 */
//   list-style: none;
//   padding: 10px;
//   border: 1px solid #ddd;
//   border-radius: 5px;
// `;

const ChttingRoom = () => {
  const { roomNum } = useParams();
  const [userInfo, setUserInfo] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatInfo, setChatInfo] = useState([]);
  const [webSocket, setWebSocket] = useState(null);
  const [userId, setUserId] = useState("");
  const [invite, setInvite] = useState("");
  // const [sideOpen, setSideOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  // 스크롤 자동으로 아래로 내리기
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const getChatRoom = async () => {
      try {
        const res = await ChatApi.getChatMessages(roomNum);
        setUserInfo(res.data.member);
        if (res.data.messages.length > 0) {
          const newMessages = res.data.messages.map((element) => ({
            id: element.member,
            msg: element.msg,
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
    const CreateWebSocket = () =>
      new SockJs("http://localhost:8080/mymy/stompServer");
    const stompClient = Stomp.over(CreateWebSocket);
    stompClient.connect({}, (frame) => {
      console.log(frame);

      stompClient.subscribe(
        `/chat/chatRoomNo/${roomNum}/message`,
        async (frame) => {
          let jsonMessage = frame.body;
          let parsedMessage = await JSON.parse(jsonMessage);
          setMessages((preState) => [
            ...preState,
            { id: parsedMessage.member, msg: parsedMessage.msg },
          ]);
        }
      );

      stompClient.subscribe(
        `/chat/chatRoomNo/${roomNum}/enternleave`,
        async (frame) => {
          let jsonMessage = frame.body;
          let parsedMessage = await JSON.parse(jsonMessage);
          setUserInfo(parsedMessage);
        }
      );
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

    webSocket.send(
      `/chat/sendMessage/chatRoomNo/${roomNum}`,
      {},
      JSON.stringify(chatMessage)
    );
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

  return (
    <>
      <div className={style.GroupChatContiner}>
        <div className={style.ChatContainer}>
          <h1 className={style.RoomTitle}>채팅룸 {roomNum}</h1>

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
            <img src={SendIcon} className={style.SendIcon} alt=""/>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChttingRoom;
