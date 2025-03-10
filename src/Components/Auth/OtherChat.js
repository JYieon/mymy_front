import styled from "styled-components";

const ChatContainer = styled.li`
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 80%;
  position: relative;
`;

const ChatBubble = styled.div`
  display: inline-block; /* ✅ 내용에 맞게 크기 조절 */
  padding: 10px;
  border-radius: 10px;
  background-color: rgb(255, 255, 255);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  word-wrap: break-word;
  max-width: 100%;

  &::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 10px;
    border-width: 10px;
    border-style: solid;
    border-color: rgb(255, 255, 255) transparent transparent transparent;
  }
`;

const ChatMessage = styled.p`
  font-size: 14px;
  line-height: 1.4;
  color: #333;
  margin: 0;
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;

export default function OtherChat({ chatMessage }) {
  return (
    <ChatContainer key={chatMessage.id}>
      <UserProfile>
        {/* <img src={chatMessage.profile} style={{ width: "30px", borderRadius: "50px" }} /> */}
        {/* <NickName>{chatMessage.nickName}</NickName> */}
      </UserProfile>
      <ChatBubble>
        <ChatMessage>{chatMessage.msg}</ChatMessage>
      </ChatBubble>
    </ChatContainer>
  );
}
