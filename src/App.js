import {React,useState} from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css';
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginForm from "./components/LoginForm";
  
function App() {
  let isTrue = false;
  return (
    <div className="App">
      <Header/>
      <LoginForm/>
      <Footer/>
    </div>
  );
}

export default App;
