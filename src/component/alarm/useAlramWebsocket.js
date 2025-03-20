import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useEffect, useState } from "react";
import { Stomp } from "@stomp/stompjs";

const useAlramWebSocket = (callback) => {
    const [notifications, setNotifications] = useState([]);
    const [hasUnread, setHasUnread] = useState(false);

    const connect = (userId) => {
        const socket = new SockJS('http://localhost:8080/mymy/alarm-ws'); // WebSocket 서버 주소
         const stompClient = Stomp.over(socket);
            stompClient.connect({}, (frame) => {
              console.log(frame);
            //   stompClient.subscribe(`/topic/notification`, async (frame) => {
            //     let jsonMessage = frame.body;
            //     const newNotification = await JSON.parse(jsonMessage);
            //     console.log("webalram", newNotification)
            //     setNotifications((prevNotifications) => [
            //                         ...prevNotifications,
            //                         newNotification
            //                     ]);
            //                     setHasUnread(true);
            //   });
              stompClient.subscribe('/topic/user/' + userId + '/queue/notification', function (message) {
                // 알림 처리
                const notification = JSON.parse(message.body);
                setNotifications((prevNotifications) => [notification, ...prevNotifications]);
                setHasUnread(true);
                console.log(notification);
                callback(notification);
            });
        // const stompClient = new Client({
        //     webSocketFactory: () => socket,
        //     connectHeaders: {
        //         Authorization: `Bearer ${token}`,
        //     },
        //     onConnect: () => {
        //         stompClient.subscribe("/topic/notification", (message) => {
        //             const newNotification = JSON.parse(message.body);
        //             setNotifications((prevNotifications) => [
        //                 ...prevNotifications,
        //                 newNotification
        //             ]);
        //             setHasUnread(true);
        //         });
        //     },
        //     onStompError: (frame) => {
        //         console.error("STOMP error", frame);
        //     },
        });
        // stompClient.activate();

        return () => {
            stompClient.disconnect();
          };
    };

    return { connect };
};

export default useAlramWebSocket;