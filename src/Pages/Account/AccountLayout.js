import { Outlet } from "react-router-dom";
import styles from "../../Css/AccountLayout.module.css"

const AccoutLayout=()=>{
    return(
        <>
            <div className={styles.AccountLayout}>
                <Outlet/>
            </div>
        </>
    )
};

export default AccoutLayout;