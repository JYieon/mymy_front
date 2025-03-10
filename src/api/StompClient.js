import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let client;
// WebSocket 연결 설정
const connectWebSocket = (roomId, onMessageReceived, onConnect, onError) => {
  const accessToken = localStorage.getItem("accessToken"); // JWT 토큰을 가져옵니다
  client = new Client({
    webSocketFactory: () => new SockJS('http://localhost:8080/chat'), // WebSocket 서버 URL
    connectHeaders: {
      Authorization: `Bearer ${accessToken}`
    },
    onConnect: () => {
      // 메시지를 받을 수 있는 구독 설정
      client.subscribe("/topic/messages", (message) => {
        onMessageReceived(JSON.parse(message.body));
      });
      // 특정 방의 메시지를 받을 수 있는 구독 설정
      client.subscribe(`/topic/room/${roomId}`, (message) => {
        onMessageReceived(JSON.parse(message.body));
      });

      if (onConnect) {
        onConnect(client);
      }
    },
    onStompError: (error) => {
      console.error("STOMP error", error);
      if (onError) {
        onError(error);
      }
    },
    onDisconnect: () => {
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });
  client.activate();
};

const showMessage = (message) => {
  console.log("Received message: ", message);
  // 메시지를 화면에 출력하는 로직을 추가하세요.
};

const showRoomMessage = (message) => {
  console.log("Received room message: ", message);
  // 방 메시지를 화면에 출력하는 로직을 추가하세요.
};

// 메시지 전송 함수
const sendMessage = (chatMsgDto, accessToken) => {
  if (client && client.connected) {
    client.publish({
      destination: '/app/chat/send',  // ***통신이 안될경우 엔드포인트가 백앤드와 동일한지 확인할 것
      body: JSON.stringify(chatMsgDto),
      headers: { Authorization: `Bearer ${accessToken}` }, // 메시지 전송 시 JWT 토큰을 헤더에 포함
    });
  } else {
    console.error('Cannot send message, client is not connected');
  }
};

export { connectWebSocket, sendMessage };