import {Routes, Route} from "react-router-dom"
import LoginForm from "./components/Auth/LoginForm";
import ResetPassword from "./components/Auth/ResetPassword";
import Find from "./components/Auth/Find";
import FindPassword from "./components/Auth/FindPassword";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} /> 
      <Route path="/find" element={<Find />} /> 
      <Route path="/find_password" element={<FindPassword />} /> 
      <Route path="/reset_password" element={<ResetPassword />} /> 
    </Routes>
  );
}

export default App;
