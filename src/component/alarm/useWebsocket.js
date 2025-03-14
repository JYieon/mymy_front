import { useEffect } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

// 웹소켓을 통해 실시간 알람을 수신하는 커스텀 훅
const useWebSocket = (userId, onMessageReceived) => {
  useEffect(() => {
    //userId가 없을 경우 실행하지 않음
    if (!userId) return;

    //SockJS를 이용하여 Spring 서버의 WebSocket 엔드포인트와 연결
    const socket = new SockJS("http://localhost:8080/mymy/ws");
    const stompClient = Stomp.over(socket);

    //STOMP 프로토콜을 사용하여 서버와 연결
    stompClient.connect({}, () => {
      stompClient.subscribe(`/topic/notifications/${userId}`, (message) => {
        const alarm = JSON.parse(message.body);//JSON 데이터 파싱
        console.log("새 알림 도착:", alarm); //  알람 수신 로그
        onMessageReceived(alarm);//콜백 실행하여 알람 데이터 전달
      });
    });

    //컴포넌트가 언마운트될 때 웹소켓 연결 해제
    return () => {
        console.log("웹소켓 연결 해제"); //  연결 해제 로그
      stompClient.disconnect();
    };
  }, [userId, onMessageReceived]);
};

export default useWebSocket;
