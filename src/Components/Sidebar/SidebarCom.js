import { Link, Outlet } from "react-router-dom";
import "./Sidebar.css"
const SidebarCom=()=>{
    return (<>
        <div className="Sidebar">
            {/* 현재 로그인 유저 프로필 */}
            <div className="UserInfo Shadow">
                <div>
                    <img src="https://picsum.photos/200/200" alt="can't read Img" className="UserProfilePic"/>
                </div>
                <div className="UserName">TestUser</div>
                <div className="UserLevel">고양이</div>
                <div className="UserFollower">팔로잉 팔로워</div>
                <Link to="/mypage/myContent">내가 쓴 글</Link>
                <Link to="/account/logout">로그아웃</Link>
            </div>

            {/* 메뉴 카테고리 */}
            <div className="Category Shadow">
                <ul>
                    {/* 메인 */}
                    <li>
                        <Link to="/" className="link">home</Link>
                        <hr/>
                    </li>

                    {/* 커뮤니티 목록 */}
                    <li className="link">커뮤니티
                        <ul className="MenuList ">
                            <li><Link to="/Board/Bookmark" className="Menu">북마크</Link></li>
                            <li><Link to="/Board/Plan" className="Menu">여행 계획</Link></li>
                            <li><Link to="/Board/Diary" className="Menu">여행 기록</Link></li>
                            <li><Link to="/Board/Mate" className="Menu">여행 메이트</Link></li>
                        </ul>
                        <hr className="ContourLine"/>
                    </li>

                    {/* 채팅 목록 */}
                    <li className="link">채팅
                        <ul className="MenuList">
                            <li><Link to="/Board/Chat" className="Menu">내 채팅</Link></li>
                            <li><Link to="/PlanBoard" className="Menu">송금</Link></li>
                        </ul>
                        <hr className="ContourLine"/>
                    </li>
                    {/* 마이페이지 */}
                    <li>
                        <Link to="/MyPage" className="link">마이페이지</Link>
                        <hr/>
                    </li>
                </ul>

            </div>
        </div>

        {/* 게시판 표시되는 부분 */}
        <div className="ContentSection Shadow">
            <Outlet/>
        </div>
    </>)
};
export default SidebarCom;