import './App.css';
import Header from "./components/Header";
import Footer from "./components/Footer";

import LoginForm from "./components/LoginForm";

function App() {
  return (
    <div className="App">
      <Header/>
      <LoginForm/>
      <Footer/>
    </div>
  );
}

export default App;
