import { Link } from "react-router-dom";
import style from "../../Css/AccountLayout.module.css";
import { useRef } from "react";

const FindPwPage=()=>{

    return(
        <>
        <form className={style.form}>
            <div>사용자 아이디 표시 부분</div>
            <input type="text" placeholder="아이디"/>
            <input type="email" placeholder="example@email.com"/>
            <Link className={style.AnotherOption} to="../../login">아이디/비밀번호를 아시나요?</Link>

           <input type="text" placeholder="인증 코드"/>
            <input type="button" value="인증"/>
            <input type="button" value="비밀번호 재설정"/>
        </form>

        <form className={style.form}>
            <input type="password" placeholder="새 비밀번호"/>
            <input type="password" placeholder="새 비밀번호 확인"/>
            <input type="button" value="변경"/>

        </form>
        </>
    )
};

export default FindPwPage;