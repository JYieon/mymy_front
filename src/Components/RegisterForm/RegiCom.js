const RegiCom=({mySubmit,onChangeInput,onClick,FirstForm,SecondForm})=>{
    return (
        <>
            <form className="Register Form" onSubmit={mySubmit} >
                <div className="FirstForm" ref={FirstForm}>
                    <input type="text" name="Name" placeholder="이름" onChange={onChangeInput}/>
                    <input type="tel" name="Tel" placeholder="010-0000-0000" onChange={onChangeInput}/>
                    {/* 전화번호 입력 오류 메세지 */}
                    <div className="Warning Tel">
                        올바른 전화번호 양식이 아닙니다.
                    </div>
                    <input type="email" name="Email" placeholder="example@mail.com" onChange={onChangeInput}/>
                    {/* 이메일 입력 오류 메세지 */}
                    <div className="Warning Email">
                        올바른 이메일 양식이 아닙니다.
                    </div>
                    <input type="button"value="인증 번호 보내기"/>
                    {/* 인증 */}
                    <div className="Verfiy">
                        <input type="text" placeholder="인증번호"/>
                        <div className="Warning Verfiy">
                        인증번호가 틀렸습니다.
                        </div>
                    </div>
                    <input type="button"value="다음" onClick={onClick}/>
                </div>
                <div className="SecondForm" ref={SecondForm}>
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