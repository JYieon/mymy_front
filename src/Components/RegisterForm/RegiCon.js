import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../api/AuthApi";
import RegiCom from "./RegiCom";

const RegiCon = () => {
    const formData = useRef({
        current: {
        id: "",
        email: "",
        authNum: "",
        pwd: "",
        pwd2: "",
        name: "",
        nick: "",
        phone: "",
    },
    });
    const buttonRef = useRef(null);

    const [errors, setErrors] = useState({
        error: "",
        pwdError: "",
        pwdMatchError: "",
        authError: "",
    });

    const [buttonText, setButtonText] = useState("발송");
    const [isVerified, setIsVerified] = useState(false);
    const [authTime, setAuthTime] = useState(300);
    const [isAuthTimeOver, setIsAuthTimeOver] = useState(false);
    const [showResendButton, setShowResendButton] = useState(false);
    

    const navigate = useNavigate();

    useEffect(() => {
        if (authTime > 0 && buttonText === "인증" && !isAuthTimeOver) {
            const timer = setInterval(() => {
                setAuthTime((prevTime) => {
                    if (prevTime <= 1) {
                        setIsAuthTimeOver(true);
                        clearInterval(timer);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [authTime, buttonText, isAuthTimeOver]);

    useEffect(() => {
        if (formData.current && formData.current.pwd && formData.current.pwd.length < 8) {
            setErrors((prev) => ({ ...prev, pwdError: "비밀번호는 최소 8자 이상이어야 합니다." }));
        } else if (formData.current.pwd && formData.current.pwd.length >= 8 && !/\d/.test(formData.current.pwd)) {
            setErrors((prev) => ({ ...prev, pwdError: "비밀번호에는 숫자가 최소 1개 이상 포함되어야 합니다." }));
        } else {
            setErrors((prev) => ({ ...prev, pwdError: "" }));
        }
    }, [formData.current.pwd]);

    useEffect(() => {
        const { pwd, pwd2 } = formData.current;
        if (pwd && pwd2.length > 0 && pwd !== pwd2) {
            setErrors((prev) => ({ ...prev, pwdMatchError: "비밀번호가 일치하지 않습니다." }));
        } else {
            setErrors((prev) => ({ ...prev, pwdMatchError: "" }));
        }
    }, [formData.current.pwd, formData.current.pwd2]);

    useEffect(() => {
        formData.current.phone = autoHypenTel(formData.current.phone);
    }, [formData.current.phone]);

    const autoHypenTel = (str) => {
        if (!str) return str; 
        str = str.replace(/[^0-9]/g, "");
        if (str.startsWith("02")) {
            return str.length < 3 ? str : str.length < 6 ? `${str.substr(0, 2)}-${str.substr(2)}` : `${str.substr(0, 2)}-${str.substr(2, 4)}-${str.substr(6)}`;
        }
        return str.length < 4 ? str : str.length < 7 ? `${str.substr(0, 3)}-${str.substr(3)}` : `${str.substr(0, 3)}-${str.substr(3, 4)}-${str.substr(7)}`;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        formData.current[name] = value;
    };

    const handleCheckId = async () => {
        if (!formData.current.id) {
            setErrors({ error: "아이디를 입력하세요." });
            return;
        }
        try {
            const res = await Api.checkId(formData.current.id);
            if (res.status === 200) {
                alert("사용 가능한 아이디입니다.");
            }
        } catch {
            setErrors({ error: "이미 사용 중인 아이디입니다." });
        }
    };

    const handleSendAuthCode = async (buttonStatus) => {
        if (!formData.current.email) {
            setErrors({ error: "이메일을 입력하세요." });
            return;
        }
        if (buttonStatus === "발송" || buttonStatus === "재전송") {
            setAuthTime(300);
            setIsAuthTimeOver(false);
            setShowResendButton(buttonStatus === "발송");

            try {
                const res = await Api.signupMail(formData.current.email);
                if (res.data === 0) {
                    alert("이미 존재하는 이메일입니다.");
                    formData.current.email = "";
                } else {
                    setButtonText("인증");
                }
            } catch {
                setErrors({ error: "인증번호 발송에 실패했습니다." });
            }
        } else if (buttonStatus === "인증") {
            try {
                const res = await Api.authOk(formData.current.authNum, formData.current.id);
                if (res.status === 200) {
                    setIsVerified(true);
                } else {
                    formData.current.authNum = "";
                    setErrors({ authError: "인증번호가 틀렸습니다." });
                }
            } catch {
                setErrors({ authError: "인증에 실패했습니다." });
            }
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        const { id, email, pwd, pwd2, name, nick, phone } = formData.current;
        const buttonValue = buttonRef.current.value;

        if(buttonValue === "다음" ){
            if ( !email || !isVerified || !name || !nick || !phone) {
                setErrors({ error: "모든 항목을 입력하세요." });
                return;
            }
        }else if(buttonValue === "완료"){
            if (!id || !pwd || !pwd2) {
                setErrors({ error: "모든 항목을 입력하고 인증을 완료하세요." });
                return;
            }
            if (pwd !== pwd2) {
                setErrors({ error: "비밀번호가 일치하지 않습니다." });
                return;
            }
            try {
                const res = await Api.signup(formData.current);
                if (res.status === 200) {
                    alert("회원가입 성공!");
                    navigate("/login");
                } else {
                    setErrors({ error: "회원가입에 실패했습니다." });
                }
            } catch {
                setErrors({ error: "회원가입 중 문제가 발생했습니다." });
            }
        }
    };

    return (
        <RegiCom
            formData={formData.current}
            errors={errors}
            buttonText={buttonText}
            authTime={authTime}
            isAuthTimeOver={isAuthTimeOver}
            isVerified={isVerified}
            showResendButton={showResendButton}
            handleInputChange={handleInputChange}
            handleCheckId={handleCheckId}
            handleSendAuthCode={handleSendAuthCode}
            handleSignup={handleSignup}
            autoHypenTel={autoHypenTel}
        />
    );
};

export default RegiCon;
