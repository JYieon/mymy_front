
import { Outlet } from "react-router-dom";
import "../../Css/Layout.css"
import HeaderCom from "../..//Components/Header/HeaderCom";
import Searchbar from "../../Components/Searchbar/SearchbarCom";
const Layout=()=>{
    return (
        <>
            <HeaderCom/>
            {/* <Searchbar/> */}
            <div className="LayoutWrap">
                <Outlet/>
            </div>

        </>
    )
};

export default Layout;