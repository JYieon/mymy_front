import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useWebSocket from "./useAlramWebsocket";
import axios from "axios";
import MypageApi from "../../api/MypageApi";
import style from "../../Css/Layout.module.css"
import { FaBell } from "react-icons/fa"
const AlarmIcon = ({ hasUnread }) => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const token = localStorage.getItem("token")

    const { connect } = useWebSocket((newAlarm) => {
        setNotifications((prev) => [newAlarm, ...prev]);
        setUnreadCount((prev) => prev + 1);
    });

    useEffect(() => {
        // connect();
        // if (!userId) return;

        // MypageApi.getAlarms(token)
        //     .then(validAlarms => {
        //         console.log("🔹 API 응답 데이터:", validAlarms);

        //         const alarmsArray = Array.isArray(validAlarms) ? validAlarms : [];

        //         setNotifications(alarmsArray);
        //         setUnreadCount(alarmsArray.filter(alarm => !alarm.read).length);
        //     })
        //     .catch(error => {
        //         console.error("🚨 알림 불러오기 실패:", error);
        //         setNotifications([]); // ✅ 오류 발생 시 빈 배열 설정
        //     });
    }, []);

    //알림 아이콘 클릭 핸들러
    const handleClick = () => {

        // markAlarmsAsRead - 사용자의 읽지 않은 알람을 모두 읽음 상태로 변경하는 기능
        // MypageApi.markAlarmsAsRead(token).then(() => setUnreadCount(0));
        setShowDropdown(!showDropdown);
        navigate(`/mypage/alarm/list/`);
    };
    console.log("icon", hasUnread, "ddd", unreadCount)

    return (
        <div onClick={handleClick}>
            {/* 읽지 않은 알림이 있을 경우 빨간색 점 표시 */}
            {/* {<span className={style.alarmDot}>.</span>} */}
            { hasUnread ? <FaBell style={{color: "red"}}/> : <FaBell /> }
            

            {/* {hasUnread && <span className="alarm-dot"></span>} */}
        </div>
    );
};

export default AlarmIcon;