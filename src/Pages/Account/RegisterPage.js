// import { Link } from "react-router-dom";
import KakaoSyncCom from "../../Components/KakaoSync/KakaoSyncCom";
import RegiCom from "../../Components/RegisterForm/RegiCom";

import "../../Css/RegisterPage.css"

const ResisterPage=()=>{
    return(<>
        <div className="Catchphrase">
            회원이 되어<br/>
            더 많은 기능들을<br/>
            이용해보세요.
        </div>
        <RegiCom/>
    </>)
};

export default ResisterPage;