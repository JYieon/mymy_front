import { Link, Outlet } from "react-router-dom";
import "./Sidebar.css"
const SidebarCom=()=>{
    const userId = "aaa"; // 현재 로그인한 사용자 ID (임시 테스트용)
    return (<>
        <div className="Sidebar">
            {/* 현재 로그인 유저 프로필 */}
            <div className="UserInfo Shadow">
                <div>
                    <img src="https://picsum.photos/200/200" alt="can't read Img" className="UserProfilePic"/>
                </div>

                <Link to="{`/user/${userId}`}" className="UserId">{userId}</Link>
                <div className="UserLevel">고양이</div>
                {/*  팔로잉 / 팔로워 버튼 추가 */}
                <div className="UserFollower">
                        <Link to={`/mypage/following/${userId}`} className="FollowButton">팔로잉 </Link>
                        <Link to={`/mypage/followers/${userId}`} className="FollowButton">팔로워</Link>
                    </div>
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
                            <li><Link to="/board/bookmarkList" className="Menu">북마크</Link></li>
                            <li><Link to="/board/list?category=1" className="Menu">여행 계획</Link></li>
                            <li><Link to="/board/list?category=2" className="Menu">여행 기록</Link></li>
                            <li><Link to="/board/mate" className="Menu">여행 메이트</Link></li>
                        </ul>
                        <hr className="ContourLine"/>
                    </li>

                    {/* 채팅 목록 */}
                    <li className="link">채팅
                        <ul className="MenuList">
                            <li><Link to="/board/Chat" className="Menu">채널 목록</Link></li>
                            <li><Link to="../chat/newChat" className="Menu">채팅방 만들기</Link></li>
                        </ul>
                        <hr className="ContourLine"/>
                    </li>
                    {/* 마이페이지 */}{/* 영주님이랑 상의후 수지 수정중 */}
                    <li className="link">마이페이지
                        <ul className="MenuList">            
                            <li><Link to="/mypage/your_story" className="Menu">내가 쓴 글</Link></li>
                            <li><Link to="/mypage/my_story" className="Menu">내가 쓴 댓글</Link></li>
                            <li><Link to="/mypage/modify" className="Menu">회원정보 수정</Link></li>
                            <li><Link to={`/mypage/alarm/settings/${userId}`} className="Menu">알림 설정</Link></li>
                        </ul>
                        <hr className="ContourLine"/>

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