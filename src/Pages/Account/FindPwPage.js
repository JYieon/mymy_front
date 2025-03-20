import { Link, useNavigate } from "react-router-dom";
import style from "../../Css/AccountLayout.module.css";
import { useEffect, useRef, useState } from "react";
import AuthApi from "../../api/AuthApi";

const FindPwPage=()=>{
    const [id, setId] = useState("");           // 아이디
    const [email, setEmail] = useState("");     // 이메일
    const [authNum, setAuthNum] = useState(""); // 인증번호
    const [authNumOk, setAuthNumOk] = useState(""); // 실제 인증번호
    const [error, setError] = useState("");     // 에러 메시지
    const [buttonText, setButtonText] = useState("발송"); // 버튼 텍스트 (발송 → 인증)
    const [isVerified, setIsVerified] = useState(false); // 인증 여부
    const [authError, setAuthError] = useState(""); // 인증 실패 메시지

//  pwdReset
    const [pwd, setPwd] = useState("");
    const [pwd2, setPwd2] = useState("");
    const [pwdError, setPwdError] = useState(""); 
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();  // useNavigate 훅 사용

    // 인증번호 발송 버튼 클릭 시
    const handleSendAuthCode = async () => {
        if (!email) {
            setError("이메일을 입력하세요.");
            return;
        }
        setError("");  // 에러 초기화

        if (buttonText === "발송") {
            alert("인증번호 발송에 시간이 걸릴 수 있습니다. 인증번호가 발송되면 입력할 수 있습니다.")
            try {
                const res = await AuthApi.sendMail(id, email); // 인증번호 발송 API 호출
                if(res.data === 0){
                    alert("아이디 또는 이메일을 잘못 입력하였습니다.")
                    setId("")
                    setEmail("")
                }else{
                    const receivedAuthNum = res.data; // 서버에서 받은 인증번호
                    setAuthNumOk(receivedAuthNum); // 실제 인증번호 저장
                    setButtonText("인증"); // 버튼을 '인증'으로 변경
                    setAuthError(""); // 인증 오류 메시지 초기화
                }
            } catch (err) {
                console.error("인증번호 발송 오류:", err);
                setError("인증번호 발송에 실패했습니다.");
            }
        } else if (buttonText === "인증") {
            // 인증번호 확인: 공백 제거 후 비교
            try{
                const res = await AuthApi.authOk(authNum, id);
                if(res.status === 200) {
                    setIsVerified(true); // 인증 성공
                    setAuthError(""); // 인증 오류 메시지 초기화
                }
            }catch{
                setAuthNum(""); // 인증번호 칸 비우기
                setAuthError("인증번호가 틀렸습니다."); // 오류 메시지 출력
            }
        }
    };

    // 비밀번호 찾기 폼 제출
    const handlePassword = (e) => {
        e.preventDefault();

        if (!id || !email || !isVerified) {
            setError("아이디, 이메일, 인증을 모두 완료하세요.");
            return;
        }

        console.log("입력된 정보:", { id, email, authNum });
        setError(""); // 에러 초기화
    };

    //resetPwd
    // useEffect(() => {
    //     if (pwd && pwd2) {
    //         setPwdError(pwd === pwd2 ? "" : "비밀번호가 일치하지 않습니다.");
    //     }
    // }, [pwd, pwd2]);

    // 비밀번호 실시간 검증 (8자 이상 + 숫자 포함)
    useEffect(() => {
        if (pwd.length > 0 && pwd.length < 8) {
            setPwdError("최소 8자 이상이어야 합니다.");
        } else if (pwd.length >= 8 && !/\d/.test(pwd)) {
            setPwdError("숫자가 포함되어야 합니다.");
        } else {
            setPwdError(""); // 조건을 충족하면 오류 메시지 제거
        }
    }, [pwd]);

    const handlePasswordReset = async (e) => {
            e.preventDefault();
            if(pwd !== pwd2){
                setPwdError("비밀번호 확인이 동일하지 않습니다.")
                return;
            }
    
            try {
                const res = await AuthApi.resetPassword(id, pwd);
                if (res.status === 200) {
                    setSuccess(true);
                    localStorage.removeItem("authId");
                }
            } catch (err) {
                console.error("비밀번호 재설정 실패:", err);
                setPwdError("비밀번호 변경 중 오류가 발생했습니다.");
            }
        };

        if(success){
            alert("비밀번호 재설정 완료!")
            window.location.href = "/account/login"
        }

        
    return(
        <>
        <form className={style.form} onSubmit={handlePassword}>
            {authError && <div style={{ color: "red" }}>{authError}</div>}
            {isVerified && <div style={{ color: "green" }}>인증되었습니다.</div>}
            <div>사용자 아이디 표시 부분</div>
            <input 
                type="text" 
                placeholder="아이디"
                value={id}
                onChange={(e) => setId(e.target.value)}
                />
            <input 
                type="email" 
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
            <Link className={style.AnotherOption} to="../../login">아이디/비밀번호를 아시나요?</Link>

            <input 
                type="text" 
                placeholder="인증 코드"
                value={authNum}
                onChange={(e) => setAuthNum(e.target.value)}
                disabled={buttonText === "발송"}
                />
            <input type="button" onClick={handleSendAuthCode} value={buttonText}/>
            {isVerified && (
                    <input type="submit" value="비밀번호 재설정" />
                )}
        </form>

        <form className={style.form} onSubmit={handlePasswordReset}>
            <input 
                type="password" 
                placeholder="새 비밀번호"
                value={pwd}
                onChange={(e) => {setPwd(e.target.value)}}
                />
            <input 
                type="password" 
                placeholder="새 비밀번호 확인"
                value={pwd2}
                onChange={(e) => setPwd2(e.target.value)}
                />
            {pwdError && <p style={{ color: "red" }}>{pwdError}</p>}
            <input type="submit" value="변경"/>

        </form>
        </>
    )
};

export default FindPwPage;