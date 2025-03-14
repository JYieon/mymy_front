import {Routes, Route} from "react-router-dom"
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
// import TestMainPage from "./Pages/TestPage/TestMainPage";
// import TestLayout from "./Pages/TestPage/TestLayout";

// import KakaoLogin from "./Components/Auth/KakaoLogin";
import KakaoCallback from "./Components/KakaoSync/KakaoCallback";
import ChatRoom from "./Components/Auth/ChttingRoom";
import ChatList from "./Components/Auth/ChatList";
import ChatCreate from "./Components/Auth/ChatCreate";

import MyPage from "./Pages/Account/MyPage";
import MateBoardPage from "./Pages/Board/MateBoardPage";
import TestPage from "./Pages/TestPage/TestPage";
import Detail from "./Components/Board/Detail";
import BoardWrite from "./Components/Board/BoardWrite";
import BoardList from "./Components/Board/BoardList";
import BoardModify from "./Components/Board/BoardModify";
import BookmarkList from "./Components/Board/BookmarkList";
import TimelinePage from "./Pages/TimelinePage";
import ResultPage from "./Pages/TestPage/ResultPage";
import NewChatPage from "./Pages/Chat/NewChatPage";
import GroupChatPage from "./Pages/Chat/GroupChatPagePage";
import Timeline from "./Components/Board/Timeline";
import MateBoardList from "./Components/Board/MateBoardList";
import MateBoardWrite from "./Components/Board/MateBoardWrite";
import MateBoardDetail from "./Components/Board/MateBoardDetail";
import MateBoardModify from "./Components/Board/MateBoardModify";
import KakaoMap from "./Components/Board/KakaoMap";

function App() {
  return (
    <Routes>

      {/* <Route path="/login" element={<LoginForm />} /> 
      <Route path="/find" element={<Find />} /> 
      <Route path="/find_password" element={<FindPassword />} /> 
      <Route path="/reset_password" element={<ResetPassword />} /> 
      <Route path="/signup" element={<SignupForm />} /> */}

    {/* <Route path="/kakao-test" element={<KakaoLogin />}/> */}
    <Route path="/auth/kakao/callback" element={<KakaoCallback />}/>
    <Route path="/chatting/:roomNum" element={<ChatRoom />}/>
    <Route path="/chatlist" element={<ChatList />}/>
    <Route path="/chat-create" element={<ChatCreate />}/>

      {/* 기본 레이아웃 (헤더) */}
      <Route path="/" element={<Layout />}>
        {/* 메인 페이지 */}
        <Route index element={<MainPage />} />
        
        {/* 게시판 */}
        <Route path="/Board" element={<SidebarCom />}>
          <Route path="Plan" element={<PlanBoardPage />} />
          <Route path="Diary" element={<DiaryBoardPage />} />
          <Route path="Bookmark" element={<BookmarkBoardPage />} />
        </Route>
        
        {/* 게시글 리스트 */}
        <Route path="/board/list" element={<BoardList />} />
        {/* 게시글 작성 페이지 */}
        <Route path="/board/write" element={<BoardWrite />} />
        {/* 게시판 상세 페이지 */}
        <Route path="/board/detail/:boardNo" element={<Detail />} />
        {/* 수정 폼 라우트 */}
        <Route path="/board/modifyForm/:boardNo" element={<BoardModify />} />
        {/* 북마크 리스트 */}
        <Route path="/board/bookmarkList" element={<BookmarkList />} />

        {/* 여행메이트 게시판 */}
        <Route path="/mateboard/list" element={<MateBoardList />} />
        <Route path="/mateboard/write" element={<MateBoardWrite />} />
        <Route path="/mateboard/detail/:boardNo" element={<MateBoardDetail />} />
        <Route path="/mateboard/modify/:boardNo" element={<MateBoardModify />} />

         {/* 채팅 */}
         <Route path="/chat" element={<SidebarCom/>}>
          <Route path="newChat" element={<NewChatPage/>}/>
          <Route path="groupChat" element={<GroupChatPage/>}/>

        </Route>

        {/* 여행자 테스트 */}

        {/* 계정 (로그인, 회원가입, 계정 찾기) */}
        <Route path="/account" element={<AccoutLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<ResisterPage />} />
          {/* 계정 찾기 */}
          <Route path="find">
            <Route index element={<FindAccountPage />} />
            <Route path="id" element={<FindIdPage />} />
            <Route path="pw" element={<FindPwPage />} />
          </Route>
        </Route>

        {/* 타임라인 경로 */}
        <Route path="/timeline/:boardNo" element={<Timeline />} />

        {/* 카카오맵
        <Route path="/map" element={<KakaoMap />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
