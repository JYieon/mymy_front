import { Link } from "react-router-dom";
import styles from "../Css/MainPage.module.css"
const MainPage=()=>{
    return (
        <>
            <div>
                <div className={`${styles.Top} ${styles.Section} ${styles.Gradient}`}>
                    <h1 className={styles.Catchphrase}>
                      MY WAY<br/>
                      MY TRIP
                    </h1>
                    <h3 className={styles.Info}>
                        내 여행이니까 내 마음대로.<br/>
                        바쁜 현대인을 위한 통합 여행 계획 플랫폼.
                    </h3>
                </div>
                <div className={`${styles.Bottom} ${styles.Section}`}>
                    <div className={styles.TestLink}>
                        <Link to="/test">고양이 테스트</Link>
                    </div>
                    <Link className={styles.Lastest} to="/">
                        <img src={`https://picsum.photos/300/200`} alt="can't load img" className={styles.LastestPic}/>
                    </Link>
                </div>

            </div>
        </>
    )
};

export default MainPage;