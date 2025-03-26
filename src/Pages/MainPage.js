import { Link, useOutletContext } from "react-router-dom";
import style from "../Css/MainPage.module.css"
const MainPage = () => {
    const headerDisplay = useOutletContext();
    headerDisplay(true);
    return (
        <div>
            <div className={`${style.Top} ${style.Section} ${style.Gradient}`}>
                <div className={style.Catchphrase}>
                    MY WAY<br />
                    MY TRIP
                </div>
                <div className={style.Info}>
                    내 여행이니까 내 마음대로.<br />
                    바쁜 현대인을 위한 통합 여행 계획 플랫폼.
                </div>
            </div>
            <div className={`${style.Bottom} ${style.Section}`}>
                    <Link to="/test" className={style.TestLink}/>
                <Link className={style.Lastest} to="/" />
            </div>

        </div>
    )
};

export default MainPage;