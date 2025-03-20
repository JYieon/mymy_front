import { Routes, Route } from "react-router-dom";
import MainPage from "./Pages/MainPage";
import Layout from "./Pages/Common/Layout";
import LoginPage from "./Pages/Account/LoginPage";
import ResisterPage from "./Pages/Account/RegisterPage";
import FindAccountPage from "./Pages/Account/FindAccountPage";
import FindIdPage from "./Pages/Account/FindIdPage";
import FindPwPage from "./Pages/Account/FindPwPage";
import AccoutLayout from "./Pages/Account/AccountLayout";

// import KakaoLogin from "./Components/Auth/KakaoLogin";

import KakaoCallback from "./Components/KakaoSync/KakaoCallback";
import ChatList from "./Components/Auth/ChatList";
import MyPage from "./component/mypage/mypage";
import AlarmSettings from "./component/alarm/alarmsettings";
import Alarm from "./component/alarm/alarm";
// import MyPage from "./Pages/Account/MyPage";
import TestPage from "./Pages/TestPage/TestPage";
import Detail from "./Components/Board/Detail";
import BoardWrite from "./Components/Board/BoardWrite";
import BoardList from "./Components/Board/BoardList";
import BoardModify from "./Components/Board/BoardModify";
import BookmarkList from "./Components/Board/BookmarkList";
import ResultPage from "./Pages/TestPage/ResultPage";
import NewChatPage from "./Pages/Chat/NewChatPage";
import Timeline from "./Components/Board/Timeline";
import MateBoardList from "./Components/Board/MateBoardList";
import MateBoardWrite from "./Components/Board/MateBoardWrite";
import MateBoardDetail from "./Components/Board/MateBoardDetail";
import MateBoardModify from "./Components/Board/MateBoardModify";
import KakaoMap from "./Components/Board/KakaoMap";
import GroupChatPage from "./Pages/Chat/GroupChatPagePage";
import AlarmList from "./component/alarm/alarmList";
import FollowingList from "./component/follow/FollowingList";
import FollowerList from "./component/follow/FollowerList";
import UserProfile from "./component/follow/UserProfile";
import MyPost from "./component/mypage/MyPost";
import MyComment from "./component/mypage/MyComment";
import { WebSocketProvider } from "./component/alarm/alramWebSocketProvider";
import SidebarPage from "./Pages/SidebarPage";
import BoardWritePage from "./Pages/Board/BoardWritePage";

function App() {
  return (
    <WebSocketProvider>{
      <Routes>
      {/* <Route path="/login" element={<LoginForm />} /> 
      <Route path="/find" element={<Find />} /> 
      <Route path="/find_password" element={<FindPassword />} /> 
      <Route path="/reset_password" element={<ResetPassword />} /> 
      <Route path="/signup" element={<SignupForm />} /> */}

      {/* <Route path="/kakao-test" element={<KakaoLogin />}/> */}
      <Route path="/auth/kakao/callback" element={<KakaoCallback />} />

      {/* 기본 레이아웃 (헤더) */}
      <Route path="/" element={<Layout />}>
        {/* 메인 페이지 */}
        <Route index element={<MainPage />} />

        <Route path="/board" element={<SidebarPage />}>
          {/* 게시글 리스트 */}
          <Route path="/board/list" element={<BoardList />} />
          {/* 게시글 작성 페이지 */}
          <Route path="/board/write" element={<BoardWritePage />} />

          {/* 게시판 상세 페이지 */}
          <Route path="/board/detail/:boardNo" element={<Detail />} />
          {/* 수정 폼 라우트 */}
          <Route path="/board/modifyForm/:boardNo" element={<BoardModify />} />
          {/* 북마크 리스트 */}
          <Route path="/board/bookmarkList" element={<BookmarkList />} />
        </Route>

        {/* 여행메이트 게시판 */}
        <Route path="/mateboard" element={<SidebarPage />}>
          <Route path="/mateboard/list" element={<MateBoardList />} />
          <Route path="/mateboard/write" element={<MateBoardWrite />} />
          <Route
            path="/mateboard/detail/:boardNo"
            element={<MateBoardDetail />}
          />
          <Route
            path="/mateboard/modify/:boardNo"
            element={<MateBoardModify />}
          />
        </Route>

        {/* 채팅 */}
        <Route path="/chat" element={<SidebarPage />}>
          <Route path="Create" element={<NewChatPage />} />
          <Route path="List" element={<ChatList />} />
        </Route>
        <Route path="groupChat/:roomNum" element={<GroupChatPage />} />
        <Route path="groupChat" element={<GroupChatPage />} />
        {/* 여행자 테스트 */}
        <Route path="/test" element={<TestPage />}></Route>
        <Route path="test/result" element={<ResultPage />} />

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
        {/* 마이페이지 관련 라우트 */}
        <Route path="mypage" element={<SidebarPage />}>
          <Route path="/mypage/my_story" element={<MyPost />} />
          <Route path="/mypage/my_reply" element={<MyComment />} />
          <Route path="/mypage/modify" element={<MyPage />} />

          {/* 알림 설정 테스트 페이지? */}

          {/* <Route path="/mypage/alarm" element={<AlarmSettings  />}/>    */}

          <Route
            path="/mypage/alarm/settings"
            element={<AlarmSettings />}
          />

          {/*  팔로잉 / 팔로워 목록 페이지 추가 */}
          <Route path="following" element={<FollowingList />} />
          <Route path="followers" element={<FollowerList />} />
        </Route>
        {/* 알림 목록 */}
        <Route path="/mypage/alarm/list" element={<AlarmList />} />

        {/* 특정 유저 프로필 페이지 */}
        <Route path="/profile/:userId" element={<UserProfile />} />

        {/* 타임라인 경로 */}
        <Route path="/timeline/:boardNo" element={<Timeline />} />
        <Route path="/timeline" element={<Timeline />} />

        {/* 카카오맵 */}
        <Route path="/map/:boardNo" element={<KakaoMap />} />
      </Route>
    </Routes>
    }</WebSocketProvider>
   
  );
}

export default App;
