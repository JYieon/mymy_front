import { Link } from "react-router-dom";
import style from "../../Css/AccountLayout.module.css";

const FindIdPage=()=>{
    return(
        <form className={style.form}>
            <div>사용자 아이디 표시 부분</div>
            <input type="text" placeholder="이름"/>
            <input type="email" placeholder="example@email.com"/>
            <Link className={style.AnotherOption} to="../../login">아이디/비밀번호를 아시나요?</Link>
            <input type="button" value="아이디 찾기"/>
            <input type="button" value="로그인"/>
        </form>
    )
};

export default FindIdPage;