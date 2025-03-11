import { Link } from "react-router-dom";
import "./KakaoSyncCom.css";
import KoKaoLogin from "../../Assets/KakaoTalk_20250220_134840509_01.png"

const KakaoSyncCom=()=>{
    return(
        <>
            <Link to="/KakaoLogin" className="KakaoLoginBtn" >
            <img src={KoKaoLogin} alt="can't read Img" className="KakaoLogo"/>
            </Link>
    </>
    )
};

export default KakaoSyncCom;