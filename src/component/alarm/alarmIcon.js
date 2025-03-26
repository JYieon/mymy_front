import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useWebSocket from "./useAlramWebsocket";
import axios from "axios";
import MypageApi from "../../api/MypageApi";
import style from "../../Css/Layout.module.css"
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

        MypageApi.getAlarms(token)
            .then(validAlarms => {
                console.log("🔹 API 응답 데이터:", validAlarms);

                const alarmsArray = Array.isArray(validAlarms) ? validAlarms : [];

                setNotifications(alarmsArray);
                setUnreadCount(alarmsArray.filter(alarm => !alarm.read).length);
            })
            .catch(error => {
                console.error("🚨 알림 불러오기 실패:", error);
                setNotifications([]); // ✅ 오류 발생 시 빈 배열 설정
            });
    }, []);

    //알림 아이콘 클릭 핸들러
    const handleClick = () => {

        // markAlarmsAsRead - 사용자의 읽지 않은 알람을 모두 읽음 상태로 변경하는 기능
        MypageApi.markAlarmsAsRead(token).then(() => setUnreadCount(0));
        setShowDropdown(!showDropdown);
        navigate(`/mypage/alarm/list/`);
    };
    console.log("icon", hasUnread, "ddd", unreadCount)

    return (
        <div className={`${style.alarmIconContainer}`}>
            {/* 읽지 않은 알림이 있을 경우 빨간색 점 표시 */}
            {hasUnread  && <span className={style.alarmDot}>.</span>}
            <svg onClick={handleClick} className={style.alarm} width="15px" height="15px">
                <path d="M3 5C3 2.23858 5.23858 0 8 0C10.7614 0 13 2.23858 13 5V8L15 10V12H1V10L3 8V5Z" />
                <path d="M7.99999 16C6.69378 16 5.58254 15.1652 5.1707 14H10.8293C10.4175 15.1652 9.30621 16 7.99999 16Z" />
            </svg>

            {/* {hasUnread && <span className="alarm-dot"></span>} */}
        </div>
    );
};

export default AlarmIcon;