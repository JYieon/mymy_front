import { Client } from "@stomp/stompjs";

//stpomp 웹소켓을 통해 실시간 알림을 받기 위한 커스텀
const useWebSocket = (userId, onMessageReceived) => {
    let stompClient = null;//웹소켓 연결을 저장하는 곳곳

    const connect = () => {
      
      const token = localStorage.getItem("accessToken");//로그인 한 사용자의 토큰큰
        stompClient = new Client({
          
            brokerURL: "http://localhost:8080/alarm-ws",  //  WebSocket 엔드포인트 변경
            reconnectDelay: 5000,  //  자동 재연결 (5초 후 재시도)
            connectHeaders: {
              Authorization: `Bearer ${token}`  // 서버에 로긍니 했다고 알려줌줌
            },
            onConnect: () => {
              console.log(" WebSocket 연결 성공!");

                //  사용자 알림 받을 상태태
                stompClient.subscribe(`/queue/alarms/${token}`, (message) => {
                    const newAlarm = JSON.parse(message.body);//메세지를 읽고 데이터로 변환환
                    console.log("새로운 알림 수신:", newAlarm);
                    onMessageReceived(newAlarm);// 새로운 알림을 화면에 보여줌줌
                });
            },
            
            connectHeaders: {
              Authorization: `Bearer ${token}`  //  토큰을 헤더에 포함하여 서버에 전달
          },
          //연결이 끊어졌을때 실행 
          onDisconnect: () => {
              console.log(" WebSocket 연결 종료됨");
          },
          //웹소켓 오류가 발생하면 실행행
          onStompError: (frame) => {
              console.error(" STOMP 오류 발생:", frame);
          }
      });

      stompClient.activate();//연결 시작작
  };

  //connect를 사용하면 연결할 수 있음 
  return { connect };
};

export default useWebSocket;
