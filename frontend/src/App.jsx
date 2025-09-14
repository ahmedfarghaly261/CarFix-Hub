import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home/Home";
import NavBar from "./components/nav-bar/nav";
import Footer from "./components/footer/footer";
import SignIn from "./pages/auth/sign-in/sign-in";
import Login from "./pages/auth/login/logIn";

function App() {
  return (
    <>
      <div className="">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/nav" element={<NavBar />} />
            <Route path="/footer" element={<Footer />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
