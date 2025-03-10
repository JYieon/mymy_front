import React, { useState } from "react";
import { Link } from "react-router-dom";
import Api from "../../Api/AuthApi";

const LoginForm = () => {
    const [id, setId] = useState("");
    const [pwd, setPwd] = useState("");
    const [error, setError] = useState("");

    //로그인 요청 처리
    const handleLogin = async (e) => {
        e.preventDefault();
    
        console.log("click login");
        console.log("ID : ", id);
        console.log("PWD : ", pwd);
    
        try {
            const res = await Api.login(id, pwd);

            console.log(res);
    
            if (res.status === 200 && res.data) {
                // 로그인 성공 후, 토큰 저장
                console.log("로그인 성공");
                localStorage.setItem("accessToken", res.data.accessToken);
            } 
    
        } catch (err) {
            setError("로그인에 실패했습니다.");    
            console.error("로그인 에러:", err)
        }
    }

    return (
        <div>
            <form className="login-form" onSubmit={handleLogin}>
                <input type="text" value={id} onChange={(e) => setId(e.target.value)}
                    id="id" placeholder="아이디"/><br/>
                <input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)}
                     id="pwd" placeholder="비밀번호"/><br/>
                {error && <div style={{color:"red"}}>{error}</div>}
                <button>로그인</button>
            </form>
            <Link to="/find">아이디/비밀번호 찾기</Link>
            <Link to="">회원가입</Link>
        </div>
    )
}

export default LoginForm;