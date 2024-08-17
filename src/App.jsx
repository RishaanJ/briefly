import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Register from './components/register';
import Login from './components/login'
import Main from './components/main'
import Error from './components/error'
import Logo from './assets/Briefly Logo Big.png'
import Settings from './components/settings'
import ui from './assets/ui.png'
import water from './assets/water.png'

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        {/* Define routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/main" element={<Main />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/error/:id" element={<Error/>}/>
        {/* Add a default route */}
        <Route
          path="*"
          element={
            <>
              <div className='top'>
                  <img className="brieflybiglogo" src={Logo}/>
                  <h1 className='tagline'>Connect. Collaborate. Conclude.</h1>

                  <button className="button-19" role="button">Join Up!</button>

                                  

              </div>
              <div className='UI'>
                  <img src={ui}/>
                  <div className='ui-info'>
                    <h1>User Interface: Unmatched</h1>
                    <p>Briefly’s UI is sleek and intuitive, combining modern aesthetics with seamless functionality. Its clean design and elegant color scheme make every interaction a visual delight.   </p>
                  </div>
              </div>
              <div className='UI' id="flipped">
                  <img src={water}/>
                  <div className='ui-info'>
                    <h1>Wata</h1>
                    <p>Briefly’s UI is sleek and intuitive, combining modern aesthetics with seamless functionality. Its clean design and elegant color scheme make every interaction a visual delight.   </p>
                  </div>
              </div>
              <div className='UI'>
                  <img src={ui}/>
                  <div className='ui-info'>
                    <h1>Forest</h1>
                    <p>Briefly’s UI is sleek and intuitive, combining modern aesthetics with seamless functionality. Its clean design and elegant color scheme make every interaction a visual delight.   </p>
                  </div>
              </div>
              <div className='UI' id="flipped">
                  <img src={ui}/>
                  <div className='ui-info'>
                    <h1>User Interface: Unmatched</h1>
                    <p>Briefly’s UI is sleek and intuitive, combining modern aesthetics with seamless functionality. Its clean design and elegant color scheme make every interaction a visual delight.   </p>
                  </div>
              </div>

            </>
          }
        />
      </Routes>
    </Router>
  );
}


export default App;
