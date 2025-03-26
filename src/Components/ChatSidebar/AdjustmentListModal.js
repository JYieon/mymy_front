import { useEffect, useState } from "react";
import style from "./ChatSidebar.module.css";
import Modal from "react-modal";
import { RiArrowLeftWideLine } from "react-icons/ri";
import ChatApi from "../../api/ChatApi";

const AdjustmentListModal = ({isOpen, onRequestClose, adList, sendAdjustment, addAdjustment, isHost, chatUserInfo, roomNum, filteredUser, fetchAdjustmentList}) => {
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [sendModalOpen, setSendModalOpen] = useState(false);
    const [amount, setAmount] = useState(0);
    const [toMember, setToMember] = useState("");
    const [adjustment, setAdjustment] = useState("");
    const [chatOtherInfo, setChatOtherInfo] = useState([]);
    const [adService, setAdService] = useState([]);


    console.log("", adList)

    const handleAddAdjustment = async () => {
        if(!amount && !toMember){
            alert("모든 사항을 입력해주세요");
            return;
        }
        await addAdjustment(amount, toMember)
        await fetchAdjustmentList(); // 정산 리스트 다시 불러오기
        setAddModalOpen(false)
        setAmount("")
        setToMember("")
    }

    const onSelectAdjustment = async (ad) => {
        setSendModalOpen(true)
        onRequestClose();

        const res = await ChatApi.getAdjustmentServiceList(ad.settleNum);
        // console.log(res.data)
        setAdService(res.data)
       
        const matchedUser = chatUserInfo.filter(user => user.nick === ad.toMember);
        // console.log(matchedUser[0].profile)
        setAdjustment({
            ...ad,
            profile: matchedUser ? matchedUser[0].profile : null
        })
        // console.log("profile", addAdjustment)
        setChatOtherInfo(chatUserInfo.filter(user => user.nick !== ad.toMember))
        // console.log("me", filteredUser?.nick)
    }

    const handleSendAdjustment = async (adNum, adMemberNum) => {
        await sendAdjustment(adNum, adMemberNum)
        await fetchAdjustmentList(); // 정산 리스트 다시 불러오기
        setSendModalOpen(false)
    }


    return (
        <>        
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} 
          className={`Shadow modal ${style.JointAccountModal}`}>
            <h1 className={style.Title}>정산해요</h1>
                {adList.length === 0 ? (
                    <div>
                    <p>정산 내역이 없습니다.</p>
                        {/* {isHost && <button 
                            className={style.ModalBtn}
                            onClick={() => setAddModalOpen(true)}    
                        >
                        정산 추가
                        </button>} */}
                        
                    </div>

                ) : (
                    <ul>
                        {adList.map((ad) => (
                            <li key={ad.settleNum} onClick={() => onSelectAdjustment(ad)} className={style.AdList}>
                                {ad.toMember} 님에게 {ad.money}원씩
                            </li>
                        ))}
                    </ul>
                )}

                {isHost && <button 
                className={style.ModalBtn}
                onClick={() => setAddModalOpen(true)}
            >
            정산 추가
            </button>}
                
        </Modal>

        <Modal 
            isOpen={sendModalOpen} 
            onRequestClose={() => setSendModalOpen(false)} 
            className={`Shadow modal ${style.JointAccountModal}`}
            >
            <h1 className={style.Title}>정산해요</h1>
            <div className={style.AdjustmentContainer}>
                <div className={style.TopSection}>
                    <div className={style.MemberContainer}>
                        <img src={`/images/${adjustment.profile}.jpg`} className={style.ProfileImage} />
                        <span className={style.Nickname}>{adjustment.toMember}</span>
                    </div>
                    <div className={style.AdjustmentAmount}>
                        <RiArrowLeftWideLine className={style.Arrow}/>
                        <RiArrowLeftWideLine className={style.Arrow}/>
                        <RiArrowLeftWideLine className={style.Arrow}/>
                        <span className={style.Money}>{adjustment.money} 원</span>
                    </div>
                </div>
                <div className={style.AdjustmentMembers}>
                {chatOtherInfo && chatOtherInfo.map((member) => {
                    const isSettled = adService.some((adSer) => adSer.sender === member.nick);
                    return (
                        <div key={member.nick} className={style.MemberContainer}>
                            <img src={`/images/${member.profile}.jpg`} className={`${style.ProfileImageMember} ${isSettled ? style.BorderGreen : style.BorderRed}`}></img>
                            <span className={style.NicknameMember}>{member.nick}</span>
                        </div>
                    )
                })}
                </div>
            </div>
            <button 
                className={style.ModalBtn} 
                onClick={() => handleSendAdjustment(adjustment.settleNum, adjustment.check)}
                disabled={adService.some((adSer) => adSer.sender === filteredUser?.nick)}
            >
                {adService.some((adSer) => adSer.sender === filteredUser?.nick) ? "정산 완료" : "정산하기"}
            </button>
            </Modal>

        <Modal 
            isOpen={addModalOpen} 
            onRequestClose={() => setAddModalOpen(false)} 
            className={`Shadow modal ${style.JointAccountModal}`}
            >
            <h1 className={style.Title}>새 정산 추가</h1>
            <div>
                <label>정산 금액</label>
                <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)} 
                />
                <label>받는 사람</label>
                <input
                    type="text"
                    value={toMember}
                    onChange={(e) => setToMember(e.target.value)}
                />
            </div>
            <button className={style.ModalBtn} onClick={handleAddAdjustment}>
                추가
            </button>
            </Modal>
        </>

        
    )
}

export default AdjustmentListModal;