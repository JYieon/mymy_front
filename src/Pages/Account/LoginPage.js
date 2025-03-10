import { Link, useNavigate } from "react-router-dom";
import "../../Css/LoginPage.css"
import KakaoSyncCom from "../..//Components/KakaoSync/KakaoSyncCom";
import { useEffect, useState } from "react";
import AuthApi from "../../api/AuthApi";
import ChatApi from "../../api/ChatApi";

const LoginPage=()=>{
    const [id, setId] = useState("");
    const [pwd, setPwd] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    //로그인 요청 처리
    const handleLogin = async (e) => {
        e.preventDefault();
    
        console.log("click login");
        console.log("ID : ", id);
        console.log("PWD : ", pwd);
    
        try {
            const res = await AuthApi.login(id, pwd);

            console.log(res);
    
            if (res.status === 200 && res.data) {
                // 로그인 성공 후, 토큰 저장
                console.log("로그인 성공");
                localStorage.setItem("accessToken", res.data.accessToken);
                navigate("/");
            } 
    
        } catch (err) {
            setError("로그인에 실패했습니다.");    
            console.error("로그인 에러:", err)
        }
    }


    return(<>
        <div className="Catchphrase">
            로그인하고<br/>
            내가 쓴 계획들을<br/>
            다시 확인하세요.
        </div>
        <form className="Login Form" onSubmit={handleLogin}>
            <input type="text" value={id} onChange={(e) => setId(e.target.value)} placeholder="아이디"/>
            <input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="비밀번호"/>
            {/* 계정 찾기 및 회원가입 */}
            <div className="anotherOption">
                <Link to="/account/find" className="anotherOption">계정을 잃어버렸나요?</Link>
                <Link to="/account/register" className="anotherOption">아직 회원이 아니신가요?</Link>
            </div>
            {error && <div style={{color:"red"}}>{error}</div>}
            <input type="submit" value="로그인"/>
        </form>
        <KakaoSyncCom/>
    </>)
};

export default LoginPage;