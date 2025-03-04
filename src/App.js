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
import MyPage from "./Pages/Account/MyPage";
import TestMainPage from "./Pages/TestPage/TestMainPage";
import TestLayout from "./Pages/TestPage/TestLayout";
import MateBoardPage from "./Pages/Board/MateBoardPage";
import WritePage from "./Pages/WritePage";

function App() {
  return (
    <Routes>
    {/* 기본 레이아웃 (헤더) */}
      <Route path="/" element={<Layout />}>
      {/* 메인 페이지 */}
        <Route index element={<MainPage />}/>

        {/* 게시판 */}
        <Route path="/board" element={<SidebarCom />}>
          <Route path="plan" element={<PlanBoardPage />}/>
          <Route path="diary" element={<DiaryBoardPage />}/>
          <Route path="bookmark" element={<BookmarkBoardPage />}/>
          <Route path="mate" element={<MateBoardPage />}/>
        </Route>

        {/* 글작성 */}
        <Route path="/write" element={<WritePage />}/>

        {/* 여행자 테스트 */}
        {/* 뭔가 단어선정이 애매한 느낌? 나중에 대화 */}
        <Route path="/TravellerTest" element={<TestLayout/>}>
          <Route path="main" element={<TestMainPage/>}/>
          <Route path="test" element={<DiaryBoardPage />}/>
          <Route path="results" element={<BookmarkBoardPage />}/>
        </Route>

        {/* 계정 (로그인,회원가입,계정 찾기) */}
        <Route path="/Account" element={<AccoutLayout/>}>
          <Route path="login" element={<LoginPage />}/>
          <Route path="myPage" element={<MyPage/>}/>
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
