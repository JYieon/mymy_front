import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import Api from "../../api/AuthApi";

const KakaoCallback = (props) => {

    const navigate = useNavigate();
    const code = new URL(window.location.href).searchParams.get("code");

    //인가코드 백으로 보내는 코드
    useEffect(() => {
        const kakaoLogin = async () => {
            await Api.kakaoCallback(code)
            .then((res) => { //백에서 완료후 우리사이트 전용 토큰 넘겨주는게 성공했다면
            console.log(res);
            localStorage.setItem("accessToken", res.data.accessToken);
            //로그인이 성공하면 이동할 페이지
            navigate("/");
        });
        };
        kakaoLogin();
    }, [props.history]);

    return(
        <div className="KakaoCallback">
            <div className="notice">
                <p>로그인 중입니다.</p>
                <p>잠시만 기다려주세요.</p>
                <div className="spinner"></div>
            </div>
        </div>
    )
}

export default KakaoCallback