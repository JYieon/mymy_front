import styles from "../../Css/ChatLayout.module.css";

const GroupChatPage=()=>{
    
    return(<div className="LayoutWrap">
        <div className="Header"></div>
        <div className={styles.ChattingList}></div>
        <form className="MyChat">
            <input type="text" className={styles.MyChat} name="Mychat"/>
        </form>
    </div>)
};

export default GroupChatPage