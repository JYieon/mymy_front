
import { Outlet } from "react-router-dom";
import styles from "../../Css/Layout.module.css"
import HeaderCom from "../..//Components/Header/HeaderCom";

const Layout=()=>{
    return (
        <>
            <HeaderCom/>
            <div className={styles.LayoutWrap}>
                <Outlet/>
            </div>

        </>
    )
};

export default Layout;