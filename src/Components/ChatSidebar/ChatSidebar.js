import style from "./ChatSidebar.module.css";
import Modal from "react-modal";
import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../Sidebar/Sidebar.css";
import SidebarIcon from "../../Assets/line-3.svg";
import ChttingRoom from "../Auth/ChttingRoom";
import ChatApi from "../../api/ChatApi";
import "../../Css/Modal.css";
import AdjustmentListModal from "./AdjustmentListModal"
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
  const [VerfiyInputOpen, setVerfiyInputOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [selectedBankCode, setSelectedBankCode] = useState("");
  const [bankNum, setBankNum] = useState("");
  const [bankStatus, setBankStatus] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [memberNum, setMemberNum] = useState(0);
  const [messages, setMessages] = useState([]);
  const [chatOtherInfo, setChatOtherInfo] = useState([]);
  const [chatUserInfo, setChatUserInfo] = useState([]);
  const [chatInfo, setChatInfo] = useState([]);
  const [adList, setAdList] = useState([]);
  const [bankList, setBankList] = useState([]);
  
  const token = localStorage.getItem("accessToken");
  const bankCodeList = [
    { code: "004", name: "KB국민은행" },
    { code: "023", name: "SC제일은행" },
    { code: "039", name: "경남은행" },
    { code: "034", name: "광주은행" },
    { code: "003", name: "기업은행" },
    { code: "011", name: "농협" },
    { code: "031", name: "대구은행" },
    { code: "032", name: "부산은행" },
    { code: "002", name: "산업은행" },
    { code: "007", name: "수협" },
    { code: "088", name: "신한은행" },
    { code: "048", name: "신협" },
    { code: "005", name: "외환은행" },
    { code: "020", name: "우리은행" },
    { code: "071", name: "우체국" },
    { code: "037", name: "전북은행" },
    { code: "035", name: "제주은행" },
    { code: "012", name: "축협" },
    { code: "081", name: "하나은행(서울은행)" },
    { code: "027", name: "한국씨티은행(한미은행)" },
    { code: "089", name: "K뱅크" },
    { code: "090", name: "카카오뱅크" },
  ];

  // 정산 추가 함수 (useCallback 적용)
  const addAdjustment = useCallback(async (amount, toMember) => {
      const res = await ChatApi.addAdjustment(amount, toMember, chatInfo.roomNum, memberNum);
      if (res.data === 1) {
        console.log("정산 추가 성공");
      } else {
        alert("채팅방 멤버가 아닙니다.");
    }
  }, [chatInfo.roomNum, memberNum]); // 의존성 관리

  const sendAdjustment = async (adNum, adNumMember) => {
    const res = await ChatApi.sendAdjustment(token, adNum, adNumMember)
  }
  

  const filteredOther = useMemo(() => {
      return chatUserInfo.filter(user => user.member !== userId);
  }, [chatUserInfo, userId]);

  const filteredUser = useMemo(() => {
      return chatUserInfo.find(user => user.member === userId);
  }, [chatUserInfo, userId]);

  useEffect(() => {
      if (filteredUser?.role === "방장") {
          setIsHost(true);
      }
  }, [filteredUser]);

  useEffect(() => {
    const getChatRoom = async () => {
          try {
            const res = await ChatApi.getChatMessages(roomNum);
            console.log(res.data);
            setMemberNum(res.data.member.length);
            setChatUserInfo(res.data.member);
            // console.log("msg", res.data.member);
            
            if (res.data.messages.length > 0) {
              const newMessages = res.data.messages.map((element) => ({
                id: element.member, 
                msg: element.msg,
                type: element.type,
                nick: element.nick,
                profile: element.profile
              }));
              if (JSON.stringify(messages) !== JSON.stringify(newMessages)) {
                setMessages(newMessages);
            }
            } else if (messages.length > 0) {
              setMessages([]);
            }
            setChatInfo(res.data.chat);
          } catch (error) {
            console.log(error);
          }
    
          // setTimeout(() => {
          //   scrollToBottom();
          // }, 100);
        };
        getChatRoom();

    
  }, [roomNum]);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        
        const res = await ChatApi.getUserInfo(token);
        setUserId(res.data.id);
        if(res.data.bank.length > 0){
          setBankStatus(true) //통장 본인확인 완료
          console.log("통장본인확인 완료")
        }
        
        // const chatRes = await ChatApi.getChatMessages(roomNum);
        // setChatUserInfo(chatRes.data.member.filter(user => user.member !== res.data.id));
      } catch (error) {
        console.log(error);
      }
    };
    getUserInfo();
  }, [token])

  useEffect(() => {    
    if (!roomNum) return;
    fetchAdjustmentList(); // 초기 정산 리스트 불러오기
  }, [roomNum]);

  const fetchAdjustmentList = async () => {
    try {
        const res = await ChatApi.getAdjustmentList(roomNum);
        if (res.data !== null) {
            setAdList(res.data);
        }
    } catch (err) {
        console.log(err);
    }
};


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

  // 본인 확인 여부 체크 후 실행할 함수
const VerfiyBeforeAction = (action) => {
  if (bankStatus) {
    if(action === "JointAccount"){
      JointAccountOpenBtn();
    }else if(action === "Adjustment"){
      AdjustmentOpenBtn();
    }
  } else {
    VerfiyOpenBtn(); // 본인 확인 모달 열기
  }
};

  // 모임 통장 모달 여는 버튼
  const JointAccountOpenBtn = () => {
    console.log("모임통장")
    setJointAccountOpen(!JointAccountOpen);
  };

  //모임 통장 목표 금액 여는 버튼
  const TargetAmountOpenBtn = () => {
    SetTargetAmountOpen(!TargetAmountOpen);
  };

  // 정산 모달 여는 버튼
  const AdjustmentOpenBtn = async () => {
    console.log("정산하기")
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
    // setJointAccountOpen(!JointAccountOpen);
    setVerfiyInputOpen(!VerfiyInputOpen);
  };

  const VerfiyUserCheck = async () => {
    const res = await ChatApi.checkUserBank(token, selectedBankCode, bankNum);
    console.log(res);
  }

  const BeforeBtn = () => {
    navigate("../chat/list");
  };

  

  const endChat = async () => {
    const isConfirmed = window.confirm("채팅방을 정말 나가시겠습니까?");
    if (!isConfirmed) return; // 사용자가 취소하면 종료
  
    try {
      const res = await ChatApi.endChat(roomNum, token);
      console.log("delete", res);
      if (res.status === 200) {
        window.location.href = "/chat/list"; // 채팅방 목록으로 이동
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
        <ChttingRoom chatInfo={chatInfo} messages={messages} chatUser={chatOtherInfo} memberNum={memberNum}/>
        
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
        <button className={style.AdjustBtn} onClick={() => VerfiyBeforeAction("Adjustment")}>
          정산 하기
        </button>
        {/* 정산 모달 */}
        <AdjustmentListModal
          isOpen={AdjustmentOpen}
          ariaHideApp={true}
          onRequestClose={AdjustmentOpenBtn}
          adList={adList}
          sendAdjustment={sendAdjustment}
          addAdjustment={addAdjustment}
          isHost={isHost}
          chatUserInfo={chatUserInfo}
          roomNum={roomNum}
          filteredUser={filteredUser}
          fetchAdjustmentList={fetchAdjustmentList}
        >
        </AdjustmentListModal>

        {/* 모임통장 */}
        <button className={style.JointAccount} onClick={() => VerfiyBeforeAction("JointAccount")}>
          모임 통장
        </button>
        {/* 본인 확인 모달 */}
        <Modal
          isOpen={VerfiyOpen}
          ariaHideApp={true}
          onRequestClose={VerfiyOpenBtn}
          className={`Shadow modal ${style.JointAccountModal}`}
        >
          <h1 className={style.Title}>통장 본인확인</h1>
          <h3 className={style.SubTitle}>
            사용자의 계좌 이용을 위해
            <br />
            통장 본인확인은 필수입니다.
          </h3>
          <button onClick={VerfiyUser} className={style.ModalBtn}>
            본인확인 하기
          </button>
        </Modal>
        {/* 본인 확인 입력 모달 */}
        <Modal
          isOpen={VerfiyInputOpen}
          ariaHideApp={true}
          className={`Shadow modal ${style.JointAccountModal}`}
        >
          <h1 className={style.Title}>통장 본인확인</h1>
          <input type="text" placeholder="계좌번호" onChange={(e) => setBankNum(e.target.value)}></input>
          <select value={selectedBankCode} onChange={(e) => setSelectedBankCode(e.target.value)}>
            <option value="">은행 선택</option>
            {bankCodeList.map((bank) => (
              <option key={bank.code} value={bank.code}>
                {bank.name}
              </option>
            ))}
          </select>
          <button onClick={VerfiyUserCheck} className={style.ModalBtn}>
            본인확인 하기
          </button>
          <h3 className={style.SubTitle}>
            본인확인이 계속 실패한다면
            <br />
            저장된 이름 정보가 실명인지 확인하세요.
          </h3>
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
        {isHost && (
          <button onClick={inviteOpenBtn} className={style.ModalBtn}>
            초대하기
          </button>
        )}
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
          {filteredOther.map((user)=>(
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
