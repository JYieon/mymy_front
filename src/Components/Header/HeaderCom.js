import { Link } from "react-router-dom";
import "./Header.css"
import { useEffect, useRef } from "react";
import AuthApi from "../../api/AuthApi";

const HeaderCom=()=>{


    const Logout=useRef(null);
    const Login=useRef(null);
    
    useEffect(()=>{
        if (localStorage.getItem("accessToken"))
            {
                Login.current.style.display="block";
                Logout.current.style.display="none";
            }
        else{
            Login.current.style="display:none;"
            Logout.current.style.display="block";

        }    
    }, [])

    const onClickLogout = async () => {
        if(localStorage.getItem("kakao")){
            const res = await AuthApi.kakaoLogout();
            localStorage.removeItem("accessToken") ;
            window.location.href = res.data
        }else{
            localStorage.removeItem("accessToken") ;
            window.location.href = "/";
        }
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
                                    <Link to="/Board/BookMark" className="Menu">북마크</Link>
                                </li>
                                <li>
                                    <Link to="/Board/Plan" className="Menu">여행 계획</Link>
                                </li>
                                <li>
                                    <Link to="/Board/Diary" className="Menu">여행 기록</Link>
                                </li>
                                <li>
                                    <Link to="/Board/Mate" className="Menu">여행 메이트</Link>
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
                                    <Link to="/Board/BookMark" className="Menu">북마크</Link>
                                </li>
                                <li>
                                    <Link to="/Board/Plan" className="Menu">여행 계획</Link>
                                </li>
                                <li>
                                    <Link to="/Board/Diary" className="Menu">여행 기록</Link>
                                </li>
                                <li>
                                    <Link to="/Board/Mate" className="Menu">여행 메이트</Link>
                                </li>
                            </ul>
                        </li>
                        <li className="HeaderNav link">채팅
                            <ul className="MenuList">
                                <li>
                                    <Link to="/chat/유저고유번호/list" className="Menu">채팅 목록</Link>
                                </li>
                                <li>
                                    <Link to="/chat/유저고유번호/newChat" className="Menu">새로운 채팅</Link>
                                </li>
                            </ul>
                        </li>
                        <li className="HeaderNav">
                            <Link to="/account/mypage" className="link">마이페이지</Link>
                        </li>
                        <li className="HeaderNav">
                            {/* 이후 수정 필요 */}
                            <button className="link" onClick={onClickLogout}>로그아웃</button>
                        </li>
                        <li className="HeaderNav">
                            <svg className="Alarm" width="20px" height="20px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3 5C3 2.23858 5.23858 0 8 0C10.7614 0 13 2.23858 13 5V8L15 10V12H1V10L3 8V5Z" fill="#000000"/>
<path d="M7.99999 16C6.69378 16 5.58254 15.1652 5.1707 14H10.8293C10.4175 15.1652 9.30621 16 7.99999 16Z" fill="#000000"/>
                            </svg>
                            <ul className="AlarmList">
                                {/* 임시 주소 */}
                                <li>
                                    <Link to="/게시글" className="Menu">내가 쓴 댓글에 답글이 달렸습니다.</Link>
                                </li>
                                <li>
                                    <Link to="/게시글" className="Menu">내가 쓴 댓글에 답글이 달렸습니다.</Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </header>
        </>
    )
};
export default HeaderCom;