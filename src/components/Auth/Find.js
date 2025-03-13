import { Link } from "react-router-dom"

const Find = () => {
    return(
        <div>
            <Link to="/find_id">아이디 찾기</Link>
            <Link to="/find_password">비밀번호 찾기</Link>
        </div>
    )
}

export default Find