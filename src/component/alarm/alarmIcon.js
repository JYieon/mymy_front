import { useState, useEffect } from "react";
import { useAuth } from "../../component/alarm/authContext";//인증 정보 가져오기 (로그인 상태 확인)
import useWebSocket from "./useWebsocket";//웹소켓 커스텀 훅 사용
import axios from "axios";

const AlarmIcon = () => {
    const { user } = useAuth();  // 현재 로그인한 사용자 정보 가져오기
    const [notifications, setNotifications] = useState([]);// 알림 목록 상태 저장
    const [unreadCount, setUnreadCount] = useState(0);// 읽지 않은 알림 개수 상태 저장

    // 웹소켓을 통해 실시간 알림 수신
    useWebSocket(user?.id, (newAlarm) => {
        setNotifications((prev) => [newAlarm, ...prev]);//  기존 알림 목록 앞에 새 알림 추가
        setUnreadCount((prev) => prev + 1); //  읽지 않은 알림 개수 증가
    });


    //  마운트 시 기존 알림을 불러오는 함수
    useEffect(() => {
        if (!user?.id) return;//  로그인하지 않은 경우 요청하지 않음
        
        axios.get(`http://localhost:8080/mymy/alarms/${user.id}`)//  백엔드에서 알림 목록 가져오기
            .then(response => {
                setNotifications(response.data);//  알림 목록 업데이트
                setUnreadCount(response.data.filter(alarm => !alarm.read).length);//  읽지 않은 알림 개수 계산
            })
            .catch(error => console.error("알림 불러오기 실패:", error));//  오류 발생 시 로그 출력
    }, [user]);//  user 값이 변경될 때마다 실행

    //  알림 아이콘 클릭 시 실행되는 함수
    const handleBellClick = () => {
        if (!user) {//  로그인하지 않은 경우
            alert("로그인이 필요합니다.");//  로그인 필요 메시지 출력
            return;
        }
        setUnreadCount(0);//  읽지 않은 알림 개수를 초기화
        window.location.href = "/mypage/alarm";//  알림 페이지로 이동
    };

    return (
        <div className="alarm-icon-container" onClick={handleBellClick}>
             {/*  알림 아이콘 표시, 읽지 않은 알림이 있으면 `has-alert` 클래스 추가 */}
            <i className={`fa fa-bell${unreadCount > 0 ? " has-alert" : ""}`} />
            {/*  읽지 않은 알림 개수 뱃지 표시 */}
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
        </div>
    );
};

export default AlarmIcon;
