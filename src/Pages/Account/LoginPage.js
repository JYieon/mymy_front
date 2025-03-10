import { Link } from "react-router-dom";
import KoKaoLogin from "../../Assets/KakaoTalk_20250220_134840509_01.png"
import styles from "../../Css/AccountLayout.module.css"


const LoginPage=()=>{
    return(<>
        <div className={styles.Catchphrase}>
            로그인하고<br/>
            내가 쓴 계획들을<br/>
            다시 확인하세요.
        </div>
        <form className={styles.form} >
            <input type="text" placeholder="아이디"/>
            <input type="password" placeholder="비밀번호"/>

            {/* 계정 찾기 및 회원가입 */}

            <Link to="/account/find" className={styles.AnotherOption}>계정을 잃어버렸나요?</Link>
            <Link to="/account/register" className={styles.AnotherOption}>아직 회원이 아니신가요?</Link>

            <input type="submit" value="로그인"/>

            {/* 카카오톡 로그인 */}
            <Link to="/KakaoLogin" className={styles.KakaoLogo}>
            <img src={KoKaoLogin} alt="can't read Img" className="KakaoLogo"/>
            </Link>
        </form>
    

    </>)
};

export default LoginPage;