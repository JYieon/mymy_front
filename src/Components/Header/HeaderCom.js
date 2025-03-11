import { Link } from "react-router-dom";
import "./Header.css"
const HeaderCom=()=>{
    return (
        <>
            <header>
                {/* 웹사이트 로고 (클릭 시 메인) */}
                <Link to="/" className="Logo link">MY<br/>MY</Link>
                <nav>
                    <ul>
                        <li className="HeaderNav">
                            <Link to="/account/login" className="link">로그인</Link>
                        </li>
                        <li className="HeaderNav">
                            <Link to="/account/register" className="link">회원가입</Link>
                        </li>
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
                    </ul>
                </nav>
            </header>
        </>
    )
};
export default HeaderCom;