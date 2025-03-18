import { createContext, useContext, useState, useEffect } from "react";
import useWebSocket from "./useAlramWebsocket";
import ChatApi from "../../api/ChatApi";
import MypageApi from "../../api/MypageApi";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [hasUnread, setHasUnread] = useState(false);
    // const [userId, setUserId] = useState(false)

    const { connect } = useWebSocket((newAlarm) => {
        setNotifications((prev) => [newAlarm, ...prev]);
        setHasUnread(true);
        console.log("hasUnread",hasUnread)
    });

    useEffect(() => {
        const getUserInfo = async () => {
            const res = await ChatApi.getUserInfo(localStorage.getItem("accessToken"))
            // setUserId(res.data.id)

            connect(res.data.id);

            const resAlram = await MypageApi.getAlarms(localStorage.getItem("accessToken"));
            //   console.log("받아온 알람 데이터:", resAlram.data[0].isRead);
              if(resAlram.data.length !== 0){
                setNotifications(resAlram.data);
                // 알림 중 읽지 않은 알림이 있으면 hasUnread를 true로 설정
                resAlram.data.map((alram)=>{
                    console.log(alram)
                    if(alram.isRead === 0){
                        setHasUnread(true)
                    }
                })
                // const unreadNotifications = resAlram.data.filter((noti) => Number(noti.isRead) === 0);
                // console.log(unreadNotifications.length)
                // setHasUnread(unreadNotifications.length > 0);
              }

              
        }
        getUserInfo()
    }, []);

    return (
        <WebSocketContext.Provider value={{ hasUnread, setHasUnread }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocketContext = () => useContext(WebSocketContext);
