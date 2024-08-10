import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Register from './components/register';
import Login from './components/login'
import Main from './components/main'
import Logo from './assets/BRIEFLY.png'

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        {/* Define routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/main" element={<Main />} />
        {/* Add a default route */}
        <Route
          path="*"
          element={
            <>
              <img src={Logo}/>
              <h1>Welcome to Briefly</h1>
              <h3>Connect. Collaborate. Conclude.</h3>
              <p>Streamline your work communications with ease. Briefly simplifies team conversations with intuitive, focused messaging</p>
              <button onClick={() => window.location.href = "/register"} className="hopin box">Hop in!</button>
            </>
          }
        />
      </Routes>
    </Router>
  );
}


export default App;
