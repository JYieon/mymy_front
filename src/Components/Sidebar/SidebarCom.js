import { Link } from "react-router-dom";
import "./Sidebar.css";
import "../../Css/Modal.css";
import { useEffect, useState } from "react";
import ChatApi from "../../api/ChatApi";
import Modal from "react-modal";
import MypageApi from "../../api/MypageApi";
import { useNavigate } from "react-router-dom";

//자 처음이야
const SidebarCom = () => {
    const token = localStorage.getItem("accessToken");
    const [userId, setUserId] = useState("");
    const [ProfileEditOpen, setProfileEditOpen] = useState(false);
    const [ProfilePic, setProfilePic] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);
    const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);


    useEffect(() => {
        const userInfo = async () => {

            if (!token) {
                console.log("토큰이 없습니다! 로그아웃 상태입니다.");
                setIsAuthenticated(false);
                setUserId(null);
                return;
            }

            try {
                const res = await ChatApi.getUserInfo(token);
                if (res.data && res.data.id) {
                    const fetchedUserId = res.data.id;
                    setUserId(fetchedUserId);
                    setIsAuthenticated(true);
                    console.log(" 로그인한 사용자 ID:", fetchedUserId);


                    // 팔로워 & 팔로잉 개수 가져오기 (리스트 전체 조회)
                    const followerRes = await MypageApi.getFollowerList();
                    console.log(" 팔로워 리스트 응답:", followerRes);


                    //  followerId가 현재 로그인한 userId인 경우만 필터링
                    const filteredFollowers = followerRes.filter(user => user.followerId === userId);
                    console.log(" 필터링된 팔로워 리스트:", filteredFollowers);
                    setFollowerCount(followerRes.length);
                } else {
                    console.log(" [오류] 팔로워 데이터가 배열이 아닙니다.");
                }
            } catch (error) {
                console.error(" 팔로워 리스트 가져오기 실패:", error);
            }

            try {
                const followingRes = await MypageApi.getFollowingList();
                console.log(" 팔로잉 리스트 응답:", followingRes);

                if (Array.isArray(followingRes)) {
                    //  followingId가 현재 로그인한 userId인 경우만 필터링
                    const filteredFollowing = followingRes.filter(user => user.followerId === userId);
                    console.log(" 필터링된 팔로잉 리스트:", filteredFollowing);
                    setFollowingCount(followingRes.length);
                } else {
                    console.log(" [오류] 팔로잉 데이터가 배열이 아닙니다.");
                }
            } catch (error) {
                console.error(" 팔로잉 리스트 가져오기 실패:", error);
            }
        };
        userInfo();
    }, []);

    //  로그아웃 함수
    const handleLogout = () => {
        console.log("로그아웃 실행");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
        setIsAuthenticated(false);
        setUserId(null);
        window.location.href = "/account/login";
    };


    // useEffect(() => {
    //     const res = ChatApi.getUserInfo(token)
    //     console.log(res.data)
    //     setUserId(res.data.id)
    // },[])

    // 유저 프로필 수정 모달창 버튼
    const ProfileEditOpenBtn = () => {
        setProfileEditOpen(!ProfileEditOpen);
    };

    // 유저 프로필 수정 저장 버튼
    const ProfileEditBtn = () => {
        setProfilePic(ProfilePic);
    };

    const handleClick = () => {

        // markAlarmsAsRead - 사용자의 읽지 않은 알람을 모두 읽음 상태로 변경하는 기능
        MypageApi.markAlarmsAsRead(userId).then(() => setUnreadCount(0));

        setShowDropdown(!showDropdown);
        navigate(`/mypage/alarm/list/${userId}`);
    };

    return (
        <div className="Sidebar">
            {/* 현재 로그인 유저 프로필 */}
            <div className="UserInfo Shadow">
                <div>
                    <img
                        src="https://picsum.photos/200/200"
                        alt="can't read Img"
                        className="UserProfilePic"
                    />
                    {/* 유저 프로필 사진 변경 모달 */}
                    <Modal
                        isOpen={ProfileEditOpen}
                        ariaHideApp={true}
                        onRequestClose={ProfileEditOpenBtn}
                        className={`Shadow modal`}
                    >
                        <img
                            src="https://picsum.photos/200/200"
                            alt="can't read Img"
                            className="UserProfilePic"
                        />
                        <input type="file" value={ProfilePic} onChange={(e) => setProfilePic(e.target.value)} />

                        <div className="UserId">{userId}</div>
                        <div className="UserLevel">고양이</div>

                        <button onClick={ProfileEditBtn}>저장</button>
                    </Modal>

                    <button onClick={ProfileEditOpenBtn}>✏️</button>
                </div>
                <div className="HeaderNav">
                    <svg onClick={handleClick}
                        className="Alarm"
                        width="20px"
                        height="20px"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M3 5C3 2.23858 5.23858 0 8 0C10.7614 0 13 2.23858 13 5V8L15 10V12H1V10L3 8V5Z"
                            fill="#000000"
                        />
                        <path
                            d="M7.99999 16C6.69378 16 5.58254 15.1652 5.1707 14H10.8293C10.4175 15.1652 9.30621 16 7.99999 16Z"
                            fill="#000000"
                        />
                    </svg>
                    <ul className="AlarmList">
                        {/* 임시 주소 */}
                        <li>
                            <Link to="/게시글" className="Menu">
                                내가 쓴 댓글에 답글이 달렸습니다.
                            </Link>
                        </li>
                        <li>
                            <Link to="/게시글" className="Menu">
                                내가 쓴 댓글에 답글이 달렸습니다.
                            </Link>
                        </li>
                    </ul>
                </div>

                {isAuthenticated && userId ? (
                    <>


                        <div className="UserId">{userId}</div>
                        <div className="UserLevel">고양이</div>
                        {/*  팔로잉 / 팔로워 버튼 추가 */}
                        <div className="UserFollower">
                            <Link to={`/mypage/following/${userId}`} className="FollowButton">
                                팔로잉{followingCount}
                            </Link>
                            &emsp;
                            <Link to={`/mypage/followers/${userId}`} className="FollowButton">
                                팔로워{followerCount}
                            </Link>
                        </div>
                        <Link to={`/mypage/my_story/${userId}`} className="link">
                            내가 쓴 글
                        </Link>
                        <button onClick={handleLogout} className="LogoutButton">로그아웃</button>
                    </>
                ) : (
                    <>
                        {/* 로그아웃 상태일 때 로그인 버튼 표시 */}
                        <Link to="/account/login" className="LoginButton">로그인</Link>
                    </>
                )}

            </div>

            {/* 메뉴 카테고리 */}
            <div className="Category Shadow">
                <ul>
                    {/* 메인 */}
                    <li>
                        <Link to="/" className="link">
                            home
                        </Link>
                        <hr className="ContourLine" />
                    </li>
                    {/* 커뮤니티 목록 */}
                    <li className="link">
                        커뮤니티
                        <ul className="MenuList ">
                            <li>
                                <Link to="/board/bookmarkList" className="Menu">
                                    북마크
                                </Link>
                            </li>
                            <li>
                                <Link to="/board/list?category=1" className="Menu">
                                    여행 계획
                                </Link>
                            </li>
                            <li>
                                <Link to="/board/list?category=2" className="Menu">
                                    여행 기록
                                </Link>
                            </li>
                            <li>
                                <Link to="/mateboard/list" className="Menu">
                                    여행 메이트
                                </Link>
                            </li>
                        </ul>
                        <hr className="ContourLine" />
                    </li>
                    {/* 채팅 목록 */}
                    <li className="link">
                        채팅
                        <ul className="MenuList">
                            <li>
                                <Link to="../chat/List" className="Menu">
                                    채널 목록
                                </Link>
                            </li>
                            <li>
                                <Link to="../chat/create" className="Menu">
                                    채팅방 만들기
                                </Link>
                            </li>
                        </ul>
                        <hr className="ContourLine" />
                    </li>
                    <li className="link">
                        마이페이지
                        <ul className="MenuList">
                            <li>
                                <Link to={`/mypage/my_story/${userId}`} className="Menu">
                                    내가 쓴 글
                                </Link>
                            </li>
                            <li>
                                <Link to={`/mypage/my_reply/${userId}`} className="Menu">
                                    내가 쓴 댓글
                                </Link>
                            </li>
                            <li>
                                <Link to={`/mypage/modify/${userId}`} className="Menu">
                                    회원정보 수정
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to={`/mypage/alarm/settings/${userId}`}
                                    className="Menu"
                                >
                                    알림 설정
                                </Link>
                            </li>
                        </ul>
                        <hr className="ContourLine" />
                    </li>
                </ul>
            </div>
        </div>
    );
};
export default SidebarCom;
