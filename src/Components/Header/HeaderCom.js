import { Link, useLocation, useNavigate } from "react-router-dom";
import style from "./Header.module.css";
import { useEffect, useRef, useState } from "react";
import AuthApi from "../../api/AuthApi";
import MypageApi from "../../api/MypageApi";
import AlarmIcon from "../../component/alarm/alarmIcon";
// import useAlramWebSocket from "../../component/alarm/useAlramWebsocket";
import { useWebSocketContext } from "../../component/alarm/alramWebSocketProvider";
import ChatApi from "../../api/ChatApi";


const HeaderCom = ({ headerDisplay }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem("accessToken")
    // console.log("알림 리스트에서 받은 사용자 ID:", userId);

    const [notifications, setNotifications] = useState([]); // 알림 리스트
    // const [hasUnread, setHasUnread] = useState(false); // 읽지 않은 알람 여부
    const [showDropdown, setShowDropdown] = useState(false); // 알람 목록 열기/닫기
    const isAuthenticated = !!token;//로그인 여부 확인
    const { hasUnread, setHasUnread } = useWebSocketContext();
    const [userId, setUserId] = useState("unknownUser");
    const [userNick, setUserNick] = useState("");
    const [userLevel, setUserLevel] = useState("");
    console.log("header", hasUnread)

    const getLevelName = (level) => {
        switch (parseInt(level)) {
            case 1:
                return "생각하는 냥이";
            case 2:
                return "호기심 많은 냥이";
            case 3:
                return "활동적인 냥이";
            case 4:
                return "전설적인 냥이";
            default:
                return "생각하는 냥이";
        }
    };

    useEffect(() => {
        const getUserInfo = async (token) => {
            try {
                const res = await ChatApi.getUserInfo(token);
                console.log("ddd", res.data);
                setUserId(res.data.id);
                setUserNick(res.data.nick);
                setUserLevel(getLevelName(res.data.level))
                const resAlram = await MypageApi.getAlarms(token);
                console.log("🔹 받아온 알람 데이터:", resAlram.data);
                setNotifications(resAlram.data);

                notifications.map((noti) => {
                    if (noti.isRead === 0) {
                        setHasUnread(true);
                        console.log("!!!!!", hasUnread)
                        return;
                    }
                })


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
            if (userId) {
                MypageApi.getAlarms(token)
                    .then(response => {
                        console.log("🔹 받아온 알람 데이터:", response.data);

                        // ✅ null 값 제거 및 기본값 설정
                        const validNotifications = (response.data || []).filter(alarm => alarm !== null);

                        setNotifications(validNotifications);

                        // ✅ 오류 방지를 위해 every() 또는 some() 사용 시 기본값 처리
                        setHasUnread(validNotifications.length > 0 && validNotifications.some(alarm => alarm?.read === false));
                    })
                    .catch(error => console.error("🚨 알림 가져오기 실패:", error));
            }
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
                <Link to="/" className={`link ${style.logo}`}>MY<br />MY</Link>
                <nav>
                    {headerDisplay && (
                        <ul className={style.headerNav}>
                            <li className={style.headerMenu} id="커뮤니티">
                                <Link to={`/board/list?category=2`} className={`link ${style.boardBtn}`}>커뮤니티</Link>
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
                            <li className={style.headerMenu} id="커뮤니티">
                                <Link to={`/board/hashtags`} className={`link ${style.boardBtn}`}>해시태그</Link>
                            </li>
                            {/* 로그인 상태에 따라 달라지는 헤더 */}
                            {isAuthenticated ?
                                //로그인 상태일 시 보여지는 헤더
                                (<>
                                    <li className={style.headerMenu} id="채팅">
                                    <Link to={`/chat/list`} className={`link ${style.boardBtn}`}>채팅</Link>

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
                                        <span className={style.userId}>{userNick}님 안녕하세요!</span>
                                        <div className={`${style.userInfoWrap}`}>
                                            <li className={`${style.mypage} ${style.headerMenu}`} id="마이페이지">
                                                <Link to={`/mypage/modify`} className={`link ${style.mypageBtn}`}>{userLevel}</Link>
                                                <ul className={style.menuList}>
                                                    <li>
                                                        <Link to={`/mypage/my_story`} className={`link ${style.menu}`}>
                                                            내가 쓴 글
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link to={`/mypage/my_reply`} className={`link ${style.menu}`}>
                                                            내가 쓴 댓글
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link to={`/mypage/modify`} className={`link ${style.menu}`}>
                                                            회원정보 수정
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link
                                                            to={`/mypage/alarm/settings`}
                                                            className={`link ${style.menu}`}
                                                        >
                                                            알림 설정
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </li>
                                            <li className={`${style.mypage} ${style.headerMenu}`} id="로그아웃 버튼">
                                                <button className={style.logoutBtn} onClick={onClickLogout}>로그아웃</button>
                                            </li>
                                        </div>
                                    </div>
                                    <li className={`${style.mypage} ${style.headerMenu}`} id="알람 아이콘" onClick={handleClick}>
                                        <AlarmIcon hasUnread={hasUnread} />
                                    </li>
                                </>) :
                                //로그아웃 상태일 시 보여지는 헤더
                                (<div className={style.userInfo}>
                                    비회원 상태입니다.
                                    <li className={style.headerMenu} id="로그인">
                                        <Link to={`/account/login`} className={`link ${style.loginBtn}`}>로그인</Link>
                                    </li>
                                    <li className={style.headerMenu} id="회원가입">
                                        <Link to={`/account/register`} className={`link ${style.registerBtn}`}>회원가입</Link>
                                    </li>
                                </div>)}
                        </ul>
                    )}
                </nav>
            </header>
        </>
    )
};
export default HeaderCom;