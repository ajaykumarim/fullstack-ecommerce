import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';

import Register from './components/Register';
import Home from './components/Home';

function App() {
  const [userName, setUserName] = useState<string>('')
  const [currentUser, setCurrentUser] = useState(null)

  return (

    <Router>
      <Routes>
        <Route path="/" element={<Login userName={userName} setUserName={setUserName} setCurrentUser={setCurrentUser} />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Home" element={<Home currentUser={currentUser} />} />
        <Route path="/AdminPanel" element={<AdminPanel />} />
      </Routes>
    </Router>

  );
}

export default App;





