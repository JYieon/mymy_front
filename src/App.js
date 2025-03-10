import {Routes, Route} from "react-router-dom"
// import LoginForm from "./components/Auth/LoginForm";
// import ResetPassword from "./components/Auth/ResetPassword";
// import Find from "./components/Auth/Find";
// import FindPassword from "./components/Auth/FindPassword";
// import SignupForm from "./components/Auth/SignupForm";
import MainPage from "./Pages/MainPage";
import Layout from "./Pages/Common/Layout";
import PlanBoardPage from "./Pages/Board/PlanBoardPage";
import DiaryBoardPage from "./Pages/Board/DiaryBoardPage";
import BookmarkBoardPage from "./Pages/Board/BookmarkBoardPage";
import LoginPage from "./Pages/Account/LoginPage";
import SidebarCom from "./Components/Sidebar/SidebarCom";
import ResisterPage from "./Pages/Account/RegisterPage";
import FindAccountPage from "./Pages/Account/FindAccountPage";
import FindIdPage from "./Pages/Account/FindIdPage";
import FindPwPage from "./Pages/Account/FindPwPage";
import AccoutLayout from "./Pages/Account/AccountLayout";
import KakaoLogin from "./Components/Auth/KakaoLogin";
import KakaoCallback from "./Components/Auth/KakaoCallback";
import ChatRoom from "./Components/Auth/ChttingRoom";
import ChatList from "./Components/Auth/ChatList";
import ChatCreate from "./Components/Auth/ChatCreate";

function App() {
  return (
    <Routes>
      {/* <Route path="/login" element={<LoginForm />} /> 
      <Route path="/find" element={<Find />} /> 
      <Route path="/find_password" element={<FindPassword />} /> 
      <Route path="/reset_password" element={<ResetPassword />} /> 
      <Route path="/signup" element={<SignupForm />} /> */}

    <Route path="/kakao-test" element={<KakaoLogin />}/>
    <Route path="/auth/kakao/callback" element={<KakaoCallback />}/>
    <Route path="/chatting/:roomNum" element={<ChatRoom />}/>
    <Route path="/chatlist" element={<ChatList />}/>
    <Route path="/chat-create" element={<ChatCreate />}/>

    {/* 기본 레이아웃 (헤더) */}
      <Route path="/" element={<Layout />}>
      {/* 메인 페이지 */}
        <Route index element={<MainPage />}/>
        {/* 게시판 */}
        <Route path="/Board" element={<SidebarCom />}>
          <Route path="Plan" element={<PlanBoardPage />}/>
          <Route path="Diary" element={<DiaryBoardPage />}/>
          <Route path="Bookmark" element={<BookmarkBoardPage />}/>
        </Route>
        {/* 계정 (로그인,회원가입,계정 찾기) */}
        <Route path="/account" element={<AccoutLayout/>}>
          <Route path="login" element={<LoginPage />}/>
          <Route path="register" element={<ResisterPage />}/>
          {/* 계정 찾기 */}
          <Route path="find">
            <Route index element={<FindAccountPage/>}/>
            <Route path="id" element={<FindIdPage/>}/>
            <Route path="pw" element={<FindPwPage/>}/>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
