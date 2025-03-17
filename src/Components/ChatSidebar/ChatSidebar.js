import style from "./ChatSidebar.module.css";
import Modal from "react-modal";
import { distance, motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../Sidebar/Sidebar.css";

import SidebarIcon from "../../Assets/line-3.svg";
import ChttingRoom from "../Auth/ChttingRoom";
import ChatApi from "../../api/ChatApi";


const ChatSidebarCom = () => {
  const { roomNum } = useParams();
  const navigate = useNavigate();
  const [sideOpen, setSideOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [invite, setInvite] = useState("");
  const [JointAccountOpen, setJointAccountOpen] = useState(false);

  // 사이드바 여닫는 버튼
  const sideOpenBtn = () => {
    setSideOpen(!sideOpen);
  };
  // 유저 초대 모달 여는 버튼
  const inviteOpenBtn = () => {
    setInviteOpen(!inviteOpen);
  };
  // 모임 통장 모달 여는 버튼
  const JointAccountOpenBtn=()=>{
    setJointAccountOpen(!JointAccountOpen)
  };

  
  const inviteChatUser = async () => {
    setInviteOpen(!inviteOpen);
    const res = await ChatApi.inviteChatUser(invite, roomNum);
    if (res.data === 1) {
      setInvite("");
    } else {
      alert("존재하지 않는 회원입니다.");
      setInvite("");
    }
  };
  const BeforeBtn=()=>{
    navigate('../chat/list');
  };

  return (
    <>
      <div className="Sidebar">
        <div className="UserInfo Shadow">
          <div>
            <img
              src="https://picsum.photos/200/200"
              alt="can't read Img"
              className="UserProfilePic"
            />
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
          <Link to="user/아이디" className="link UserName">
            TestUser
          </Link>
          <div className="link UserLevel">고양이</div>
          <div className="link UserFollower">팔로잉 팔로워</div>
          <Link to="/mypage/myContent" className="link">
            내가 쓴 글
          </Link>
          <Link to="/account/logout" className="link Logout">
            로그아웃
          </Link>
        </div>
        {/* 메뉴 카테고리 */}
        <div className="Category CategoryShadow">
          <ul>
            {/* 메인 */}
            <li>
              <Link to="/" className="link">
                home
              </Link>
              <hr />
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
          </ul>
        </div>
      </div>
      <div className="ContentSection Shadow">
        <button onClick={BeforeBtn} className={style.BeforeBtn}>
          <img
            src={SidebarIcon}
            alt="can't load image"
            className={style.SidebarIcon}
          />
        </button>     
        {/* 사이드메뉴 오픈 */}
        <button onClick={sideOpenBtn} className={style.ChatSidebarBtn}>
          <img
            src={SidebarIcon}
            alt="can't load image"
            className={style.SidebarIcon}
          />
        </button>
        <ChttingRoom />
      </div>
      <motion.div
        className={`CategoryShadow ${style.ChatSidebar}`}
        initial={{
          display: "none",
        }}
        animate={{
          height: sideOpen ? 700 : 0,
          display: sideOpen ? "flex" : "none",
        }}
      >
        <button className={style.AdjustBtn}>정산 하기</button>
        <Modal
            isOpen={JointAccountOpen}
            ariaHideApp={true}
            onRequestClose={JointAccountOpenBtn}
            className={`Shadow ${style.modal} ${style.JointAccountModal}`}
          >
            <h1 className={style.Title}>모임 통장 만들기</h1>
            <button onClick={inviteChatUser} className={style.InviteBtn}>
              초대하기버튼
            </button>
          </Modal>
        <button className={style.JointAccount} onClick={JointAccountOpenBtn}>모임 통장</button>
        <Modal
            isOpen={inviteOpen}
            ariaHideApp={true}
            onRequestClose={inviteOpenBtn}
            className={`Shadow ${style.modal} ${style.inviteModal}`}
          >
            <h1 className={style.Title}>친구를 초대해요</h1>
            <input
              type="text"
              onChange={(e) => setInvite(e.target.value)}
              value={invite}
            />
            <button onClick={inviteChatUser} className={style.InviteBtn}>
              초대하기버튼
            </button>
          </Modal>

          <button onClick={inviteOpenBtn} className={style.InviteBtn}>
            초대하기
          </button>
        <hr />
        <ul className={style.GrounpMemList}>
          <li className={style.GrounpMem}>바보</li>
          <li className={style.GrounpMem}>바보</li>
          <li className={style.GrounpMem}>바보</li>
        </ul>
      </motion.div>
    </>
  );
};

export default ChatSidebarCom;
