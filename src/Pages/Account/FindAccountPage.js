import { Link } from "react-router-dom";

const FindAccountPage=()=>{
    return(
        <>
            <Link to="id">아이디 찾기</Link>
            <Link to="pw">비번 찾기</Link>
        </>
    )
};

export default FindAccountPage;