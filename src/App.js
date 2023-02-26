import React, {useState, useEffect, useRef} from 'react';
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import './App.css';
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginForm from "./components/LoginForm";
import AdminDashboard from "./components/views/AdminDashboard";
function App() {
  const urlApi = "http://localhost:5454/api/";
  const [isLoggedIn,setIsLoggedIn] = useState(false);
  const token = useRef(``);
  useEffect(() => 
    {   
      // console.log(localStorage.getItem('token'));
      if (localStorage.getItem('token') != null) {
        token.current = localStorage.getItem('token');
        verifyUserToken(token.current);
      }
      else {
        // console.log("token is not in localStorage");
      }
    }
  ,[]);
  function verifyUserToken(token) {
    // console.log(token);
    fetch(urlApi+'adminDashboard',
      {
        method:"POST",
        headers: {
          "Authorization":token
        }
      }
    )
    .then((response)=> {
      if (response.status === 200) {
        // console.log("success");
        setIsLoggedIn(true);
      } 
      else {
        // console.log("failure");
        setIsLoggedIn(false);
      }
    })
  }
  return (
    <div className="App">
      <BrowserRouter>
      <Header/>
        <Routes>
          <Route className="container" path="/" element={isLoggedIn ? <Navigate replace to="/dashboard"/>: <LoginForm token={token} urlApi={urlApi} verifyUserToken={verifyUserToken}/>}></Route>
          <Route className="container" path="/dashboard" element={!isLoggedIn ? <Navigate replace to="/"/>: <AdminDashboard/>}></Route>
        </Routes>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
