import { createContext, useContext, useEffect, useState } from "react";

//로그인 상태 저장
// 로그인 여부를 다른 컴포넌트에서도 알 수 있게 해줌
const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);// true : 로그인 상태, flase : 미로그인
    const [user, setUser] = useState(null);//  로그인한 사용자 정보 상태

    //로그인 상태 확인 (로컬스토리지에서 불러오기)
    useEffect(() => {
        const storedUser = localStorage.getItem("user");//  로그인 정보 가져오기기
        if (storedUser) {
            setUser(JSON.parse(storedUser)); //  문자열을 원래 데이터로 변환해서 저장장
            setIsAuthenticated(true);//  true : 로그인 상태, flase : 미로그인
        }
    }, []);// 처음 화면이 열릴때 실행행

    return (
        //로그인 상태와 사용자 정보를 다른 컴포넌트에서도 사용할 수 있도록 저장 
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

//로그인 상태를 쉽게 가져옴옴
export const useAuth = () => useContext(AuthContext);
