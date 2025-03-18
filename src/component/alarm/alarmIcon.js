import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useWebSocket from "./useWebsocket";
import MypageApi from "../../api/MypageApi";

//알림 아이콘 컴포넌트
const AlarmIcon = ({ userId, token }) => {

    //상태 관리
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);//알림 목록록
    const [unreadCount, setUnreadCount] = useState(0);//읽지 않은 알림 개수     
    const [showDropdown, setShowDropdown] = useState(false);//알림 목록 드랍 다운 표시 여부부

    //웹소켓 연결
    const { connect } = useWebSocket(userId, (newAlarm) => {
        setNotifications((prev) => [newAlarm, ...prev]); // 새 알림을 리스트 앞에 추가
        setUnreadCount((prev) => prev + 1);// 읽지 않은 알림 개수 증가
    });

    //알림 데이터 불러오기
    useEffect(() => {
        connect();//웹소켓 연결
        if (!userId) return;//userId가 없으면 실행 중지

        //api를 통해서 사용자의 알림 목록을 불러옴
        MypageApi.getAlarms(userId)
            .then(validAlarms => {
                console.log(" API 응답 데이터:", validAlarms);
                
                //api 응답이 배열인지 확인 후 저장장
                const alarmsArray = Array.isArray(validAlarms) ? validAlarms : [];
                
                setNotifications(alarmsArray);//알림 목록 상태 업데이트
            setUnreadCount(alarmsArray.filter(alarm => !alarm.read).length);//읽지 않은 알림 갯수 설정정
        })
        .catch(error => {
            console.error(" 알림 불러오기 실패:", error);
            setNotifications([]); // 오류 발생 시 알림 목록을 빈 배열 설정
        });
}, [userId]);//userid가 변경될 때마다 실행행

    //알림 아이콘 클릭 핸들러
    const handleClick = () => {
        
        // markAlarmsAsRead - 사용자의 읽지 않은 알람을 모두 읽음 상태로 변경하는 기능
        MypageApi.markAlarmsAsRead(userId).then(() => setUnreadCount(0));

        //드롭다운 표시 상태 토굴굴
        setShowDropdown(!showDropdown);

        //알림 목록 페이지로 이동동
        navigate(`/mypage/alarm/list/${userId}`);
    };

    return (
        <div className="alarm-icon-container">
            {/* 알림 아이콘 클릭시 알림 목록으로 이동동 */}
            <svg onClick={handleClick} className="Alarm" width="20px" height="20px">
                <path d="M3 5C3 2.23858 5.23858 0 8 0C10.7614 0 13 2.23858 13 5V8L15 10V12H1V10L3 8V5Z" />
                <path d="M7.99999 16C6.69378 16 5.58254 15.1652 5.1707 14H10.8293C10.4175 15.1652 9.30621 16 7.99999 16Z" />
            </svg>
            {/* 읽지 않은 알림이 있을 경우 빨간색 점 표시시 */}
            {unreadCount > 0 && <span className="alarm-dot"></span>}
        </div>
    );
};

export default AlarmIcon;