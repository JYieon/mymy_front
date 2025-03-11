// import { Link } from "react-router-dom";
import RegiCom from "../../Components/RegisterForm/RegiCom";

import styles from "../../Css/AccountLayout.module.css"


const ResisterPage=()=>{
    return(<>
        <div className={styles.Catchphrase}>
            회원이 되어<br/>
            더 많은 기능들을<br/>
            이용해보세요.
        </div>
        <RegiCom/>
    </>)
};

export default ResisterPage;