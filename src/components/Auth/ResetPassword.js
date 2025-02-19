import { useState, useEffect } from "react";
import Api from "../../Api/Api";
import { Link, useNavigate } from "react-router-dom";

const ResetPassword = () => {
    const navigate = useNavigate();
    const id = localStorage.getItem("authId");

    const [pwd, setPwd] = useState("");
    const [pwd2, setPwd2] = useState("");
    const [error, setError] = useState(""); 
    const [success, setSuccess] = useState(false);

    // 페이지 진입 시 authId 확인
    useEffect(() => {
        if (!id) {
            alert("인증되지 않은 접근입니다.");
            navigate("/login"); // 로그인 페이지로 이동
        }
    }, [id, navigate]);

    // 비밀번호 실시간 확인
    useEffect(() => {
        if (pwd && pwd2) {
            setError(pwd === pwd2 ? "" : "비밀번호가 일치하지 않습니다.");
        }
    }, [pwd, pwd2]);

    const handlePassword = async (e) => {
        e.preventDefault();
        if (error) return;

        try {
            const res = await Api.resetPassword(id, pwd);
            if (res.status === 200) {
                setSuccess(true);
                localStorage.removeItem("authId");
            }
        } catch (err) {
            console.error("비밀번호 재설정 실패:", err);
            setError("비밀번호 변경 중 오류가 발생했습니다.");
        }
    };

    if (success) {
        return (
            <div>
                <p>비밀번호가 성공적으로 재설정되었습니다!</p>
                <Link to="/">메인화면으로 가기</Link>
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
