import { Link, useLocation, useNavigate  } from "react-router-dom";
import "./Header.css"
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
    const Logout=useRef(null);
    const Login=useRef(null);
    const [notifications, setNotifications] = useState([]); // 알림 리스트
    // const [hasUnread, setHasUnread] = useState(false); // 읽지 않은 알람 여부
    const [showDropdown, setShowDropdown] = useState(false); // 알람 목록 열기/닫기
    const isAuthenticated = !!token;//로그인 여부 확인
    const {hasUnread, setHasUnread} = useWebSocketContext();
    const [userId, setUserId] = useState();
    console.log("header", hasUnread)

    useEffect(()=>{
        const getUserInfo = async (token) => {
            try {
              const res = await ChatApi.getUserInfo(token);
              setUserId(res.data.id);

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
          
        
        if (localStorage.getItem("accessToken"))
            {
                console.log("로그인 사용자")
                Login.current.style.display="block"; 
                Logout.current.style.display="none";
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
        }else{
            Login.current.style="display:none;"
            Logout.current.style.display="block";

        }    
    }, []);


    const onClickLogout = async () => {
        if(localStorage.getItem("kakao")){
            const res = await AuthApi.kakaoLogout();
            localStorage.removeItem("accessToken") ;
            // localStorage.removeItem("userId") ;
            window.location.href = res.data
        }else{
            localStorage.removeItem("accessToken") ;
            // localStorage.removeItem("userId") ;
            window.location.href = "/";
        }
    };

    //알람 아이콘 클릭 이벤트
    const handleClick = () => {
        if (!isAuthenticated) {
            alert("로그인이 필요합니다.");
            return;
        }
        
        //setHasUnread(false); // 알림 아이콘 클릭 시 읽지 않은 알림 상태 초기화
    };

    return (
        <>
            <header>
                {/* 웹사이트 로고 (클릭 시 메인) */}
                <Link to="/" className="Logo link">MY<br/>MY</Link>
                <nav>
                    {/* 로그아웃 상태에서 표시 되는 헤더 */}
                    <ul className="LogoutState" ref={Logout}>

                        <li className="HeaderNav link">커뮤니티
                            <ul className="MenuList">
                                <li>
                                    <Link to="/board/bookmarkList" className="Menu">북마크</Link>
                                </li>
                                <li>
                                    <Link to="/board/list?category=1" className="Menu">여행 계획</Link>
                                </li>
                                <li>
                                    <Link to="/board/list?category=2" className="Menu">여행 기록</Link>
                                </li>
                                <li>
                                    <Link to="/mateboard/list" className="Menu">여행 메이트</Link>
                                </li>
                            </ul>
                        </li>
                        <li className="HeaderNav">
                            
                            <Link to="/account/login" className="link">로그인</Link>
                        </li>
                        <li className="HeaderNav">
                            <Link to="/account/register" className="link">회원가입</Link>
                        </li>
                    </ul>
                    {/* 로그인 상태에서 표시 되는 헤더 */}
                    <ul className="LoginState" ref={Login} >

                        <li className="HeaderNav link">커뮤니티
                            <ul className="MenuList">
                                <li>
                                    <Link to="/board/bookmarkList" className="Menu">북마크</Link>
                                </li>
                                <li>
                                    <Link to="/board/list?category=1" className="Menu">여행 계획</Link>
                                </li>
                                <li>
                                    <Link to="/board/list?category=2" className="Menu">여행 기록</Link>
                                </li>
                                <li>
                                    <Link to="/mateboard/list" className="Menu">여행 메이트</Link>
                                </li>
                            </ul>
                        </li>
                        <li className="HeaderNav link">채팅
                            <ul className="MenuList">
                                <li>
                                    <Link to="/chat/list" className="Menu">채팅 목록</Link>
                                </li>
                                <li>
                                    <Link to="/chat/Create" className="Menu">새로운 채팅</Link>
                                </li>
                            </ul>
                        </li>
                        <li className="HeaderNav">
                            <Link to= {`/mypage/modify`} className="link">마이페이지</Link>
                        </li>
                        <li className="HeaderNav">

                            <button className="LogoutBtn" onClick={onClickLogout}>로그아웃</button>
                        </li>
                        {/* ✅ 알람 아이콘 추가 */}
                        <li className="HeaderNav" onClick={handleClick}>
                            <AlarmIcon hasUnread={hasUnread} />
                        </li>

                    </ul>
                </nav>
            </header>
        </>
    )
};
export default HeaderCom;