import React, {useState, useEffect, useRef} from 'react';
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import './App.css';
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginForm from "./components/LoginForm";
import AdminDashboard from "./components/views/AdminDashboard";
  import Overview from './components/views/AdminDashboard-Overview.jsx';
    import Post from './components/views/Post';
  import CreatePost from './components/views/AdminDashboard-Create_Post.jsx';
import NotFound from './components/404';
function App() {
  const urlApi = "http://localhost:5454/api/";
  const [isLoggedIn,setIsLoggedIn] = useState(false);
  const token = useRef(``);
  // initialization life cycle -> checks if there is already a JWT token then verifies if valid else clears LocalStorage
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
          <Route className="container" path="/dashboard" element={!isLoggedIn ? <Navigate replace to="/"/>: <AdminDashboard token={token}/* verifyUserToken={verifyUserToken} setIsLoggedIn={setIsLoggedIn}*//> }>
            <Route index element={<Overview urlApi={urlApi}/>}></Route>
            <Route path="overview" element={<Overview urlApi={urlApi}/>}></Route>
            <Route path=":id" element={<Post urlApi={urlApi}></Post>}></Route>
            <Route path="createPost" element={<CreatePost urlApi={urlApi} setIsLoggedIn={setIsLoggedIn}/>}></Route>
          </Route>
          <Route className="container" path="/*" element={<NotFound/>}></Route>
        </Routes>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
