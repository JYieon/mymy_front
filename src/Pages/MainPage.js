import { Link } from "react-router-dom";
import "../Css/MainPage.css"
const MainPage=()=>{
    return (
        <>
            <div>
                <div className="Top Section Gradient">
                    <div className="Text">MY WAY</div>
                    <div className="Text">MY TRIP</div>
                </div>
                <div className="Bottom Section">
                    <div className="GotoTest">
                    <Link to="/test">고양이 테스트</Link></div>
                    <div className="Lastest">최신 게시글</div>
                </div>

            </div>
        </>
    )
};

export default MainPage;