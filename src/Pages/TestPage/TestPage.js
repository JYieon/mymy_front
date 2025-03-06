// import { Link } from "react-router-dom";
import TestCon from "../../Components/Test/TestCon";
import "../../Css/TestPage.css"

const TestPage=()=>{
    const TestStart=()=>{
        document.getElementById('StartPage').style.display="none";
        document.getElementById('MainPage').style.display="block";
        document.getElementById('1').style.display="block";
    };
    return(<>
        <div className="TestLayout Shadow">
            {/* 시작 페이지 */}
            <div className="Test StartPage" id="StartPage">
                <h1 className="TestTitle">나는 머선 고양이</h1>
                        <div className="TestThumbnail">
                            <img src="https://picsum.photos/700/500" alt="can't load img"/>
                        </div>
                        <button className="TestStartBtn" onClick={TestStart}>시작하기</button>
            </div>

            {/* 테스트 문제 페이지 */}
            <div className="Test MainPage" id="MainPage">
            <TestCon/>
            </div>

            {/* 테스트 결과 페이지 */}
            <div className="Test ResultPage" id="ResultPage">

            </div>
        </div>
    </>)
};
export default TestPage;