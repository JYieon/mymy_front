import { useState } from "react";
import { useNavigate } from "react-router-dom";  // useNavigate 추가
import Api from "../../Api/AuthApi";

const FindPassword = () => {
    const [id, setId] = useState("");           // 아이디
    const [email, setEmail] = useState("");     // 이메일
    const [authNum, setAuthNum] = useState(""); // 인증번호
    //const [authNumOk, setAuthNumOk] = useState(""); // 실제 인증번호
    const [error, setError] = useState("");     // 에러 메시지
    const [buttonText, setButtonText] = useState("발송"); // 버튼 텍스트 (발송 → 인증)
    const [isVerified, setIsVerified] = useState(false); // 인증 여부
    const [authError, setAuthError] = useState(""); // 인증 실패 메시지

    const navigate = useNavigate();  // useNavigate 훅 사용

    // 인증번호 발송 버튼 클릭 시
    const handleSendAuthCode = async () => {
        if (!email) {
            setError("이메일을 입력하세요.");
            return;
        }
        setError("");  // 에러 초기화

        if (buttonText === "발송") {
            try {
                const res = await Api.sendMail(id, email); // 인증번호 발송 API 호출
                console.log(res.data)
                // const receivedAuthNum = res.data; // 서버에서 받은 인증번호
                // setAuthNumOk(receivedAuthNum); // 실제 인증번호 저장
                setButtonText("인증"); // 버튼을 '인증'으로 변경
                setAuthError(""); // 인증 오류 메시지 초기화
            } catch (err) {
                console.error("인증번호 발송 오류:", err);
                setError("인증번호 발송에 실패했습니다.");
            }
        } else if (buttonText === "인증") {
            // 인증번호 확인: 공백 제거 후 비교
            const res = await Api.authOk(authNum, id);

            //const cleanedAuthNum = authNum.trim();  // 사용자가 입력한 인증번호에서 공백 제거
            //const cleanedAuthNumOk = String(authNumOk).trim();  // 서버에서 받은 인증번호를 문자열로 변환 후 공백 제거
            console.log(res.config.params.id)
            // 비교
            if (res.status === 200) {
                setIsVerified(true); // 인증 성공
                setAuthError(""); // 인증 오류 메시지 초기화
                localStorage.setItem("authId", res.config.params.id)
            } else {
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

        // 비밀번호 재설정 완료 후 다른 페이지로 이동
        navigate(`/reset_password`);  // "/reset-password" 페이지로 이동
    };

    return (
        <div>
            <form className="password-form" onSubmit={handlePassword}>
                <input
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    placeholder="아이디"
                /><br />
                
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="이메일"
                /><br />
                
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <input
                        type="text"
                        value={authNum}
                        onChange={(e) => setAuthNum(e.target.value)}
                        placeholder="인증번호"
                        disabled={buttonText === "발송"} // '발송' 버튼을 누를 때까지 입력 비활성화
                    />
                    <button type="button" onClick={handleSendAuthCode}>
                        {buttonText}
                    </button>
                </div>
                
                {authError && <div style={{ color: "red" }}>{authError}</div>}
                {isVerified && <div style={{ color: "green" }}>인증되었습니다.</div>}
                
                {isVerified && (
                    <div>
                        <button type="submit">비밀번호 재설정</button>
                    </div>
                )}
                
                {error && <div style={{ color: "red" }}>{error}</div>}
            </form>
        </div>
    );
};

export default FindPassword;
