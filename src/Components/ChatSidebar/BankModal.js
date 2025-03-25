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
        const res = await ChatApi.updateBank(localStorage.getItem("accessToken"), roomNum, sendType, sendMoney)
        if(res.data === 2){
            await fetchBankList();
            setSendModalOpen(false);
            setSendType("");
            setSendMoney(0);
        }
    }

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
                    <h3>모임통장이 없습니다.</h3>
                    {isHost && (
                        <button className={style.ModalBtn} onClick={() =>  setAddModalOpen(true)}>
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
                <button className={style.ModalBtn} onClick={() => sendMoneyModal("+")}>
                이체하기
                </button>
                {/* 출금 버튼 */}
                { isHost && 
                <button className={style.ModalBtn} onClick={() => sendMoneyModal("-")}>
                출금하기
                </button>

                }
                
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
                <h1 className={style.Goal}>{formatTargetMoney(bankList.target)}</h1>
                <div>게이지바</div>
                <ul className={style.UserTargetAmountList}>
                    {/* 본인 */}
                    <li>
                    <img src={`/images/${filteredUser.profile}.jpg`} className={style.UserPic} alt="" />
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
                    <hr />
                    {/* 멤버 */}
                    {filteredOther && filteredOther.map((user) => {
                        return(
                            <li>
                                <img src={`/images/${user.profile}.jpg`} className={style.UserPic} alt="" />
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
                display: "none",
                }}
                animate={{
                height: !TargetAmountOpen ? "auto" : 0,
                display: !TargetAmountOpen ? "block" : "none"
                }}
            >
                <ul className={style.TransactionHistoryList}>
                {/* 출금 */}
                {bankServiceList && bankServiceList.map((ser) => {
                    return(
                        <li>
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
                    <label>모임통장 이름</label>
                    <input 
                        type="text" 
                        value={bankName} 
                        onChange={(e) => setBankName(e.target.value)} 
                    />
                    <label>목표 금액</label>
                    <input
                        type="number"
                        value={targetMoney}
                        onChange={(e) => setTargetMoney(e.target.value)}
                    />
                    <button onClick={handlleMakeBank}>만들기</button>
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