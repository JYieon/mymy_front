import { createContext, useContext, useEffect, useState } from "react";

//로그인 상태를 전역적으로 관리하는 Context 생성
const AuthContext = createContext();

//로그인 상태를 제공하는 Provider 컴포넌트, 로그인 여부와 사용자 정보를 상태로 관리
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);//  로그인 여부 상태
    const [user, setUser] = useState(null);//  로그인한 사용자 정보 상태

    //로그인 상태 확인 (로컬스토리지에서 불러오기)
    useEffect(() => {
        const storedUser = localStorage.getItem("user");//  로컬스토리지에서 사용자 정보 가져오기
        if (storedUser) {
            setUser(JSON.parse(storedUser)); //  JSON 파싱하여 상태 업데이트
            setIsAuthenticated(true);//  로그인 상태로 설정
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

//다른 컴포넌트에서 로그인 상태를 쉽게 사용하도록 Hook 제공
export const useAuth = () => useContext(AuthContext);
