import temPic from "../../Assets/temPic.jpg";
import style from "./ChatSidebar.module.css";
import Modal from "react-modal";
import { motion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import ChatApi from "../../api/ChatApi";

const BankModal = ({JointAccountOpen, JointAccountOpenBtn, TargetAmountOpenBtn, TargetAmountOpen, bankList, isHost, roomNum, fetchBankList, bankServiceList, filteredOther, filteredUser, memberNum}) => {
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [sendModalOpen, setSendModalOpen] = useState(false);
    const [bankName, setBankName] = useState("");
    const [targetMoney, setTargetMoney] = useState("")
    const [sendType, setSendType] = useState("")
    const [sendMoney, setSendMoney] = useState(0)
    const [activeTab, setActiveTab] = useState("target"); 
    const bankMoney = 0
    
    const handlleMakeBank = async () => {
        if(!bankName && !targetMoney){
            alert("모든 사항을 입력해주세요")
            return;
        }

        const res = await ChatApi.makeBank(roomNum, bankName, targetMoney);
        console.log(res)
        if(res.status === 200){
            setBankName("")
            setTargetMoney("")
            setAddModalOpen(false)
            fetchBankList();
        }
    }

    const formatTargetMoney = (amount) => {
        return new Intl.NumberFormat('ko-KR').format(amount);
    };

    const formatPersonMoney = () => {
        const amountPerPerson = bankList?.target / memberNum;
  
        // 포맷을 나누기 후에 적용
        return new Intl.NumberFormat('ko-KR').format(amountPerPerson);
    };

    const sendMoneyModal = (type) => {
        setSendType(type)
        setSendModalOpen(true)
    }

    const handlleUpdateBank = async () => {
        if(sendMoney == 0){
            alert("금액을 입력해주세요.")
            return;
        }
        if (sendType === "-" && sendMoney > bankList.total) {
            alert("현재 잔액보다 출금 금액이 큽니다.");
            return;
        } 
        const res = await ChatApi.updateBank(localStorage.getItem("accessToken"), bankList.bankNum, roomNum, sendType, sendMoney)
        if(res.data === 2){
            await fetchBankList();
            setSendModalOpen(false);
            setSendType("");
            setSendMoney(0);
        }
    }

    // 버튼 클릭 시 상태 변경
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const progressPercentage = Math.min((bankList.total / bankList.target) * 100, 100);


    return(<>
        <Modal
          isOpen={JointAccountOpen}
          ariaHideApp={true}
          onRequestClose={JointAccountOpenBtn}
          className={`Shadow modal ${style.JointAccountModal}`}
        >
            {bankList.length === 0 ? (
                // 모임통장이 없을 경우
                <div className={style.NoAccountArea}>
                    <h1>모임통장이 없습니다.</h1>
                    {isHost && (
                        <button className={style.ModalBtn} onClick={() =>  setAddModalOpen(true)} style={{marginLeft:"110px"}}>
                            모임통장 만들기
                        </button>
                    )}
                </div>
                ) : (
                <>
            {/* 계좌번호 */}
            <div className={style.JointAccountMainArea}>
                <h3>{bankList.bankNum}</h3>
                {/* 현재 잔고 */}
                <h1 className={style.Title}>{bankList.total}</h1>
                {/* 이체 버튼 */}
                <button className={style.ModalBtn} onClick={() => sendMoneyModal("+")} style={{marginRight:"10px"}}>
                이체하기
                </button>
                {/* 출금 버튼 */}
                { isHost && 
                <button className={style.ModalBtn} onClick={() => sendMoneyModal("-")}>
                출금하기
                </button>

                }
                
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                <button 
                    onClick={() => handleTabClick("target")} 
                    style={{ backgroundColor: activeTab === "target" ? "#00284c" : "#ddd" }}
                >
                    목표 금액
                </button>
                <button 
                    onClick={() => handleTabClick("transaction")} 
                    style={{ backgroundColor: activeTab === "transaction" ? "#00284c" : "#ddd" }}
                >
                    거래 내역
                </button>
            </div>
            {/* 목표 금액 */}
            <motion.div
                className={`${style.TargetAmount} ${style.JointAccountDetailedArea}`}
                initial={{
                display: "none"
                }}
                animate={{
                height: activeTab === "target" ? "auto" : 0,
                display: activeTab === "target" ? "block" : "none"
                }}
                style={{width:"60%", marginLight:"10px"}}
            >
                <div>
                {/* 목표 금액 */}
                <h1 style={{marginTop:"30px", marginBottom:"20px"}}>{formatTargetMoney(bankList.target)}</h1>
                {/* <div className={style.ProgressBarContainer}>
                    <div 
                        className={style.ProgressBar} 
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div> */}
                <ul className={style.UserTargetAmountList}>
                    {/* 본인 */}
                    <li>
                    <img src={filteredUser.profile} className={style.UserPic} alt="" />
                    <div className={style.UserAmountWrap}>
                        <span>
                            {(() => {
                                const userBankData = bankServiceList.find(item => item.member === filteredUser.member);
                                console.log(userBankData)
                                return userBankData ? formatTargetMoney(userBankData.personalTotal) : "0";
                            })()}
                        </span>
                        <span className={style.UserTargetAmount}>/ {formatPersonMoney()}</span>
                    </div>
                    </li>
                    <hr style={{width:"80%"}}/>
                    {/* 멤버 */}
                    {filteredOther && filteredOther.map((user) => {
                        return(
                            <li>
                                <img src={user.profile} className={style.UserPic} alt="" />
                                <div className={style.UserAmountWrap}>
                                    <span>
                                    {(() => {
                                        const userBankData = bankServiceList.find(item => item.member === user.member);
                                        return userBankData ? formatTargetMoney(userBankData.personalTotal) : "0";
                                    })()}
                                    </span>
                                    <span className={style.UserTargetAmount}>/ {formatPersonMoney()}</span>
                                </div>
                            </li>
                        )
                        
                    })}
                    
                </ul>
                </div>
            </motion.div>
            {/* 이체 내역 */}
            <motion.div className={`${style.JointAccountDetailedArea}`}
                initial={{
                display: "none"
                }}
                animate={{
                height: activeTab === "transaction" ? "auto" : 0,
                display: activeTab === "transaction" ? "block" : "none"
                }}
                style={{width:"60%"}}
            >
                <ul className={style.TransactionHistoryList} >
                {/* 출금 */}
                {bankServiceList && bankServiceList.map((ser) => {
                    return(
                        <li style={{padding:"0"}}>
                            {/* 거래자 정보 */}
                            <div className={style.UserInfo}>
                            <span>{ser.member}</span>
                            <span className={style.SubInfo}>{ser.date}</span>
                            </div>
                            {/* 거래 상세 내역 */}
                            <div className={style.UserTransactionHistory}>
                            <span className={ser.type === "+" ? style.Deposit : style.Withdrawal}>
                                {ser.type}{ser.money}
                            </span>
                            <span className={style.SubInfo}>
                                {ser.bankTotal}
                            </span>
                            </div>
                        </li>
                    )
                    
                })}
                </ul>
                </motion.div>
                </>
            )}
        </Modal>

        <Modal isOpen={addModalOpen} 
            onRequestClose={() => setAddModalOpen(false)} 
            className={`Shadow modal ${style.JointAccountModal}`}>
            <h1 className={style.Title}>모임통장 만들기</h1>
                <div>
                    <h3 style={{textAlign:"center"}}>모임통장 이름</h3>
                    <input 
                        type="text" 
                        value={bankName} 
                        onChange={(e) => setBankName(e.target.value)} 
                        style={{marginBottom:"0", marginLeft:"35px"}}
                    />
                    <h3 style={{textAlign:"center", marginBottom:"10px"}}>목표 금액</h3>
                    <input
                        type="number"
                        value={targetMoney}
                        onChange={(e) => setTargetMoney(e.target.value)}
                        style={{marginBottom:"10px", marginLeft:"23px", height:"30px"}}
                    />
                    <br/>
                    <button 
                        className={style.ModalBtn} 
                        onClick={handlleMakeBank}
                        style={{marginLeft:"90px", marginTop:"10px"}}    
                    >만들기</button>
                </div>
        </Modal>

        <Modal isOpen={sendModalOpen} 
            onRequestClose={() => setSendModalOpen(false)} 
            className={`Shadow modal ${style.JointAccountModal}`}>
            <h1 className={style.Title}>
                {sendType === "+" ? "이체":"출금" } 하기
            </h1>
                <div>
                    <label>{sendType === "+" ? "이체":"출금" } 금액</label>
                    <input 
                        type="number" 
                        value={sendMoney} 
                        onChange={(e) => setSendMoney(e.target.value)} 
                    />
                    <button onClick={handlleUpdateBank}>
                        {sendType === "+" ? "이체":"출금" } 하기
                    </button>
                </div>
        </Modal>
    </>)
}

export default BankModal