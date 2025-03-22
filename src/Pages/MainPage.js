import { Link, useOutletContext } from "react-router-dom";
import style from "../Css/MainPage.module.css"
const MainPage = () => {
    const headerDisplay = useOutletContext();
    headerDisplay(true);
    return (
        <div>
            <div className={`${style.Top} ${style.Section} ${style.Gradient}`}>
                <h1 className={style.Catchphrase}>
                    MY WAY<br />
                    MY TRIP
                </h1>
                <h3 className={style.Info}>
                    내 여행이니까 내 마음대로.<br />
                    바쁜 현대인을 위한 통합 여행 계획 플랫폼.
                </h3>
            </div>
            <div className={`${style.Bottom} ${style.Section}`}>
                <div className={style.TestLink}>
                    <Link to="/test">고양이 테스트</Link>
                </div>
                <Link className={style.Lastest} to="/">
                    <img src={`https://picsum.photos/300/200`} alt="can't load img" className={style.LastestPic} />
                </Link>
            </div>

        </div>
    )
};

export default MainPage;