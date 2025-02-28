import { Link } from "react-router-dom";
import "../../Css/TestPage.css"

const TestMainPage=()=>{
    return(<>
        <h1 className="TestTitle">나는 머선 고양이</h1>
        <div className="TestThumbnail">
            <img src="https://picsum.photos/700/500" alt="can't load img"/>
        </div>
        <Link to="../Test" className="TestStartBtn">시작하기</Link>
    </>)
};

export default TestMainPage;