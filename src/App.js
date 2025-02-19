import {Routes, Route} from "react-router-dom"
import LoginForm from "./components/Auth/LoginForm";
import ResetPassword from "./components/Auth/ResetPassword";
import Find from "./components/Auth/Find";
import FindPassword from "./components/Auth/FindPassword";
import SignupForm from "./components/Auth/SignupForm";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} /> 
      <Route path="/find" element={<Find />} /> 
      <Route path="/find_password" element={<FindPassword />} /> 
      <Route path="/reset_password" element={<ResetPassword />} /> 
      <Route path="/signup" element={<SignupForm />} />
    </Routes>
  );
}

export default App;
