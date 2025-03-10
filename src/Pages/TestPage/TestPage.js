// import { Link } from "react-router-dom";
import TestCon from "../../Components/Test/TestCon";
import styles from "../../Css/TestPage.module.css"

const TestPage=()=>{
    const TestStart=()=>{
        document.getElementById('StartPage').style.display="none";
        document.getElementById('MainPage').style.display="block";
        document.getElementById('1').style.display="block";
    };
        // const test=document.getElementById('Thumbnail').clientWidth;
        // console.log(test);

    // const Width=()=>{
        // console.log(document.getElementById('Thumbnail').offsetWidth)
        // return document.getElementById('Thumbnail').clientWidth;
    // };
  
    return(<>
        <div className={`${styles.TestLayout} Shadow`}>
            {/* 시작 페이지 */}
            <div className={styles.StartPage} id="StartPage">
                <h1 className={styles.TestTitle}>나와 함께 할 고양이는?</h1>
                        <div className={styles.TestThumbnail} id="Thumbnail">
                            <img src={`https://picsum.photos/500/400`} alt="can't load img"/>
                        </div>
                        <button className={styles.TestStartBtn} onClick={TestStart}>시작하기</button>
            </div>

            {/* 테스트 문제 페이지 */}
            <div className={styles.MainPage} id="MainPage">
                <TestCon/>
            </div>
        </div>
    </>)
};
export default TestPage;