import { useState } from "react";
import { Link } from "react-router-dom";
import style from "../../Css/AccountLayout.module.css";
import AuthApi from "../../api/AuthApi";

const FindIdPage = () => {
    const [name, setName] = useState("");  // 이름 상태
    const [email, setEmail] = useState(""); // 이메일 상태
    const [userId, setUserId] = useState(""); // 찾은 아이디 저장
    const [error, setError] = useState("");  // 에러 메시지

    const handleFindId = async () => {
        if (!name || !email) {
            setError("이름과 이메일을 입력하세요.");
            return;
        }
        setError(""); // 에러 초기화

        try {
            const res = await AuthApi.findId(name, email);
            if (res.data) {
                setUserId(res.data); // 서버에서 반환한 아이디 저장
                setError(""); // 에러 메시지 초기화
            } else {
                setError("일치하는 정보가 없습니다.");
            }
        } catch (err) {
            console.error("아이디 찾기 오류:", err);
            setError("아이디 찾기에 실패했습니다.");
        }
    };

    return (
        <form className={style.form}>
            <h2>아이디 찾기</h2>
            {userId && <div style={{ color: "white" }}>{userId}</div>} 
            {error && <div style={{ color: "red" }}>{error}</div>}
            <input
                type="text"
                placeholder="이름"
                value={name}
                onChange={(e) => {
                    setName(e.target.value);
                    setError(""); // 입력 시 에러 메시지 초기화
                }}
            />
            <input
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);
                    setError(""); // 입력 시 에러 메시지 초기화
                }}
            />
            <Link className={style.AnotherOption} to="../../login">아이디/비밀번호를 아시나요?</Link>
            <input type="button" value="아이디 찾기" onClick={handleFindId} />
            <input type="button" value="로그인" onClick={() => (window.location.href = "/account/login")} />
        </form>
    );
};

export default FindIdPage;
