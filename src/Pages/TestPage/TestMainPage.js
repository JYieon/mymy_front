import { Link } from "react-router-dom";
import "../../Css/TestPage.css"

const TestMainPage=()=>{
    return(<>
        <div className="TestThumbnail">
            <img src="https://picsum.photos/700/500" alt="can't load img"/>
        </div>
        <Link to="../Test" className="TestStartBtn">시작하기</Link>
    </>)
};

export default TestMainPage;