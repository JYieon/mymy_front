import { Link } from "react-router-dom";
import style from "./Sidebar.module.css";
import "../../Css/Modal.css";
import { useEffect, useState } from "react";
import ChatApi from "../../api/ChatApi";
import Modal from "react-modal";
import AuthApi from "../../api/AuthApi";

const SidebarCom = () => {
  const token = localStorage.getItem("accessToken");
  const [userId, setUserId] = useState("");
  const [userNickname, setUserNikcname] = useState("");
  const [userLevel, setUserLevel] = useState("");
  const [ProfileEditOpen, setProfileEditOpen] = useState(false);
  const [ProfilePic, setProfilePic] = useState("");

  useEffect(() => {
    const userInfo = async () => {
      try {
        const res = await ChatApi.getUserInfo(token);
        console.log(res.data)

        if (res.data) {
          setUserId(res.data.id || "unknownId");
          setUserNikcname(res.data.nick || "알 수 없는 사용자");
          setUserLevel(res.data.level || "생각하는 냥이")
        }
      } catch (error) {
        console.log("사용자 정보 가져오기 실패 : ", error);
      }
    };
    userInfo();
  }, [token]);

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

    <div className={style.sidebarContainer}>
      <div className={`Shadow ${style.userInfo}`}>
        {/* 로그인 상태에 따라 달라지는 사이드바 */}
        {!!token ?
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
                <svg
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
              <div className={style.userLevel}>{userLevel}</div>
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
              <Link to={`/mypage/following/${userId}`} className={`${style.followBtn} link`}>
                팔로잉{" "}
              </Link>
              <Link to={`/mypage/followers/${userId}`} className={`${style.followBtn} link`}>
                팔로워
              </Link>
            </div>
            {/* 위치상 애매해서 뺐음 다시 넣어도 문제 없음 */}
            {/* <Link to={`/mypage/my_story/${userId}`} className="link">
          내가 쓴 글
        </Link> */}
            <button className={style.profileEditBtn} onClick={ProfileEditOpenBtn}>프로필 수정</button>
            <button onClick={onClickLogout} className={style.logoutBtn}>
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
              <div className={style.userLevel}>{ }</div>
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
            {!!token && <hr className={style.contourLine} />}

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
                  <Link to={`/mypage/my_story/${userId}`} className={`link ${style.menu}`}>
                    내가 쓴 글
                  </Link>
                </li>
                <li>
                  <Link to={`/mypage/my_reply/${userId}`} className={`link ${style.menu}`}>
                    내가 쓴 댓글
                  </Link>
                </li>
                <li>
                  <Link to={`/mypage/modify/${userId}`} className={`link ${style.menu}`}>
                    회원정보 수정
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/mypage/alarm/settings/${userId}`}
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
