import styles from "../../Css/ChatLayout.module.css";

const NewChatPage=()=>{
    return(
    <div className="LayoutWrap">
        <h1 className={styles.Title}>채팅방 만들기</h1>
        <hr/>
        <form className={styles.form}>
        <h2 className={styles.Subtitle}>채팅방 이름</h2>
            <input type="text" name="GroupChatName" className={styles.GroupChatName}/>
            <ul>
                <li className={styles.Pre}>채팅방 생성 후 멤버를 초대할 수 있어요.</li>
                <li className={styles.Pre}>방장은 총무를 지정해서 함께 모임통장과 정산을 관리할 수 있어요.</li>
                <li className={styles.Pre}>여행자메이트 게시판에서 마음이 맞는 친구를 찾아보아요!</li>
            </ul>
            <h2 className={styles.Subtitle}>여행 메이트들과 즐거운 여행 되세요!</h2>
            
            <input type="submit" value="채팅방 생성"/>
        </form>
    </div>);
};

export default NewChatPage;