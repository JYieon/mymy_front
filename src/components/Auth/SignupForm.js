import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  
import Api from "../../Api/AuthApi";

const SignupForm = () => {
    const [id, setId] = useState("");           // 아이디
    const [email, setEmail] = useState("");     // 이메일
    const [authNum, setAuthNum] = useState(""); // 인증번호
    const [pwd, setPwd] = useState("");         // 비밀번호
    const [pwd2, setPwd2] = useState("");       // 비밀번호 확인
    const [name, setName] = useState("");       // 이름
    const [nick, setNickname] = useState("");// 닉네임
    const [phone, setPhone] = useState("");     // 전화번호
    const [error, setError] = useState("");     // 에러 메시지
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
        if (authTime > 0 && buttonText === "인증" && !isAuthTimeOver) {
            const timer = setInterval(() => {
                setAuthTime((prevTime) => {
                    if (prevTime <= 1) {
                        setIsAuthTimeOver(true);  // 타이머 종료시 인증 만료 처리
                        clearInterval(timer);  // 타이머 종료
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);

            return () => clearInterval(timer);  // 컴포넌트가 언마운트되거나 타이머가 종료될 때 clearInterval
        }
    }, [authTime, buttonText, isAuthTimeOver]);

    // 비밀번호 실시간 검증 (8자 이상 + 숫자 포함)
    useEffect(() => {
        if (pwd.length > 0 && pwd.length < 8) {
            setPwdError("비밀번호는 최소 8자 이상이어야 합니다.");
        } else if (pwd.length >= 8 && !/\d/.test(pwd)) {
            setPwdError("비밀번호에는 숫자가 최소 1개 이상 포함되어야 합니다.");
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
            const res = await Api.checkId(id);
            console.log("checkID: ", res)
            if (res.status === 200) {
                setError("");  
                alert("사용 가능한 아이디입니다.");
            }
        } catch (err) {
            setError("이미 사용 중인 아이디입니다.");
        }
    };

     // 인증번호 발송 & 재전송
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
                const res = await Api.signupMail(email);
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
                setAuthError("인증번호 발송에 실패했습니다.");
            }
        } else if (buttonStatus === "인증") {
            try {
                const res = await Api.authOk(authNum, id);
                if (res.status === 200) {
                    setIsVerified(true);
                    setAuthError("");
                } else {
                    setAuthNum("");
                    setAuthError("인증번호가 틀렸습니다.");
                }
            } catch (err) {
                console.error("인증 오류:", err);
                setAuthError("인증에 실패했습니다.");
            }
        }
    };

    // 회원가입 폼 제출
    const handleSignup = async (e) => {
        e.preventDefault();

        if (!id || !email || !isVerified || !pwd || !pwd2 || !name || !nick || !phone) {
            setError("모든 항목을 입력하고 인증을 완료하세요.");
            return;
        }
        if (pwd !== pwd2) {
            setError("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            const res = await Api.signup({ id, email, pwd, name, nick, phone });
            console.log("회원가입 res : ", res.status)
            if (res.status === 200) {
                alert("회원가입 성공!");
                navigate("/login");
            } else {
                setError("회원가입에 실패했습니다.");
            }
        } catch (err) {
            console.error("회원가입 오류:", err);
            setError("회원가입 중 문제가 발생했습니다.");
        }
    };

    return (
        <div>
            <form className="UserInfo" onSubmit={handleSignup}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <input
                        type="text"
                        name="Id"
                        value={id}
                        placeholder="아이디"
                        onChange={(e) => setId(e.target.value)}
                    />
                    <button type="button" onClick={handleCheckId}>
                        중복 확인
                    </button>
                </div>
                {error && <div style={{ color: "red" }}>{error}</div>}

                <input
                    type="password"
                    name="Pwd"
                    value={pwd}
                    placeholder="비밀번호 (8자 이상, 숫자 포함)"
                    onChange={(e) => setPwd(e.target.value)}
                />
                {pwdError && <div style={{ color: "red" }}>{pwdError}</div>} {/* 오류 메시지 표시 */}

                {/* 비밀번호 확인 입력 */}
                <input
                    type="password"
                    name="Pwd2"
                    value={pwd2}
                    placeholder="비밀번호 확인"
                    onChange={(e) => setPwd2(e.target.value)}
                />
                {pwdMatchError && <div style={{ color: "red" }}>{pwdMatchError}</div>} {/* 불일치 메시지 표시 */}

                <input
                    type="text"
                    name="Name"
                    value={name}
                    placeholder="이름"
                    onChange={(e) => setName(e.target.value)}
                /><br />

                <input
                    type="text"
                    value={nick}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="닉네임"
                /><br />

                <input
                    type="tel"
                    name="Tel"
                    value={phone}
                    pattern="[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}"
                    maxLength="13"
                    placeholder="010-0000-0000"
                    onChange={(e) => setPhone(e.target.value)}
                /><br />

                <input
                    type="email"
                    name="Email"
                    value={email}
                    placeholder="이메일"
                    onChange={(e) => setEmail(e.target.value)}
                /><br />

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <input
                        type="text"
                        value={authNum}
                        onChange={(e) => setAuthNum(e.target.value)}
                        placeholder="인증번호"
                        disabled={isAuthTimeOver || buttonText === "발송"}
                    />
                    <button type="button" onClick={() => handleSendAuthCode(buttonText)}>
                        {buttonText}
                    </button>
                </div>

                {/* 타이머 */}
                {buttonText === "인증" && (
                    <div>
                        <p>남은 시간: {Math.floor(authTime / 60)}:{authTime % 60}</p>
                    </div>
                )}

                {/* 재전송 버튼 */}
                {showResendButton && buttonText === "인증" && (
                    <div>
                        <span>메일이 가지 않았나요? </span>
                        <button type="button" onClick={() => handleSendAuthCode("재전송")}>
                            재전송
                        </button>
                    </div>
                )}
                
                {authError && <div style={{ color: "red" }}>{authError}</div>}
                {isVerified && <div style={{ color: "green" }}>인증되었습니다.</div>}
                
                <button type="submit">회원가입</button>
                
                {error && <div style={{ color: "red" }}>{error}</div>}
            </form>
        </div>
    );
};

export default SignupForm;
