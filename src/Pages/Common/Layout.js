
import { Outlet } from "react-router-dom";
import style from "../../Css/Layout.module.css"
import HeaderCom from "../..//Components/Header/HeaderCom";
import { useState } from "react";

const Layout=()=>{
        const [headerDisplay, SetHeaderDisplay] = useState(true);
    
    return (
        <div className={style.ddd}>
            <HeaderCom headerDisplay={headerDisplay}/>
            <div className={style.LayoutWrap} >
                <Outlet context={SetHeaderDisplay}/>
            </div>

        </div>
    )
};

export default Layout;