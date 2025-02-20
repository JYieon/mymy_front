// import { Link } from "react-router-dom";
import KakaoSyncCom from "../../Components/KakaoSync/KakaoSyncCom";
import RegiCon from "../../Components/RegisterForm/RegiCon";
import "../../Css/RegisterPage.css"

const ResisterPage=()=>{
    return(<>
        <div className="Catchphrase">
            회원이 되어<br/>
            더 많은 기능들을<br/>
            이용해보세요.
        </div>

        <RegiCon/>
        <KakaoSyncCom/>
    </>)
};

export default ResisterPage;