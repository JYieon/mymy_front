import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MypageApi from "../../api/MypageApi"; //  API 호출 파일
import ChatApi from "../../api/ChatApi"; //  로그인한 유저 정보 가져오기
import SidebarCom from "../../Components/Sidebar/SidebarCom";
import { Link } from "react-router-dom";


const AlarmList = () => {
    const navigate = useNavigate();
    // const { userId: paramUserId } = useParams(); // ✅ URL에서 userId 가져오기
    const token = localStorage.getItem("accessToken"); // ✅ 토큰 유지
    const [userId, setUserId] = useState(null);
    const [alarms, setAlarms] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const alarmsPerPage = 10; // 한 페이지에 보여줄 알림 개수

    //로그인한 사용자 정보 가져오기
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const res = await ChatApi.getUserInfo(token); //  로그인한 사용자 정보 유지
                console.log("백엔드에서 가져온 userId:", res.data.id);
                // const userId = res.data.id;
                // localStorage.setItem("userId", userId); // ✅ `localStorage`에 userId 저장
                setUserId(res.data.id);
            } catch (error) {
                console.error(" userId 가져오기 실패:", error);
                navigate("/login"); //  실패하면 로그인 페이지로 이동
            }
        };

        const getUserAlram = async () => {
            const resAlram = await MypageApi.getAlarms(token);
            console.log("🔹 받아온 알람 데이터:", resAlram.data);
            setAlarms(resAlram.data);
        }

        fetchUserInfo();
        getUserAlram();

    }, []);

    // useEffect(() => {
    //     //if (!userId) return; // ✅ userId가 없으면 요청 중단
    //     const getUserAlram = async () => {
    //         const resAlram = await MypageApi.getAlarms(localStorage.getItem("accessToken"));
    //         console.log("🔹 받아온 알람 데이터:", resAlram.data);
    //         setAlarms(resAlram.data);
    //     }
        
    //     // MypageApi.getAlarms(userId)
    //     //     .then(response => {
    //     //         console.log("🔹 받아온 알림 데이터:", response.data);

    //     //         // ✅ null, undefined 값이 포함된 경우 필터링
    //     //         const validAlarms = (response.data || []).filter(alarm => alarm && alarm !== null && alarm !== undefined);

    //     //         setAlarms(validAlarms);  // ✅ null이 제거된 데이터 저장
    //     //     })
    //     //     .catch(error => console.error("🚨 알림 목록 가져오기 실패:", error));
    // }, []);

    const handleClick = async (type, addr, no) => {
        // console.log(type)
        console.log("바로가기 클릭!!!")
        await MypageApi.markAlarmsAsRead(token, no)
        if(type === 1){ //팔로우의 새로운 게시글
            window.location.href = "/board/detail/" + addr
        }else if(type === 2){ //새로운 댓글
            window.location.href = "/board/detail/" + addr
        }else if(type === 3){ //새로운 채팅
            window.location.href = "/groupChat/" + addr
        }else if(type === 4){ //새로운 팔로우 요청
            window.location.href = "/mypage/followers"
        }

        // window.location.href = ""
    }

    // 페이지네이션 처리(한 페이지를 10개씩 나눠서 보여줌)
    const indexOfLastAlarm = currentPage * alarmsPerPage;
    const indexOfFirstAlarm = indexOfLastAlarm - alarmsPerPage;
    const currentAlarms = alarms.slice(indexOfFirstAlarm, indexOfLastAlarm);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    // console.log("🔹 알림 데이터:", alarms);

    return (
        <div className="alarm-container">
            {/* 기존 사이드바 유지 */}
            <SidebarCom />

            {/* 알림 리스트 */}
            <div className="alarm-content">
                <h2 className="alarm-title">내 알림</h2>
                <table className="alarm-table">
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>내용</th>
                            <th>원본 글</th>
                            <th>작성일자</th>
                            <th>댓글</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alarms.length > 0 ? (
                            alarms.map((alarm, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{alarm.senderId + alarm.alarmContent}</td>
                                    <td onClick={() => handleClick(alarm.alarmTypeId, alarm.addr, alarm.alarmNo)}>바로가기</td>
                                    <td>{alarm?.createdAt || "날짜 없음"}</td>
                                    <td>{alarm?.commentCount || 0}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">알림이 없습니다.</td>
                            </tr>
                        )}
                    </tbody>

                </table>

                {/* 페이지네이션 */}
                <div className="pagination">
                    {Array.from({ length: Math.ceil(alarms.length / alarmsPerPage) }, (_, i) => (
                        <button key={i} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? "active" : ""}>
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AlarmList;
