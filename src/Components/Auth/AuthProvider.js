import { createContext, useContext, useEffect, useState } from "react";
// import AuthApi from "../api/AuthApi"; // 사용자 정보 가져오는 API
import ChatApi from "../../api/ChatApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("accessToken"); // ✅ JWT 토큰 가져오기
        if (token) {
            ChatApi.getUserInfo() // ✅ 서버에서 사용자 정보 가져오기
                .then(res => {
                    setUser(res.data);
                    setIsAuthenticated(true);
                })
                .catch(error => {
                    if(error.res && error.res.status === 401){
                        localStorage.removeItem("accessToken"); // 토큰이 만료되었으면 삭제
                        setIsAuthenticated(false);
                        alert("세션이 만료되었습니다. 다시 로그인 해주세요.")
                        window.location.href = "/login"
                    }
                    
                });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
