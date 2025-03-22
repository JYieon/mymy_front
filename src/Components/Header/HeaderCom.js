import { Link, useLocation, useNavigate } from "react-router-dom";
import style from "./Header.module.css";
import { useEffect, useRef, useState } from "react";
import AuthApi from "../../api/AuthApi";
import MypageApi from "../../api/MypageApi";
import AlarmIcon from "../../component/alarm/alarmIcon";
// import useAlramWebSocket from "../../component/alarm/useAlramWebsocket";
import { useWebSocketContext } from "../../component/alarm/alramWebSocketProvider";
import ChatApi from "../../api/ChatApi";


const HeaderCom = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("accessToken")
    // console.log("알림 리스트에서 받은 사용자 ID:", userId);

    const [notifications, setNotifications] = useState([]); // 알림 리스트
    // const [hasUnread, setHasUnread] = useState(false); // 읽지 않은 알람 여부
    const [showDropdown, setShowDropdown] = useState(false); // 알람 목록 열기/닫기
    const isAuthenticated = !!token;//로그인 여부 확인
    const { hasUnread, setHasUnread } = useWebSocketContext();
    const [userId, setUserId] = useState("unknownUser");
    const [userNick, setUserNick] = useState("알 수 없는 사용자");
    const [userLevel, setUserLevel] = useState("생각 하는 냥이");
    console.log("header", hasUnread)

    useEffect(() => {
        const getUserInfo = async (token) => {
            try {
                const res = await ChatApi.getUserInfo(token);
                setUserId(res.data.id);
                setUserNick(res.data.nick);
                //   const resAlram = await MypageApi.getAlarms(token);
                //   console.log("🔹 받아온 알람 데이터:", resAlram.data);
                //   setNotifications(resAlram.data);

                //   notifications.map((noti) => {
                //     if(noti.isRead === 0){
                //         setHasUnread(true);
                //         console.log("!!!!!", hasUnread)
                //         return;
                //     }
                //   })


                // .then(response => {
                //     console.log("🔹 받아온 알람 데이터:", response.data);

                //     // ✅ null 값 제거 및 기본값 설정
                //     const validNotifications = (response.data || []).filter(alarm => alarm !== null);

                //     setNotifications(validNotifications);

                //     // ✅ 오류 방지를 위해 every() 또는 some() 사용 시 기본값 처리
                //     setHasUnread(validNotifications.length > 0 && validNotifications.some(alarm => alarm?.read === false));
                // })
                //         .catch(error => console.error("🚨 알림 가져오기 실패:", error));
                // }
            } catch (error) {
                console.log(error);
            }
        };


        if (localStorage.getItem("accessToken")) {
            console.log("로그인 사용자")
            getUserInfo(localStorage.getItem("accessToken"));
            // if (userId) {
            //     MypageApi.getAlarms(token)
            //         .then(response => {
            //             console.log("🔹 받아온 알람 데이터:", response.data);

            //             // ✅ null 값 제거 및 기본값 설정
            //             const validNotifications = (response.data || []).filter(alarm => alarm !== null);

            //             setNotifications(validNotifications);

            //             // ✅ 오류 방지를 위해 every() 또는 some() 사용 시 기본값 처리
            //             setHasUnread(validNotifications.length > 0 && validNotifications.some(alarm => alarm?.read === false));
            //         })
            //         .catch(error => console.error("🚨 알림 가져오기 실패:", error));
            // }
        }
    }, []);


    const onClickLogout = async () => {
        if (localStorage.getItem("kakao")) {
            const res = await AuthApi.kakaoLogout();
            localStorage.removeItem("accessToken");
            // localStorage.removeItem("userId") ;
            window.location.href = res.data
        } else {
            localStorage.removeItem("accessToken");
            // localStorage.removeItem("userId") ;
            window.location.href = "/";
        }
    };

    //알람 아이콘 클릭 이벤트
    const handleClick = () => {
        //로그인 되어있지 않으면 아예 알람 아이콘이 안 뜨게 설정해서 해당 기능 필요없음
        // if (!isAuthenticated) {
        //     alert("로그인이 필요합니다.");
        //     return;
        // }
        setHasUnread(false); // 알림 아이콘 클릭 시 읽지 않은 알림 상태 초기화
    };

    return (
        <>
            <header>
                {/* 웹사이트 로고 (클릭 시 메인) */}
                <Link to="/" className="Logo link">MY<br />MY</Link>
                <nav>
                    <ul className={style.headerNav}>
                        <li className={style.headerMenu} id="커뮤니티">
                            <Link to={`/board/list?category=2`} className="link">커뮤니티</Link>
                            <ul className={style.menuList}>
                                {/* 로그인 상태일때만 보여지는 커뮤니티 카테고리 */}
                                {isAuthenticated && (<>
                                    <li>
                                        <Link to="/board/bookmarkList" className={style.menu}>북마크</Link>
                                    </li>
                                    <li>
                                        <Link to="/board/list?category=1" className={style.menu}>여행 계획</Link>
                                    </li>
                                </>)}
                                {/* 로그아웃 상태일 때도 보여지는 커뮤티니 카테고리 */}
                                <li>
                                    <Link to="/board/list?category=2" className={style.menu}>여행 기록</Link>
                                </li>
                                <li>
                                    <Link to="/mateboard/list" className={style.menu}>여행 메이트</Link>
                                </li>
                            </ul>
                        </li>
                        {/* 로그인 상태에 따라 달라지는 헤더 */}
                        {isAuthenticated ?
                            //로그인 상태일 시 보여지는 헤더
                            (<>
                                <li className={style.headerMenu} id="채팅">채팅
                                    <ul className={style.menuList}>
                                        <li>
                                            <Link to="/chat/list" className={style.menu}>채팅 목록</Link>
                                        </li>
                                        <li>
                                            <Link to="/chat/Create" className={style.menu}>새로운 채팅</Link>
                                        </li>
                                    </ul>
                                </li>
                                {/* 사용자 정보 */}
                                <div className={style.userInfo}>
                                    {userNick}님 안녕하세요!
                                    <span className={style.userLevel}>{userLevel}</span>

                                    <li className={style.headerMenu} id="마이페이지">
                                        <Link to={`/mypage/modify`} className="link">마이페이지</Link>
                                        <ul className={style.menuList}>
                                            <li>
                                                <Link to={`/mypage/my_story/${userId}`} className={`link ${style.menu}`}>
                                                    내가 쓴 글
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to={`/mypage/my_reply/${userId}`} className={`link ${style.menu}`}>
                                                    내가 쓴 댓글
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to={`/mypage/modify/${userId}`} className={`link ${style.menu}`}>
                                                    회원정보 수정
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to={`/mypage/alarm/settings/${userId}`}
                                                    className={`link ${style.menu}`}
                                                >
                                                    알림 설정
                                                </Link>
                                            </li>
                                        </ul>
                                    </li>
                                    <li className={style.headerMenu} id="로그아웃 버튼">
                                        <button className={style.logoutBtn} onClick={onClickLogout}>로그아웃</button>
                                    </li>
                                    <li className={style.headerMenu} id="알람 아이콘" onClick={handleClick}>
                                        <AlarmIcon hasUnread={hasUnread} />
                                    </li>
                                </div>
                            </>) :
                            //로그아웃 상태일 시 보여지는 헤더
                            (<div className={style.userInfo}>
                                아직 회원이 아니십니다!
                                <li className={style.headerMenu} id="로그인">
                                    <Link to={`/account/login`} className="link">로그인</Link>
                                </li>
                                <li className={style.headerMenu} id="회원가입">
                                    <Link to={`/account/register`} className="link">회원가입</Link>
                                </li>
                            </div>)}



                    </ul>
                </nav>
            </header>
        </>
    )
};
export default HeaderCom;