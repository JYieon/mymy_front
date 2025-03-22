import style from "./ChatSidebar.module.css";
import Modal from "react-modal";
import { distance, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
// import sidebarStyle from "../Sidebar/Sidebar.module.css";
import SidebarIcon from "../../Assets/line-3.svg";
import ChttingRoom from "../Auth/ChttingRoom";
import ChatApi from "../../api/ChatApi";
import "../../Css/Modal.css";

import temPic from "../../Assets/temPic.jpg";
import SidebarCom from "../Sidebar/SidebarCom";
const ChatSidebarCom = () => {
  const { roomNum } = useParams();
  const navigate = useNavigate();
  const [sideOpen, setSideOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [invite, setInvite] = useState("");
  const [JointAccountOpen, setJointAccountOpen] = useState(false);
  const [AdjustmentOpen, setAdjustmentOpen] = useState(false);
  const [VerfiyOpen, setVerfiyOpen] = useState(false);
  const [chatUserInfo, setChatUserInfo] = useState([]);
  const [userId, setUserId] = useState("");
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        
        const res = await ChatApi.getUserInfo(token);
        setUserId(res.data.id);
        
        const chatRes = await ChatApi.getChatMessages(roomNum);
        setChatUserInfo(chatRes.data.member.filter(user => user.member !== res.data.id));
      } catch (error) {
        console.log(error);
      }
    };
    getUserInfo();
  }, []);

  const [TargetAmountOpen, SetTargetAmountOpen] = useState(false);

  

  // 사이드바 여닫는 버튼
  const sideOpenBtn = () => {
    setSideOpen(!sideOpen);
  };

  // 유저 초대 모달 여는 버튼
  const inviteOpenBtn = () => {
    setInviteOpen(!inviteOpen);
  };
  //본인 확인 모달 여는 버튼

  const VerfiyOpenBtn = () => {
    setVerfiyOpen(!VerfiyOpen);
  };

  // 모임 통장 모달 여는 버튼
  const JointAccountOpenBtn = () => {
    setJointAccountOpen(!JointAccountOpen);
  };

  //모임 통장 목표 금액 여는 버튼
  const TargetAmountOpenBtn = () => {
    SetTargetAmountOpen(!TargetAmountOpen);
  };

  // 정산 모달 여는 버튼
  const AdjustmentOpenBtn = () => {
    setAdjustmentOpen(!AdjustmentOpen);
  };

  const inviteChatUser = async () => {
    setInviteOpen(!inviteOpen);
    const res = await ChatApi.inviteChatUser(token, invite, roomNum);
    if (res.data === 1) {
      setInvite("");
    } else {
      alert("존재하지 않는 회원입니다.");
      setInvite("");
    }
  };

  const VerfiyUser = () => {
    setVerfiyOpen(!VerfiyOpen);
    setJointAccountOpen(!JointAccountOpen);
  };

  const BeforeBtn = () => {
    navigate("../chat/list");
  };

  const endChat = async () => {
    const isConfirmed = window.confirm("채팅방을 정말 나가시겠습니까?");
    if (!isConfirmed) return; // 사용자가 취소하면 종료
  
    try {
      const res = await ChatApi.endChat(roomNum, localStorage.getItem("accessToken"));
      console.log("delete", res);
      if (res.status === 200) {
        window.location.href = "/chatlist"; // 채팅방 목록으로 이동
      } else {
        alert("채팅방 나가기 실패");
      }
    } catch (error) {
      console.error("채팅방 나가기 오류:", error);
      alert("서버 오류로 인해 채팅방을 나갈 수 없습니다.");
    }
  };

  return (
    <>
      <SidebarCom/>
   
      {/* 콘텐츠 영역 */}
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
        {/* 채팅방 영역 */}
        <ChttingRoom />
      </div>
      {/* 사이드 바 */}
      <motion.div
        className={`CategoryShadow ${style.ChatSidebar}`}
        initial={{
          display: "none",
        }}
        animate={{
          height: sideOpen ? 700 : 0,
          opacity: sideOpen ? "100%": 0,
          display: sideOpen ? "flex" : "none",
        }}
      >
        <button className={style.AdjustBtn} onClick={AdjustmentOpenBtn}>
          정산 하기
        </button>
        {/* 정산 모달 */}
        <Modal
          isOpen={AdjustmentOpen}
          ariaHideApp={true}
          onRequestClose={AdjustmentOpenBtn}
          className={`Shadow modal ${style.JointAccountModal}`}
        >
          <h1 className={style.Title}>정산해요</h1>
          <h2></h2>
          <h3 className={style.SubTitle}> 정산 금액 입력</h3>
          <input
            type="text"
            onChange={(e) => setInvite(e.target.value)}
            value={invite}
          />
          <button onClick={inviteChatUser} className={style.ModalBtn}>
            초대하기버튼
          </button>
        </Modal>
        <button className={style.JointAccount} onClick={VerfiyOpenBtn}>
          모임 통장
        </button>
        {/* 모임통장 본인 확인 모달 */}
        <Modal
          isOpen={VerfiyOpen}
          ariaHideApp={true}
          onRequestClose={VerfiyOpenBtn}
          className={`Shadow modal ${style.JointAccountModal}`}
        >
          <h1 className={style.Title}>모임 통장 만들기</h1>
          <h3 className={style.SubTitle}>
            다함께 즐거운 여행이 되기 위해
            <br />
            모임통장을 만들어 관리해요!
          </h3>
          <button onClick={VerfiyUser} className={style.ModalBtn}>
            통장 본인확인
          </button>
        </Modal>
        {/* 모임통장 거래 모달 */}
        <Modal
          isOpen={JointAccountOpen}
          ariaHideApp={true}
          onRequestClose={JointAccountOpenBtn}
          className={`Shadow modal ${style.JointAccountModal}`}
        >
          {/* 계좌번호 */}
          <div className={style.JointAccountMainArea}>
            <h3>123-45678-123</h3>
            {/* 현재 잔고 */}
            <h1 className={style.Title}>150,000</h1>
            {/* 이체 버튼 */}
            <button onClick={inviteChatUser} className={style.ModalBtn}>
              이체하기
            </button>
            {/* 출금 버튼 */}
            <button onClick={inviteChatUser} className={style.ModalBtn}>
              출금하기
            </button>
          </div>
          <button onClick={TargetAmountOpenBtn}>목표 금액</button>
          {/* <button onClick={TargetAmountOpenBtn}>거래 내역</button> */}
          {/* 이체 내역 및 목표 금액 */}
          {/* 목표 금액 */}
          <motion.div
            className={`${style.TargetAmount} ${style.JointAccountDetailedArea}`}
            initial={{
              display: "none",
            }}
            animate={{
              height: TargetAmountOpen ? "auto" : 0,
              display: TargetAmountOpen ? "block" : "none"
            }}
          >
            <div>
              {/* 목표 금액 */}
              <h1 className={style.Goal}>1,000,000</h1>
              <div>게이지바</div>
              <ul className={style.UserTargetAmountList}>
                {/* 방장 */}
                <li>
                  <img src={temPic} className={style.MasterUserPic} alt="" />
                  <div className={style.UserAmountWrap}>
                    <span>100,000 </span>
                    <span className={style.UserTargetAmount}>/ 250,000</span>
                  </div>
                </li>
                <hr />
                {/* 일반 멤버 */}
                <li>
                  <img src={temPic} className={style.UserPic} alt="" />
                  <div className={style.UserAmountWrap}>
                    <span>250,000 </span>
                    <span className={style.UserTargetAmount}>/ 250,000</span>
                  </div>
                </li>
                <li>
                  <img src={temPic} className={style.UserPic} alt="" />
                  <div className={style.UserAmountWrap}>
                    <span>0 </span>
                    <span className={style.UserTargetAmount}>/ 250,000</span>
                  </div>
                </li>
                <li>
                  <img src={temPic} className={style.UserPic} alt="" />
                  <div className={style.UserAmountWrap}>
                    <span>0 </span>
                    <span className={style.UserTargetAmount}>/ 250,000</span>
                  </div>
                </li>
                <li>
                  <img src={temPic} className={style.UserPic} alt="" />
                  <div className={style.UserAmountWrap}>
                    <span>0 </span>
                    <span className={style.UserTargetAmount}>/ 250,000</span>
                  </div>
                </li>
              </ul>
            </div>
          </motion.div>
          {/* 이체 내역 */}
          <motion.div className={`${style.JointAccountDetailedArea}`}
            initial={{
              display: "none",
            }}
            animate={{
              height: !TargetAmountOpen ? "auto" : 0,
              display: !TargetAmountOpen ? "block" : "none"
            }}
          >
            <ul className={style.TransactionHistoryList}>
              {/* 방장 출금 */}
              <li>
                {/* 거래자 정보 */}
                <div className={style.UserInfo}>
                  <span>방장</span>
                  <span className={style.SubInfo}>02/11 11:30</span>
                </div>
                {/* 거래 상세 내역 */}
                <div className={style.UserTransactionHistory}>
                  <span className={style.Withdrawal}>-200,000</span>
                  <span className={style.SubInfo}>50,000</span>
                </div>
              </li>
              {/* 김마이 입금*/}
              <li>
                {/* 거래자 정보 */}
                <div className={style.UserInfo}>
                  {/* 거래자 이름 */}
                  <span>김마이</span>
                  {/* 거래 시간 */}
                  <span className={style.SubInfo}>02/11 9:02</span>
                </div>
                {/* 거래 상세 내역 */}
                <div className={style.UserTransactionHistory}>
                  <span className={style.Deposit}>-150,000</span>
                  <span className={style.SubInfo}>250,000</span>
                </div>
              </li>
              {/* 이마희 입금 */}
              <li>
                {/* 거래자 정보 */}
                <div className={style.UserInfo}>
                  {/* 거래자 이름 */}
                  <span>이마희</span>
                  {/* 거래 시간 */}
                  <span className={style.SubInfo}>02/10 15:22</span>
                </div>
                {/* 거래 상세 내역 */}
                <div className={style.UserTransactionHistory}>
                  <span className={style.Deposit}>+150,000</span>
                  <span className={style.SubInfo}>100,000</span>
                </div>
              </li>
            </ul>
          </motion.div>
        </Modal>
        <button onClick={inviteOpenBtn} className={style.ModalBtn}>
          초대하기
        </button>
        {/* 초대 모달 */}
        <Modal
          isOpen={inviteOpen}
          ariaHideApp={true}
          onRequestClose={inviteOpenBtn}
          className={`Shadow modal ${style.inviteModal}`}
        >
          <h1 className={style.Title}>친구를 초대해요</h1>
          <input
            type="text"
            onChange={(e) => setInvite(e.target.value)}
            value={invite}
          />
          <button onClick={inviteChatUser} className={style.ModalBtn}>
            초대하기버튼
          </button>
        </Modal>
        <hr />
        <ul className={style.GrounpMemList}>
          {chatUserInfo.map((user)=>(
            <li className={style.GrounpMem}>
            <img src={`/images/${user.profile}.jpg`} style={{ width: "30px", borderRadius: "50px" }} />
            {user.nick}
            </li>
          ))}

          {/* <li className={style.GrounpMem}>바보</li>
          <li className={style.GrounpMem}>바보</li>
          <li className={style.GrounpMem}>바보</li> */}
        </ul>
        <button onClick={endChat}>채팅방 나가기</button>
      </motion.div>
    </>
  );
};

export default ChatSidebarCom;
