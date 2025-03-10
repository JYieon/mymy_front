
import { Outlet } from "react-router-dom";
import "../../Css/Layout.css"
import HeaderCom from "../..//Components/Header/HeaderCom";
import Searchbar from "../../Components/Searchbar/SearchbarCom";
// import FooterCom from "../../Components/Footer/FooterCom";

const Layout=()=>{
    return (
        <>
            <HeaderCom/>
            <Searchbar/>
            <div className="LayoutWrap">
                <Outlet/>
            </div>
            {/* <FooterCom/> */}
        </>
    )
};

export default Layout;