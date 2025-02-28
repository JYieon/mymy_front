import { Outlet } from "react-router-dom";
import "../../Css/TestLayout.css"

const TestLayout=()=>{
    return(<>
        <div className="TestLayout Shadow">
            <Outlet/>
        </div>
    </>)
};
export default TestLayout;