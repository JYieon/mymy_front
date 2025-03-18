import { Outlet } from "react-router-dom";
import SidebarCom from "../Components/Sidebar/SidebarCom";

const SidebarPage=()=>{
    return(
        <>
        <SidebarCom/>
        {/* 게시판 표시되는 부분 */}
        <div className="ContentSection Shadow">
            <Outlet />
        </div>
        </>
    )
};

export default SidebarPage;
