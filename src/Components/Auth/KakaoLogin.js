
import { Navigate, useNavigate } from "react-router-dom";
import Api from "../../api/AuthApi"

const KakaoLogin = () => {

    const navigate = useNavigate();  

    const callKakaoLoginHandler = async () => {

        try{
            const res = await Api.kakaoLogin();
            console.log(res.data)
    
            window.location.href = res.data;

        }catch(error){
            console.log("카카오 로그인 오류 : ", error)
        }
    }


    return(<>
        <button onClick={callKakaoLoginHandler}>카카오 로그인</button>
    </>)
}

export default KakaoLogin