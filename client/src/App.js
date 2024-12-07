import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import RegisterPage from "./components/CRegisterPage/RegisterPage";
import LoginPage from "./components/CLoginPage/LoginPage";
import ChatPage from "./components/CChatPage/ChatPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/chat" />} />
        <Route path="chat" element={<ChatPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
