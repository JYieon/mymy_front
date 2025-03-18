import { Client } from "@stomp/stompjs";

const useWebSocket = (userId, onMessageReceived) => {
    let stompClient = null;

    const connect = () => {
      
      const token = localStorage.getItem("accessToken");
        stompClient = new Client({
          
            brokerURL: "http://localhost:8080/alarm-ws",  //  WebSocket 엔드포인트 변경
            reconnectDelay: 5000,  //  자동 재연결 (5초 후 재시도)
            connectHeaders: {
              Authorization: `Bearer ${token}`  //  토큰을 헤더로 전달
            },
            onConnect: () => {
              console.log(" WebSocket 연결 성공!");

                //  사용자 알림 구독 설정
                stompClient.subscribe(`/queue/alarms/${token}`, (message) => {
                    const newAlarm = JSON.parse(message.body);
                    console.log("📩 새로운 알림 수신:", newAlarm);
                    onMessageReceived(newAlarm);
                });
            },
            connectHeaders: {
              Authorization: `Bearer ${token}`  //  토큰을 헤더에 포함하여 서버에 전달
          },
          onDisconnect: () => {
              console.log(" WebSocket 연결 종료됨");
          },
          onStompError: (frame) => {
              console.error(" STOMP 오류 발생:", frame);
          }
      });

      stompClient.activate();
  };

  return { connect };
};

export default useWebSocket;
