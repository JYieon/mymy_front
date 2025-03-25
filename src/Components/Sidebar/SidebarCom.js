import { Link } from "react-router-dom";
import style from "./Sidebar.module.css";
import "../../Css/Modal.css";
import { useEffect, useState } from "react";
import ChatApi from "../../api/ChatApi";
import Modal from "react-modal";
import MypageApi from "../../api/MypageApi";
import { useNavigate } from "react-router-dom";
import AuthApi from "../../api/AuthApi";


const SidebarCom = () => {
  const token = localStorage.getItem("accessToken");
  const [userId, setUserId] = useState("");
  const [userNickname, setUserNikcname] = useState("");
  const [userLevel, setUserLevel] = useState("");
  const [ProfileEditOpen, setProfileEditOpen] = useState(false);
  const [ProfilePic, setProfilePic] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [level, setLevel] = useState(1); // 기본 레벨은 1로 설정

  // 숫자 레벨을 글자로 바꿔주는 함수
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
    const userInfo = async () => {

      if (!token) {
        console.log("토큰이 없습니다! 로그아웃 상태입니다.");
        setIsAuthenticated(false);
        setUserId(null);
        return;
      }

      try {
        // 사용자 정보 불러올 때 레벨도 같이 설정
        const res = await ChatApi.getUserInfo(token);
        console.log(" 받아온 사용자 정보:", res.data);
        if (res.data && res.data.id) {
          const fetchedUserId = res.data.id;
          setUserId(fetchedUserId);
          setUserNikcname(res.data.nick);
          setUserLevel(res.data.level)
          setIsAuthenticated(true);
          console.log(" 로그인한 사용자 ID:", fetchedUserId);

          //사용자 레벨 저장
          setLevel(res.data.level);

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

  //     setShowDropdown(!showDropdown);
  //     navigate(`/mypage/alarm/list`);
  // };

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
    navigate(`/mypage/alarm/list`);
  };

  return (

    <div className={style.sidebarContainer}>
      <div className={`Shadow ${style.userInfo}`}>
        {/* 로그인 상태에 따라 달라지는 사이드바 */}
        {isAuthenticated && userId ?
          //로그인 상태일 시 보이는 사이드 바
          (<>
            <div>
              <img
                src="https://picsum.photos/200/200"
                alt="can't read Img"
                className={style.userProfilePic}
              />
            </div>
            <div className={style.headerNav}>
              <div className={style.userNickContainer}>
                <span className={style.userNick}> {userNickname} </span>
                <svg onClick={handleClick}
                  className={style.alramIcon}
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


              </div>
              <div className={style.userLevel}>{getLevelName(level)}</div>

              <ul className={style.alarmList}>
                {/* 임시 주소 */}
                <li>
                  <Link to="/게시글" className={`link ${style.menu}`}>
                    내가 쓴 댓글에 답글이 달렸습니다.
                  </Link>
                </li>
                <li>
                  <Link to="/게시글" className={`link ${style.menu}`}>
                    내가 쓴 댓글에 답글이 달렸습니다.
                  </Link>
                </li>
              </ul>
            </div>
            {/*  팔로잉 / 팔로워 버튼 추가 */}
            <div className={style.userFollowerContainer}>
              <Link to={`/mypage/following`} className={`${style.followBtn} link`}>
                팔로잉{followingCount}
              </Link>
              <Link to={`/mypage/followers`} className={`${style.followBtn} link`}>
                팔로워{followerCount}
              </Link>
            </div>

            {/* 위치상 애매해서 뺐음 다시 넣어도 문제 없음 */}
            {/* <Link to={`/mypage/my_story/${userId}`} className="link">
          내가 쓴 글
        </Link> */}
            <button className={style.profileEditBtn} onClick={ProfileEditOpenBtn}>프로필 수정</button>
            <button onClick={handleLogout} className={style.logoutBtn}>
              로그아웃
            </button>

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
                className={style.userProfilePic}
              />
              <input type="file" value={ProfilePic} onChange={(e) => setProfilePic(e.target.value)} />

              <div className={style.userId}>{userNickname}</div>
              <div className={style.userLevel}>{getLevelName(level)}</div>
              <button onClick={ProfileEditBtn}>저장</button>
            </Modal>
          </>) :
          //비로그인 상태일 시 보이는 사이드 바
          (<div className={style.nonUserContainer}>
            <h3>
              현재 비회원 상태 입니다.
            </h3>
            <h4>
              더 많은 기능들을 원하신다면<br />회원이 되어주세요!
            </h4>
            <Link to="../account/register" className={`link Shadow ${style.registerBtn}`}>회원가입</Link>
            <Link to="../account/login" className={`link ${style.loginBtn}`}>이미 회원이신가요?</Link>
          </div>)}

      </div>

      {/* 메뉴 카테고리 */}
      <div className={`${style.category} Shadow`}>
        <ul>
          {/* 메인 */}
          <li>
            <Link to="/" className="link">
              <span className={style.menuTitle}>home</span>
            </Link>
            <hr />
          </li>
          {/* 커뮤니티 목록 */}
          <li className="link">
            <span className={style.menuTitle}>커뮤니티</span>
            <ul className={style.menuList}>
              {!!token && (<>
                <li>
                  <Link to="/board/bookmarkList" className={`link ${style.menu}`}>
                    북마크
                  </Link>
                </li>
                <li>
                  <Link to="/board/list?category=1" className={`link ${style.menu}`}>
                    여행 계획
                  </Link>
                </li>
              </>)}

              <li>
                <Link to="/board/list?category=2" className={`link ${style.menu}`}>
                  여행 기록
                </Link>
              </li>
              <li>
                <Link to="/mateboard/list" className={`link ${style.menu}`}>
                  여행 메이트
                </Link>
              </li>
            </ul>
            <hr className={style.contourLine} />

          </li>
          {/* 해시태그 게시판 */}
          <li className="link">
            <span className={style.menuTitle}><Link to="/board/hashtags" className={`link ${style.menu}`}>
              해시태그
            </Link></span>
            {!!token && <hr />}
          </li>
          {!!token && (<>
            {/* 채팅 목록 */}
            <li className="link">
              <span className={style.menuTitle}>채팅</span>
              <ul className={style.menuList}>
                <li>
                  <Link to="../chat/List" className={`link ${style.menu}`}>
                    채널 목록
                  </Link>
                </li>
                <li>
                  <Link to="../chat/create" className={`link ${style.menu}`}>
                    채팅방 만들기
                  </Link>
                </li>
              </ul>
              <hr className={style.contourLine} />

            </li>

            {/* 마이페이지 */}
            <li className="link">
              <span className={style.menuTitle}>마이페이지</span>
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
              <hr className={style.contourLine} />
            </li>
          </>)}
        </ul>
      </div>
    </div>
  );
};
export default SidebarCom;
