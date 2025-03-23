import { Outlet, useOutletContext } from "react-router-dom";
import styles from "../../Css/AccountLayout.module.css"

const AccoutLayout=()=>{
            const headerDisplay=useOutletContext();
            headerDisplay(false);
    return(
        <>
            <div className={styles.AccountLayout}>
                <Outlet/>
            </div>
        </>
    )
};

export default AccoutLayout;