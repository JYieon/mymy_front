import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MypageApi from "../../api/MypageApi"; //  API 호출 파일
import ChatApi from "../../api/ChatApi"; //  로그인한 유저 정보 가져오기
import SidebarCom from "../../Components/Sidebar/SidebarCom";
import { Link } from "react-router-dom";


const AlarmList = () => {
    const navigate = useNavigate();
    const { userId: paramUserId } = useParams(); //  URL에서 userId 가져오기
    const token = localStorage.getItem("accessToken"); // 로그인한 사용자의 토큰큰
    const [userId, setUserId] = useState(null); //로그인한 사용자 id 상태 
    const [alarms, setAlarms] = useState([]);//알림 목록 상태 
    const [currentPage, setCurrentPage] = useState(1);//현재 페이지 상태
    const alarmsPerPage = 10; // 한 페이지에 보여줄 알림 개수

    //로그인한 사용자 정보 가져오기
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const res = await ChatApi.getUserInfo(token); //  로그인한 사용자 정보 유지
                console.log("백엔드에서 가져온 userId:", res.data.id);

                const userIdFromApi = res.data.id;
                localStorage.setItem("userId", userIdFromApi); //  `localStorage`에 userId 저장
                setUserId(userIdFromApi);// 상태 업로드드
            } catch (error) {
                console.error(" userId 가져오기 실패:", error);
                navigate("/login"); //  실패하면 로그인 페이지로 이동
            }
        };

        if (!localStorage.getItem("userId")) {
            fetchUserInfo(); //  `localStorage`에 userId 없으면 백엔드에서 가져옴
        } else {
            setUserId(localStorage.getItem("userId"));//저장된 userid 사용용
        }
    }, [token, navigate]);//토큰이 변경되면 다시 실행행

    //받은 알림 목록 불러오기기
    useEffect(() => {
        if (!userId) return; //  userId가 없으면 요청 중단

        MypageApi.getAlarms(userId)
            .then(response => {
                console.log("받아온 알림 데이터:", response.data);

                // 데이터가 없거나 잘못된 값이면 걸리줌줌
                const validAlarms = (response.data || []).filter(alarm => alarm && alarm !== null && alarm !== undefined);

                setAlarms(validAlarms);  //받은 알림 저장장
            })
            .catch(error => console.error(" 알림 목록 가져오기 실패:", error));
    }, [userId]);//userId가 변경도리 때마다 실행행




    // 페이지네이션 처리(한 페이지를 10개씩 나눠서 보여줌)
    const indexOfLastAlarm = currentPage * alarmsPerPage;
    const indexOfFirstAlarm = indexOfLastAlarm - alarmsPerPage;
    const currentAlarms = alarms.slice(indexOfFirstAlarm, indexOfLastAlarm);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);//페이지 변경 함수수
    console.log("알림 데이터:", alarms);

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
                                    {/* 원본 게시글로 이동하는 링크크 */}
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
