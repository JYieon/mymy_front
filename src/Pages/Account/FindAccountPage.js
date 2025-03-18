import { Link } from "react-router-dom";
import style from "../../Css/AccountLayout.module.css";

const FindAccountPage=()=>{
    return(
        <>
            <Link className={style.link} to="id">아이디 찾기</Link>
            <Link className={style.link} to="pw">비번 찾기</Link>
        </>
    )
};

export default FindAccountPage;