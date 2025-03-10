import { Link, useLocation } from "react-router-dom";
import styles from "../../Css/TestPage.module.css"

const ResultPage=()=>{
    const location = useLocation();
    console.log(location.state)
    
    return(<div className={`${styles.TestLayout} Shadow`}>
        당신은 {location.state.result} 입니다.
        <div>context</div>
        <Link className="link" to="/test">다시하기</Link>
        <div> share btn</div>
    </div>)
};

export default ResultPage;