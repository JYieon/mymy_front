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
import MyPage from "./component/mypage/mypage";
import AlarmSettings from "./component/alarm/alarmsettings";
import Alarm from "./component/alarm/alarm"
// import MyPage from "./Pages/Account/MyPage";
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
import AlarmList from "./component/alarm/alarmList";
import FollowingList from "./component/follow/FollowingList";
import FollowerList from "./component/follow/FollowerList";
import UserProfile from "./component/follow/UserProfile";
import MyPost from "./component/mypage/MyPost";
import MyComment from "./component/mypage/MyComment";

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
        <Route index element={<MainPage />}/>

        {/* 게시판 */}
        <Route path="/board" element={<SidebarCom />}>
          {/* <Route path="plan" element={<PlanBoardPage />}/>
          <Route path="diary" element={<DiaryBoardPage />}/>
          <Route path="bookmark" element={<BookmarkBoardPage />}/>
          <Route path="mate" element={<MateBoardPage />}/> */}

          {/* 게시글 리스트 */}
          <Route path="list" element={<BoardList />} />
          {/* 게시글 작성 페이지 */}
          <Route path="write" element={<BoardWrite />} />
          {/* 게시판 상세 페이지 추가 (query parameter 활용) */}
          <Route path="detail/:boardNo" element={<Detail />} />
          {/* 수정 폼 라우트 추가 */}
          <Route path="modifyForm/:boardNo" element={<BoardModify />} />
          {/* 북마크 리스트 추가 */}
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
        {/* 마이페이지 관련 라우트 */}
        <Route path="mypage" element={<SidebarCom />}>
          <Route path="/mypage/my_story/:userId" element={< MyPost />}/>
          <Route path="/mypage/my_reply/:userId" element={< MyComment  />}/>
          <Route path="/mypage/modify/:userId" element={<MyPage />}/> 
          {/* <Route path="/mypage/alarm" element={<AlarmSettings  />}/>    */}
          <Route path="/mypage/alarm/settings/:userId" element={<AlarmSettings  />}/>
          {/*  팔로잉 / 팔로워 목록 페이지 추가 */}
          <Route path="following/:userId" element={<FollowingList />} />
          <Route path="followers/:userId" element={<FollowerList />} />
        </Route>
        {/* 알림 목록 */}
        <Route path="/mypage/alarm/list/:userId" element={<AlarmList />} />

        {/* 특정 유저 프로필 페이지 */}
        <Route path="/profile/:userId" element={<UserProfile />} />

        {/* 타임라인 경로 변경 */} 
        <Route path="/timeline" element={<TimelinePage />} /> 
      </Route>
    </Routes>
  );
}

export default App;
