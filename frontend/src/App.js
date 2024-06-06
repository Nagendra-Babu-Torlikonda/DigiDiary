import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Navbar from './components/navbar/Navbar';
import Home from './components/home/Home';
import Diary from './components/diary/Diary';
import Expenses from './components/expenses/Expenses';
import Password from './components/passwords/Password';
import LoginPage from './components/loginpage/Login';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route exact path='/' element = {<Home/>} />
          <Route exact path='/diary' element = {<Diary/>} />
          <Route exact path='/expenses' element = {<Expenses/>} />
          <Route exact path='/passwords' element = {<Password/>} />
          <Route exact path='/loginpage' element = {<LoginPage/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
