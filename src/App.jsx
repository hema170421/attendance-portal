import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Admin from "./Pages/Admin";
import Login from "./Pages/Login";
import Dash from "./Pages/Dash";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dash" element={<Dash />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
