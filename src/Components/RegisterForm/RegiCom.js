import { useEffect, useRef, useState } from "react";
import styles from "../../Css/AccountLayout.module.css"
import { useNavigate } from "react-router-dom";
import AuthApi from "../../api/AuthApi";

const RegiCom=()=>{
    const [id, setId] = useState("");           // 아이디
    const [email, setEmail] = useState("");     // 이메일
    const [authNum, setAuthNum] = useState(""); // 인증번호
    const [pwd, setPwd] = useState("");         // 비밀번호
    const [pwd2, setPwd2] = useState("");       // 비밀번호 확인
    const [name, setName] = useState("");       // 이름
    const [nick, setNickname] = useState("");// 닉네임
    const [phone, setPhone] = useState("");     // 전화번호
    const [error, setError] = useState("");     // 에러 메시지
    const [mainError, setMainError] = useState("");     // 에러 메시지
    const [pwdError, setPwdError] = useState(""); // 비밀번호 유효성 오류 메시지
    const [pwdMatchError, setPwdMatchError] = useState(""); // 비밀번호 불일치 오류 메시지
    const [buttonText, setButtonText] = useState("발송"); // 버튼 텍스트 (발송 → 인증)
    const [isVerified, setIsVerified] = useState(false); // 인증 여부
    const [authError, setAuthError] = useState(""); // 인증 실패 메시지
    const [authTime, setAuthTime] = useState(300); // 5분 (300초)
    const [isAuthTimeOver, setIsAuthTimeOver] = useState(false); // 시간 만료 여부
    const [showResendButton, setShowResendButton] = useState(false); // 재전송 버튼 표시 여부

    const navigate = useNavigate();

    // 인증번호 발송 타이머
    useEffect(() => {
        if (authTime > 0 && buttonText === "인증" && !isAuthTimeOver && !isVerified) {
            const timer = setInterval(() => {
                setAuthTime((prevTime) => {
                    if (prevTime <= 1) {
                        setIsAuthTimeOver(true);
                        clearInterval(timer);  // 타이머 종료
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);

            return () => clearInterval(timer);  // 컴포넌트가 언마운트되거나 타이머가 종료될 때 clearInterval
        }
    }, [authTime, buttonText, isAuthTimeOver, isVerified]);


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

    // 비밀번호 확인 검증 (서로 다를 때 오류 메시지 출력)
    useEffect(() => {
        if (pwd2.length > 0 && pwd !== pwd2) {
            setPwdMatchError("비밀번호가 일치하지 않습니다.");
        } else {
            setPwdMatchError(""); // 비밀번호가 일치하면 오류 메시지 제거
        }
    }, [pwd, pwd2]);

    useEffect(() => {
        setPhone(autoHypenTel(phone));
    }, [phone]);

    //전화번호 하이픈 자동생성
    const autoHypenTel = (str) => {
        str = str.replace(/[^0-9]/g, '');
        let tmp = '';

        if (str.startsWith("02")) {
            if (str.length < 3) {
                return str;
            } else if (str.length < 6) {
                tmp = `${str.substr(0, 2)}-${str.substr(2)}`;
            } else if (str.length < 10) {
                tmp = `${str.substr(0, 2)}-${str.substr(2, 3)}-${str.substr(5)}`;
            } else {
                tmp = `${str.substr(0, 2)}-${str.substr(2, 4)}-${str.substr(6, 4)}`;
            }
        } else {
            if (str.length < 4) {
                return str;
            } else if (str.length < 7) {
                tmp = `${str.substr(0, 3)}-${str.substr(3)}`;
            } else if (str.length < 11) {
                tmp = `${str.substr(0, 3)}-${str.substr(3, 3)}-${str.substr(6)}`;
            } else {
                tmp = `${str.substr(0, 3)}-${str.substr(3, 4)}-${str.substr(7)}`;
            }
        }
        return tmp;
    }

    // 아이디 중복 확인
    const handleCheckId = async () => {
        if (!id) {
            setError("아이디를를 입력하세요.");
            return;
        }

        try {
            const res = await AuthApi.checkId(id);
            console.log("checkID: ", res)
            if (res.status === 200) {
                setError("");  
                alert("사용 가능한 아이디입니다.");
            }
        } catch (err) {
            setError("이미 사용 중인 아이디입니다.");
        }
    };

    // 🔹 인증번호 발송 & 재전송
    const handleSendAuthCode = async (buttonStatus) => {
        if (!email) {
            setError("이메일을 입력하세요.");
            return;
        }
        setError("");

        if (buttonStatus === "발송" || buttonStatus === "재전송") {
            setAuthTime(300); // 타이머 5분으로 리셋
            setIsAuthTimeOver(false);
            alert("인증번호 발송에 시간이 걸릴 수 있습니다. 인증번호가 발송되면 입력할 수 있습니다.");

            if(buttonStatus === "재전송"){
                setShowResendButton(false); 
            }

            try {
                const res = await AuthApi.signupMail(email);
                if (res.data === 0) {
                    alert("이미 존재하는 이메일입니다. 다시 입력해주세요.");
                    setEmail("");
                } else {
                    if(buttonStatus === "발송"){
                        setShowResendButton(true);
                        setButtonText("인증");
                    }
                    
                    setAuthError("");
                }
            } catch (err) {
                console.error("인증번호 발송 오류:", err);
                setError("인증번호 발송에 실패했습니다.");
            }
        } else if (buttonStatus === "인증") {
            try {
                const res = await AuthApi.authOk(authNum, id);
                if (res.status === 200) {
                    setIsVerified(true);
                    setAuthError("");
                    setIsAuthTimeOver(false); 
                    setAuthTime(0);
                } 
            } catch (err) {
                console.error("인증 오류:", err);
                setAuthError("인증에 실패했습니다.");
            }
        }
    };

    //div 화면 넘어가는 기능
    const FirstForm=useRef(null);
    const SecondForm=useRef(null);
    
    const onClick=()=>{
        if (SecondForm.current.style.display==="none")
            {
                SecondForm.current.style.display="block";
                FirstForm.current.style.display="none";
            }
        else{
            SecondForm.current.style="display:none;"
            FirstForm.current.style.display="block";

        };         
    }

    // 회원가입 폼 제출
    const handleSignup = async (e) => {
        e.preventDefault();

        if (!id || !email || !isVerified || !pwd || !pwd2 || !name || !phone) {
            setMainError("모든 항목을 입력하세요.");
            return;
        }

        try {
            const res = await AuthApi.signup({ id, email, pwd, name, nick, phone });
            console.log("회원가입 res : ", res.status)
            if (res.status === 200) {
                alert("회원가입 성공!");
                window.location.href = "/";
            } else {
                setError("회원가입에 실패했습니다.");
            }
        } catch (err) {
            console.error("회원가입 오류:", err);
            setMainError("회원가입 중 문제가 발생했습니다.");
        }
    };


    return (
        <>
            <form className={styles.form} onSubmit={handleSignup} >
                <div className={styles.FirstForm} ref={FirstForm}>
                    <input type="text" name="Name" placeholder="이름" onChange={(e) => setName(e.target.value)}/>
                    <input 
                        type="tel" name="Tel" 
                        placeholder="010-0000-0000" 
                        pattern="[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}"
                        maxLength="13"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        />
                    <input type="email" name="Email" placeholder="example@mail.com" onChange={(e) => setEmail(e.target.value)}/>
                    {/* 이메일 입력 오류 메세지 */}
                    <div className={styles.Warning}>
                        올바른 이메일 양식이 아닙니다.
                    </div>
                    
                    
                    <div className={styles.Verfiy} >
                        <input 
                            type="text" placeholder="인증번호"
                            onChange={(e) => setAuthNum(e.target.value)}
                            disabled={isAuthTimeOver || buttonText === "발송"}
                        />
                        <button type="button" onClick={() => handleSendAuthCode(buttonText)}>
                            {buttonText}
                        </button>
                    </div>
                    
                    
                    {/* 타이머 */}
                    {buttonText === "인증" && !isVerified && (
                        <div className={styles.Timer}>
                            <span>남은 시간 {Math.floor(authTime / 60)}:{authTime % 60}</span>
                            {/* 재전송 버튼 */}
                            {showResendButton && buttonText === "인증" && (
                                    <button type="button" onClick={() => handleSendAuthCode("재전송")}>
                                        재전송
                                    </button>
                            )}
                        </div>
                    )}
                    
                    {authError && <div style={{color:"red", marginLeft:"15px"}}>{authError}</div>}
                    {isVerified && <div style={{color:"white", marginLeft:"15px"}}>인증되었습니다.</div>}
                    {isVerified && (
                        <input type="button" value="다음" onClick={onClick} />
                    )}

                </div>
                <div className={styles.SecondForm} ref={SecondForm}>
                    <input type="button"value="이전" onClick={onClick}/>
                    <div className={styles.Id}>
                        <input type="text" name="Id" placeholder="아이디" onChange={(e) => setId(e.target.value)}/>
                        <button type="button" onClick={handleCheckId}>
                            중복 확인
                        </button>
                    </div>
                    {error && <div style={{color:"red", marginLeft:"5px", marginBottom:"10px"}}>{error}</div>}
                    <input type="password" name="Pwd" placeholder="비밀번호 (8자 이상, 숫자 포함)" onChange={(e) => setPwd(e.target.value)}/>
                    {pwdError && <div style={{color:"red", marginLeft:"5px", marginBottom:"10px", fontSize:"13px"}}>{pwdError}</div>}
                    <input type="password" name="PwdCheck" placeholder="비밀번호 확인" onChange={(e) => setPwd2(e.target.value)} />
                    {pwdMatchError && <div style={{color:"red", marginLeft:"5px", marginBottom:"10px"}}>{pwdMatchError}</div>}
                    <input type="submit" value="완료"/>
                    {mainError && <div style={{color:"red", marginLeft:"30px", marginBottom:"10px"}}>{mainError}</div>}
                </div>
            </form>
        </>
    )
};

export default RegiCom;