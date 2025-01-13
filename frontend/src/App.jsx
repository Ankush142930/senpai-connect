import { Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import ChatPage from './Pages/ChatPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" Component={HomePage} />
        <Route path="/chats" Component={ChatPage} />
      </Routes>
    </div>
  );
}

export default App;
