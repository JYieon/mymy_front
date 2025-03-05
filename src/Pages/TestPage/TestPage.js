// import { Link } from "react-router-dom";
import TestCon from "../../Components/Test/TestCon";
import "../../Css/TestPage.css"

const TestPage=()=>{
    return(<>
        <div className="TestLayout Shadow">
            {/* 시작 페이지 */}
            <div className="Test StartPage">
                <h1 className="TestTitle">나는 머선 고양이</h1>
                        <div className="TestThumbnail">
                            <img src="https://picsum.photos/700/500" alt="can't load img"/>
                        </div>
                        <div className="TestStartBtn">시작하기</div>
            </div>

            {/* 테스트 문제 페이지 */}
            <div className="Test MainPage">
            <TestCon/>
            </div>

            {/* 테스트 결과 페이지 */}
            <div className="Test ResultPage">

            </div>
        </div>
    </>)
};
export default TestPage;