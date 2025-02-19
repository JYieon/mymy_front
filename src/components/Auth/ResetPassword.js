import { useState, useEffect } from "react";
import Api from "../../Api/Api";
import { Link, useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id");
    const navigate = useNavigate();  // useNavigate 훅을 사용하여 페이지 이동

    const [pwd, setPwd] = useState("");
    const [pwd2, setPwd2] = useState("");
    const [error, setError] = useState(""); // 에러 메시지 상태
    const [success, setSuccess] = useState(false);  // 비밀번호 변경 성공 여부 상태

    // 실시간 비밀번호 확인
    useEffect(() => {
        if (pwd && pwd2) { // 둘 다 입력된 경우만 검사
            setError(pwd === pwd2 ? "" : "비밀번호가 일치하지 않습니다.");
        }
    }, [pwd, pwd2]);

    const handlePassword = async (e) => {
        e.preventDefault();

        if (error) return; // 비밀번호가 다르면 요청 안 보냄

        try {
            const res = await Api.resetPassword(id, pwd);
            console.log("비밀번호 재설정 성공:", res);
            setSuccess(true);  // 비밀번호 변경 성공 시 success 상태를 true로 설정
            
        } catch (err) {
            console.error("비밀번호 재설정 실패:", err);
            setError("비밀번호 변경 중 오류가 발생했습니다.");
        }
    };

    if (success) {
        return (
            <div>
                <p>비밀번호가 성공적으로 재설정되었습니다!</p>
                <Link to="">메인화면으로 가기</Link>
                <Link to="/login">로그인하러 가기</Link>
            </div>
        );
    }

    return (
        <div>
            <form className="password-form" onSubmit={handlePassword}>
                <input
                    type="password"
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                    placeholder="새 비밀번호"
                /><br />
                <input
                    type="password"
                    value={pwd2}
                    onChange={(e) => setPwd2(e.target.value)}
                    placeholder="새 비밀번호 확인"
                /><br />
                {error && <p style={{ color: "red" }}>{error}</p>}

                <button type="submit" disabled={!!error}>비밀번호 재설정</button>
            </form>
        </div>
    );
};

export default ResetPassword;
