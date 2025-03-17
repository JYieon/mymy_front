import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MypageApi from "../../api/MypageApi"; // ✅ API 호출 파일
import ChatApi from "../../api/ChatApi"; // ✅ 로그인한 유저 정보 가져오기
import SidebarCom from "../../Components/Sidebar/SidebarCom";
import { Link } from "react-router-dom";


const AlarmList = () => {
    const navigate = useNavigate();
    const { userId: paramUserId } = useParams(); // ✅ URL에서 userId 가져오기
    const token = localStorage.getItem("accessToken"); // ✅ 토큰 유지
    const [userId, setUserId] = useState(null);
    const [alarms, setAlarms] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const alarmsPerPage = 10; // 한 페이지에 보여줄 알림 개수

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const res = await ChatApi.getUserInfo(token); // ✅ 로그인한 사용자 정보 가져오기
                console.log("백엔드에서 가져온 userId:", res.data.id);

                const userIdFromApi = res.data.id;
                localStorage.setItem("userId", userIdFromApi); // ✅ `localStorage`에 userId 저장
                setUserId(userIdFromApi);
            } catch (error) {
                console.error("🚨 userId 가져오기 실패:", error);
                navigate("/login"); // ✅ 실패하면 로그인 페이지로 이동
            }
        };

        if (!localStorage.getItem("userId")) {
            fetchUserInfo(); // ✅ `localStorage`에 userId 없으면 백엔드에서 가져옴
        } else {
            setUserId(localStorage.getItem("userId"));
        }
    }, [token, navigate]);

    useEffect(() => {
        if (!userId) return; // ✅ userId가 없으면 요청 중단

        MypageApi.getAlarms(userId)
            .then(response => {
                console.log("🔹 받아온 알림 데이터:", response.data);

                // ✅ null, undefined 값이 포함된 경우 필터링
                const validAlarms = (response.data || []).filter(alarm => alarm && alarm !== null && alarm !== undefined);

                setAlarms(validAlarms);  // ✅ null이 제거된 데이터 저장
            })
            .catch(error => console.error("🚨 알림 목록 가져오기 실패:", error));
    }, [userId]);




    // 페이지네이션 처리
    const indexOfLastAlarm = currentPage * alarmsPerPage;
    const indexOfFirstAlarm = indexOfLastAlarm - alarmsPerPage;
    const currentAlarms = alarms.slice(indexOfFirstAlarm, indexOfLastAlarm);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    console.log("🔹 알림 데이터:", alarms);

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
                                    <td>{alarm?.alarmContent || "새로운 알림이 있습니다."}</td>
                                    <td><Link to={`/board/detail/${alarm?.boardId || 0}`} className="view-link">바로가기</Link></td>
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
