import { Outlet } from "react-router-dom";
import "../../Css/AccountLayout.css"
const AccoutLayout=()=>{
    return(
        <>
            <div className="AccountLayout Wrap">
                <Outlet/>
            </div>
        </>
    )
};

export default AccoutLayout;