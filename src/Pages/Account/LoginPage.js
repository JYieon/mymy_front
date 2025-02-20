import { Link } from "react-router-dom";
import "../../Css/LoginPage.css"
import KakaoSyncCom from "../..//Components/KakaoSync/KakaoSyncCom";

const LoginPage=()=>{
    return(<>
        <div className="Catchphrase">
            로그인하고<br/>
            내가 쓴 계획들을<br/>
            다시 확인하세요.
        </div>
        <form className="Login Form">
            <input type="text" placeholder="아이디"/>
            <input type="password" placeholder="비밀번호"/>
            {/* 계정 찾기 및 회원가입 */}
            <div className="anotherOption">
                <Link to="/account/find" className="anotherOption">계정을 잃어버렸나요?</Link>
                <Link to="/account/register" className="anotherOption">아직 회원이 아니신가요?</Link>
            </div>
            <input type="submit" value="로그인"/>
        </form>
        <KakaoSyncCom/>
    </>)
};

export default LoginPage;