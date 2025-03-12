import { Link } from "react-router-dom";
import "./KakaoSyncCom.css";
import KoKaoLogin from "../../Assets/KakaoTalk_20250220_134840509_01.png"
import AuthApi from "../../api/AuthApi";

const KakaoSyncCom=()=>{

    const callKakaoLoginHandler = async () => {

        try{
            const res = await AuthApi.kakaoLogin();
            console.log(res.data)
    
            window.location.href = res.data;

        }catch(error){
            console.log("카카오 로그인 오류 : ", error)
        }
    }

    return(
        <>
            <img 
                src={KoKaoLogin} alt="can't read Img" className="KakaoLogo" 
                onClick={callKakaoLoginHandler}
            />
    </>
    )
};

export default KakaoSyncCom;