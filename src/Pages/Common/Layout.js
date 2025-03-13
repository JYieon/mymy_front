
import { Outlet } from "react-router-dom";
import styles from "../../Css/Layout.module.css"
import HeaderCom from "../..//Components/Header/HeaderCom";
import Searchbar from "../../Components/Searchbar/SearchbarCom";
const Layout=()=>{
    return (
        <>
            <HeaderCom/>
            {/* <Searchbar/> */}
            <div className={styles.LayoutWrap}>
                <Outlet/>
            </div>

        </>
    )
};

export default Layout;