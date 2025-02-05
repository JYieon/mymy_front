
import { useReducer } from "react";
import RegiCom from "./RegiCom";
import { initalState, reduser } from "../../Reducer/AccountRed";

const RegiCon=()=>{
    const [state,dispatch]=useReducer(reduser,initalState);

    const onChangeInput=(e)=>{
        const {value,name}=e.target;
        switch (name) {
            case "Tel":
                console.log("name :",name,"\nvalue :",value,"유효성 검사 :",/\d{11}|{0-9}/.test(value))
                console.log(document.getElementsByClassName('Tel').length)
                // /\d{11}|{0-9}/.test(value) ? "":"";
                break;
        
            default:
                break;
        }
       dispatch({type:'CHANGE_INPUT',value,name,form:"Register"});
    }

    const mySubmit=(e)=>{
        e.preventDefault(); //submit 눌렀을 때 페이지 넘어감 방지?
        console.log('stay that page:',e.target)
        console.log('e.target.class',e.target.className)
    
    }

    return(
        <RegiCom mySubmit={mySubmit} onChangeInput={onChangeInput}/>
    )
};

export default RegiCon;