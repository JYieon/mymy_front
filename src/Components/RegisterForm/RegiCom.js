const RegiCom=({mySubmit,onChangeInput})=>{
    return (
        <>
            <form className="Register Form" onSubmit={mySubmit}>
                <input type="text" name="Name" placeholder="이름" onChange={onChangeInput}/>
                <input type="tel" name="Tel" placeholder="010-0000-0000" onChange={onChangeInput}/>
                <div className="Warning Tel">올바른 전화번호 양식이 아닙니다.</div>
                <input type="email" name="Email" placeholder="example@mail.com" onChange={onChangeInput}/>
                <div className="Warning Email">올바른 이메일 양식이 아닙니다.</div>
                <input type="submit" value="다음"/>
                {/* 인증 */}
                <div className="verify form">
                    <input type="text" placeholder="인증번호"/>
                    <input type="submit"value="인증"/>
                </div>
            </form>

            <form className="Register Form UserAccount">
                <button>이전</button>
                <input type="text" name="Id" placeholder="아이디"/>
                <input type="password" name="Pwd" placeholder="비밀번호"/>
                <input type="submit" value="다음"/>
            </form>
        </>
    )
};

export default RegiCom;