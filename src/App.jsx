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
import forest from './assets/forest.png'
import cyber from './assets/cyber.png'
import pfp from './assets/pfp.png'
import pfp2 from './assets/utkarsh.png'
import pfp3 from './assets/pfp3.png'
import pfp4 from './assets/pfp4.png'

function App() {
  const [count, setCount] = useState(0);
  const marqueeMessage = '🚨 UPDATE: IMAGE MESSAGING ';
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
              <div className='toppp'>
                  <marquee behavior="scroll" direction="left" scrollamount="10" loop="infinite">
                    {[...Array(20)].map((_, i) => (
                      <span key={i}>{marqueeMessage}</span>
                    ))}
                  </marquee>
                  <img className="brieflybiglogo" src={Logo}/>
                  <h1 className='tagline'>Connect. Collaborate. Conclude.</h1>

                  <button onClick={() => window.location.href = "/register"} className="button-19" role="button">Join Up!</button>

                                  

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
                    <h1>Watah</h1>
                    <p>Briefly’s watah theme is refreshing and calming, with soothing blue tones that evoke a sense of tranquility. The design's fluidity and gentle gradients create a serene and engaging user experience.</p>
                  </div>
              </div>
              <div className='UI'>
                  <img src={forest}/>
                  <div className='ui-info'>
                    <h1>Forest</h1>
                    <p>Briefly’s forest theme immerses you in nature with its rich green hues and earthy textures. The calming palette and organic design elements offer a grounded and rejuvenating atmosphere.</p>
                  </div>
              </div>
              <div className='UI' id="flipped">
                  <img src={cyber}/>
                  <div className='ui-info'>
                    <h1>Cyber</h1>
                    <p>Briefly’s cyber theme dazzles with its sleek black and green terminal-style aesthetics. The high-contrast design and futuristic look deliver a bold, tech-savvy vibe that’s both striking and functional.</p>
                  </div>
              </div>
              <h1 className='whatruwaitingfor'>Meet the team!</h1>
              <div className='team'>
                <div className='member'>
                  <img src={pfp} className='pfp'/>
                  <h1>Rishaan James</h1>
                  <h2>"The one and only Developer"</h2>
                  <p>6'5 baller <br/> nba athlete <br/> FAANG dev</p>
                </div>
                <div className='team-part-two'>
                  <div className='member'>
                    <img src={pfp2} className='pfp'/>
                    <h1>Mr.Rajesh</h1>
                    <h2>"Ideas and Testing"</h2>
                    <p>i drink champagne <br/> sabrina carpenter</p>
                  </div>
                  <div className='member'>
                    <img src={pfp3} className='pfp'/>
                    <h1>Ronnie</h1>
                    <h2>"Ideas and Testing"</h2>
                    <p>God did</p>
                  </div>
                  <div className='member'>
                    <img src={pfp4} className='pfp'/>
                    <h1>Bihaan</h1>
                    <h2>"carti glazing"</h2>
                    <p>haii i wub mf doom :3</p>
                  </div>
                </div>

              </div>

              <h1 className='whatruwaitingfor'>So what are you waiting for?</h1>
              <button onClick={() => window.location.href = "/register"} class="button-71" role="button">Join Up!</button>

              <footer>
                <h1>Made with ❤️ by rishaan jain</h1>
              </footer>
            </>
          }
        />
      </Routes>
    </Router>
  );
}


export default App;
