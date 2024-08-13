import React, { useEffect, useState } from 'react';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from "../assets/BRIEFLY.png";
import '../componentscss/main.css';

function Main() {
    const [userDetails, setUserDetails] = useState(null);

    const fetchUserData = async () => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                const docRef = doc(db, "Users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserDetails(docSnap.data());
                } else {
                    console.log("User not logged in");
                }
            }
        });
    };

    async function handleLogout() {
        try {
            await auth.signOut();
            window.location.href = "/login";
            console.log("User logged out successfully");
        } catch (error) {
            toast.error(error.message, { position: "top-right" });
        }
    }

    useEffect(() => {
        document.title = "Main Page - Briefly";
        fetchUserData();
    }, []);

    return (
        <div className='main-page-div'>
            {userDetails ? (
                <>
                    <div className='top-part-of-main'>
                        <img src={Logo} alt="Logo" />
                        <div className='info'>
                            <h1>Hey {userDetails.username}</h1>
                            <button className="button" onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                    <div className='main-page-content-container'>
                        <div className='sidebar-main-page-content'>
                            <div className='chats'>
                                <img src="https://images.pexels.com/photos/1207875/pexels-photo-1207875.jpeg?cs=srgb&dl=pexels-andre-mouton-1207875.jpg&fm=jpg" className='image-for-groupchat' alt="Chat" />
                                <h2>SBB 💗</h2>
                            </div>
                            <div className='chats'>
                                <img src="https://images.pexels.com/photos/1207875/pexels-photo-1207875.jpeg?cs=srgb&dl=pexels-andre-mouton-1207875.jpg&fm=jpg" className='image-for-groupchat' alt="Chat" />
                                <h2>JAZZ 💗</h2>
                            </div>
                            <div className='chats'>
                                <img src="https://images.pexels.com/photos/1207875/pexels-photo-1207875.jpeg?cs=srgb&dl=pexels-andre-mouton-1207875.jpg&fm=jpg" className='image-for-groupchat' alt="Chat" />
                                <h2>RNB 💗</h2>
                            </div>
                        </div>
                        <div className='main-page-content'>
                            <div className='chat-messages'>
                                {/* Add chat message components here */}
                                <div className='message received'>
                                    <p><strong>User:</strong> Hello!</p>
                                </div>
                                <div className='message sent'>
                                    <p><strong>You:</strong> LOVEBOMBER BABY YOU TOOK MY HEART, YOU CRUSHED IT BADLY, TORE IT APART, YOU GOT ME TEXTING AND GOT ME WAITING, I FELL IN LOVE WITH YOU RIGHT FROM THE START UMM NANANA UMM NANAN UMM NANANNANA AN</p>
                                </div>
                            </div>
                            <div className='send-smt'>
                                <input type='text' placeholder='Type a message...' />
                                <button>
                                    <svg className='svg-button-send' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480l0-83.6c0-4 1.5-7.8 4.2-10.8L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <h1>Not Logged In :C</h1>
            )}
            <ToastContainer />
        </div>
    );
}

export default Main;
