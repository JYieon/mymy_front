import { Link} from "react-router-dom";
import "./Sidebar.css";
import "../../Css/Modal.css";
import { useEffect, useState } from "react";
import ChatApi from "../../api/ChatApi";
import Modal from "react-modal";

const SidebarCom = () => {
  const token = localStorage.getItem("accessToken");
  const [userId, setUserId] = useState("");
  const [ProfileEditOpen, setProfileEditOpen] = useState(false);
  const [ProfilePic, setProfilePic] = useState("");

  useEffect(() => {
    const userInfo = async () => {
      try {
        const res = await ChatApi.getUserInfo(token);
        if (res.data) {
          setUserId(res.data.id || "");
        }
      } catch (error) {
        console.log("사용자 정보 가져오기 실패 : ", error);
      }
    };
    userInfo();
  }, [token]);

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
          <input type="file" value={ProfilePic} onChange={(e) => setProfilePic(e.target.value)}/>

          <div className="UserId">{userId}</div>
          <div className="UserLevel">고양이</div>

          <button onClick={ProfileEditBtn}>저장</button>
        </Modal>

        <button onClick={ProfileEditOpenBtn}>✏️</button>
      </div>
      <div className="HeaderNav">
        <svg
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
      <div className="UserId">{userId}</div>
      <div className="UserLevel">고양이</div>
      {/*  팔로잉 / 팔로워 버튼 추가 */}
      <div className="UserFollower">
        <Link to={`/mypage/following/${userId}`} className="FollowButton">
          팔로잉{" "}
        </Link>
        <Link to={`/mypage/followers/${userId}`} className="FollowButton">
          팔로워
        </Link>
      </div>
      <Link to={`/mypage/my_story/${userId}`} className="link">
        내가 쓴 글
      </Link>
      <Link to="/account/logout" className="link Logout">
        로그아웃
      </Link>
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
