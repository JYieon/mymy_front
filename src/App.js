import {Routes, Route} from "react-router-dom"
import MyPage from "./component/mypage/mypage";

function App() {
  return (
    <Routes>
      {<Route path="/mymy/mypage" element={<MyPage />} />}
    </Routes>
  );
}

export default App;
