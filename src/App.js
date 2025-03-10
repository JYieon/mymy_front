import { Routes, Route } from "react-router-dom";
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
import MyPage from "./Pages/Account/MyPage";
import MateBoardPage from "./Pages/Board/MateBoardPage";
import TestPage from "./Pages/TestPage/TestPage";
import Detail from "./Components/Board/Detail";
import BoardWrite from "./Components/Board/BoardWrite";
import BoardList from "./Components/Board/BoardList";
import BoardModify from "./Components/Board/BoardModify";
import BookmarkList from "./Components/Board/BookmarkList";
import TimelinePage from "./Pages/TimelinePage";
import MateBoardList from "./Components/Board/MateBoardList";
import MateBoardWrite from "./Components/Board/MateBoardWrite";
import MateBoardDetail from "./Components/Board/MateBoardDetail";
import MateBoardModify from "./Components/Board/MateBoardModify";

import ResultPage from "./Pages/TestPage/ResultPage";
import NewChatPage from "./Pages/Chat/NewChatPage";
import GroupChatPage from "./Pages/Chat/GroupChatPagePage";
function App() {
  return (
    <Routes>
      {/* 기본 레이아웃 (헤더) */}
      <Route path="/" element={<Layout />}>
        {/* 메인 페이지 */}
        <Route index element={<MainPage />} />
        
      {/* 메인 페이지 */}
        <Route index element={<MainPage />}/>

        {/* 게시판 */}
        <Route path="/board" element={<SidebarCom />}>
          {/* <Route path="plan" element={<PlanBoardPage />} />
          <Route path="diary" element={<DiaryBoardPage />} />
          <Route path="bookmark" element={<BookmarkBoardPage />} />
          <Route path="mate" element={<MateBoardPage />}/> */}

          
        {/* 게시글 리스트 */}
          <Route path="list" element={<BoardList />} />
          {/* 게시글 작성 페이지 */}
          <Route path="write" element={<BoardWrite />} />
          {/* 게시판 상세 페이지 */}
          <Route path="/detail/:boardNo" element={<Detail />} />
          {/* 수정 폼 라우트 */}
         <Route path="modifyForm/:boardNo" element={<BoardModify />} />
          {/* 북마크 리스트 */}
         <Route path="bookmarkList" element={<BookmarkList />} />
        </Route>


         {/* 채팅 */}
        <Route path="/chat" element={<SidebarCom/>}>
          <Route path="newChat" element={<NewChatPage/>}/>
          <Route path="groupChat" element={<GroupChatPage/>}/>

        </Route>

        {/* 여행자 테스트 */}

        <Route path="/test" element={<TestPage/>}/>
        <Route path="/test/result" element={<ResultPage/>}/>

        {/* 여행메이트 게시판 */}
        <Route path="/mateboard/list" element={<MateBoardList />} />
        <Route path="/mateboard/write" element={<MateBoardWrite />} />
        <Route path="/mateboard/detail/:boardNo" element={<MateBoardDetail />} />
        <Route path="/mateboard/modify/:boardNo" element={<MateBoardModify />} />

        {/* 계정 (로그인, 회원가입, 계정 찾기) */}
        <Route path="/Account" element={<AccoutLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="myPage" element={<MyPage/>}/>
          <Route path="register" element={<ResisterPage />} />
          {/* 계정 찾기 */}
          <Route path="find">
            <Route index element={<FindAccountPage />} />
            <Route path="id" element={<FindIdPage />} />
            <Route path="pw" element={<FindPwPage />} />
          </Route>
        </Route>

        {/* 타임라인 경로 */}
        <Route path="/timeline" element={<TimelinePage />} />
      </Route>
    </Routes>
  );
}

export default App;
