import { Link } from "react-router-dom";
import "./Header.css"
import { useRef } from "react";

const HeaderCom=()=>{


    const Logout=useRef(null);
    const Login=useRef(null);
    
    const onClick=()=>{
        if (Login.current.style.display==="none")
            {
                Login.current.style.display="block";
                Logout.current.style.display="none";
            }
        else{
            Login.current.style="display:none;"
            Logout.current.style.display="block";

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
                        <button onClick={onClick}>로그인 임시 버튼</button>
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
                    <button onClick={onClick}>로그아웃 임시 버튼</button>

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
                            <Link to="/account/logout" className="link" onClick={onClick}>로그아웃</Link>
                        </li>
                    </ul>
                </nav>
            </header>
        </>
    )
};
export default HeaderCom;