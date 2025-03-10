import { initalState, reduser } from "../../Reducer/AccountRed";
import { useReducer, useRef } from "react";
import styles from "../../Css/AccountLayout.module.css"

const RegiCom=()=>{

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

    const FirstForm=useRef(null);
    const SecondForm=useRef(null);
    
    const onClick=()=>{
        if (SecondForm.current.style.display==="none")
            {
                SecondForm.current.style.display="block";
                FirstForm.current.style.display="none";
            }
        else{
            SecondForm.current.style="display:none;"
            FirstForm.current.style.display="block";

        };

         
    }

    const mySubmit=(e)=>{
        e.preventDefault(); //submit 눌렀을 때 페이지 넘어감 방지?
        console.log('stay that page:',e.target)
        console.log('e.target.class:',e.target.className)
    
    }
    return (
        <>
            <form className={styles.form} onSubmit={mySubmit} >
                <div className={styles.FirstForm} ref={FirstForm}>
                    <input type="text" name="Name" placeholder="이름" onChange={onChangeInput}/>
                    <input type="tel" name="Tel" placeholder="010-0000-0000" onChange={onChangeInput}/>
                    {/* 전화번호 입력 오류 메세지 */}
                    <div className={styles.Warning}>
                        올바른 전화번호 양식이 아닙니다.
                    </div>
                    <input type="email" name="Email" placeholder="example@mail.com" onChange={onChangeInput}/>
                    {/* 이메일 입력 오류 메세지 */}
                    <div className={styles.Warning}>
                        올바른 이메일 양식이 아닙니다.
                    </div>
                    
                    <input type="button"value="인증 번호 보내기"/>
                    <div className="Verfiy">
                        <input type="text" placeholder="인증번호"/>
                        <div className={styles.Warning}>
                        인증번호가 틀렸습니다.
                        </div>
                    </div>
                    <input type="button"value="다음" onClick={onClick}/>
                </div>
                <div className={styles.SecondForm} ref={SecondForm}>
                    <input type="button"value="이전" onClick={onClick}/>
                    <input type="text" name="Id" placeholder="아이디"/>
                    <input type="password" name="Pwd" placeholder="비밀번호"/>
                    <input type="password" name="PwdCheck" placeholder="비밀번호 확인"/>
                    <input type="submit" value="완료"/>
                </div>
            </form>
        </>
    )
};

export default RegiCom;