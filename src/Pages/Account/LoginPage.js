import { Link, useNavigate } from "react-router-dom";
// import "../../Css/LoginPage.css"
import KakaoSyncCom from "../../Components/KakaoSync/KakaoSyncCom";
import { useEffect, useState } from "react";
import AuthApi from "../../api/AuthApi";
import ChatApi from "../../api/ChatApi";
import KoKaoLogin from "../../Assets/KakaoTalk_20250220_134840509_01.png"
import styles from "../../Css/AccountLayout.module.css"
import Modal from "react-modal";


const LoginPage=()=>{
    const [id, setId] = useState("");
    const [pwd, setPwd] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [testOpen, setTestOpen] = useState(false);


    //로그인 요청 처리
    const handleLogin = async (e) => {
        e.preventDefault();
    
        console.log("click login");
        console.log("ID : ", id);
        console.log("PWD : ", pwd);
    
        try {
            const res = await AuthApi.login(id, pwd);
            console.log(res)
            if (res.status === 200) {
                // 로그인 성공 후, 토큰 저장
                console.log("로그인 성공");
                localStorage.setItem("accessToken", res.data.accessToken);
                const user=await ChatApi.getUserInfo(res.data.accessToken);
                if (user.data.testResult === "미설정"){
                    setTestOpen(true);
                }
                else {
                window.location.href = "/";

                }

            }else{
                console.log("**", res.data)
            }
    
        } catch (err) {
            setError(err.response.data.msg);    
        }
    }

    const TestOpenBtn = () => {
        setTestOpen(false);
    };



    return(<>
                <Modal
                isOpen={testOpen}
                ariaHideApp={true}
                onRequestClose={TestOpenBtn}
                className={`Shadow modal`}
            >
                <span className={`${styles.wait}`}>잠깐!</span>
                <span className={`${styles.testContext}`}>계획을 세우러 가기 전에,<br />나와 함께 여행할 고양이가 궁금하지 않으세요? </span>
                <div className={`${styles.testAnswer}`}>
                    <button className={`${styles.testBtn} ${styles.wait}`} onClick={() => {
                        window.location.href = "/test";
                    }}>궁금해요!</button>
                    <button className={`${styles.testBtn} ${styles.testNo}`} onClick={()=>{
                window.location.href = "/";
                    }}>나중에 만날래요.</button>
                </div>
            </Modal>
        <div className={styles.Catchphrase}>
            로그인하고<br/>
            내가 쓴 계획들을<br/>
            다시 확인하세요.
        </div>
        <form className={styles.form} onSubmit={handleLogin}>
            <input type="text" value={id} onChange={(e) => setId(e.target.value)} placeholder="아이디"/>
            <input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="비밀번호"/>
            {/* 계정 찾기 및 회원가입 */}
            <div className="anotherOption">
            <Link to="/account/find" className={styles.AnotherOption}>계정을 잃어버렸나요?</Link>
            <Link to="/account/register" className={styles.AnotherOption}>아직 회원이 아니신가요?</Link>
            </div>
            {error && <div style={{color:"red"}}>{error}</div>}
            <input type="submit" value="로그인"/>

            {/* 카카오톡 로그인 */}
            <KakaoSyncCom />
        </form>
    </>)
};

export default LoginPage;