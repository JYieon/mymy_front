const RegiCom=({ formData, buttonRef, errors, buttonText, authTime, isAuthTimeOver, isVerified, showResendButton, handleInputChange, handleCheckId, handleSendAuthCode, handleSignup })=>{
    return (
        <>
            <form className="UserInfo" onSubmit={handleSignup}>
                <input
                    type="text"
                    name="Name"
                    value={formData.current.name}
                    placeholder="이름"
                    onChange={handleInputChange}
                />
                <input
                    type="tel"
                    name="Tel"
                    value={formData.current.phone}
                    pattern="[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}"
                    maxLength="13"
                    placeholder="010-0000-0000"
                    onChange={handleInputChange}
                />
                {/* <div className="Warning Tel">올바른 전화번호 양식이 아닙니다.</div> */}

                <input
                    type="email"
                    name="Email"
                    value={formData.current.email}
                    placeholder="이메일"
                    onChange={handleInputChange}
                />
                {/* <div className="Warning Email">올바른 이메일 양식이 아닙니다.</div> */}
                <input type="submit" value="다음"/>
                {/* 인증 */}
                <div className="verify form">
                    <input
                        type="text"
                        value={formData.current.authNum}
                        onChange={handleInputChange}
                        placeholder="인증번호"
                        disabled={isAuthTimeOver || buttonText === "발송"}
                    />
                    <input type="button" onClick={() => handleSendAuthCode(buttonText)} value={buttonText}/>
                    {/* 타이머 */}
                    {buttonText === "인증" && (
                        <div>
                            <p>남은 시간: {Math.floor(authTime / 60)}:{authTime % 60}</p>
                        </div>
                    )}

                    {/* 재전송 버튼 */}
                    {showResendButton && buttonText === "인증" && (
                        <div>
                            <span>메일이 가지 않았나요? </span>
                            <button type="button" onClick={() => handleSendAuthCode("재전송")}>
                                재전송
                            </button>
                        </div>
                    )}
                    {errors.authError && <div style={{ color: "red" }}>{errors.authError}</div>}
                    {isVerified && <div style={{ color: "green" }}>인증되었습니다.</div>}
                </div>
            </form>

            <form className="Register Form UserAccount" onSubmit={handleSignup}>
                <button>이전</button>
                <input
                    type="text"
                    name="Id"
                    value={formData.current.id}
                    placeholder="아이디"
                    onChange={handleInputChange}
                />
                <input
                    type="password"
                    name="Pwd"
                    value={formData.current.pwd}
                    placeholder="비밀번호 (8자 이상, 숫자 포함)"
                    onChange={handleInputChange}
                />
                {errors.pwdError && <div style={{ color: "red" }}>{errors.pwdError}</div>}
                <input
                    type="password"
                    name="Pwd2"
                    value={formData.current.pwd2}
                    placeholder="비밀번호 확인"
                    onChange={handleInputChange}
                />
                {errors.pwdMatchError && <div style={{ color: "red" }}>{errors.pwdMatchError}</div>}
                <input type="submit" ref={buttonRef} value="완료"/>
            </form>
        </>
    )
};

export default RegiCom;