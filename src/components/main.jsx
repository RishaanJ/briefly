import React, { useEffect, useState } from 'react';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from "../assets/BRIEFLY.png";
import '../componentscss/main.css';
import ChatMessage from './chatmessage'; // Import the ChatMessage component

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
    function getCurrentTime() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
      
        // Convert 24-hour time to 12-hour time
        hours = hours % 12 || 12; // Convert '0' hours to '12' for midnight and noon
      
        return `${hours}:${minutes} ${ampm}`;
    }
    function generateUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }
      


    async function sendMessage(message){
        console.log("message sent: " + message)
        if(userDetails){
            await setDoc(doc(db, "Chats", generateUID()), {
                messageContent: message,
                date: getCurrentTime(),
                profilePic: userDetails.pfp

            })


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
                            <div className='text-info'>
                                <h1>Hey, {userDetails.username}</h1>
                                <button className="button" onClick={handleLogout}>Logout</button>
                            </div>
                            <img onClick={() => window.location.href = "/settings"} src={userDetails.pfp}/>

                        </div>
                    </div>
                    <div className='main-page-content-container'>
                        <div className='sidebar-main-page-content'>
                            <div className='chats'>
                                <img src="https://ui-avatars.com/api/?name=SBB&background=313338&color=dcdee1&rounded=false&bold=true&uppercase=true" className='image-for-groupchat' alt="Chat" />
                                <h2>SBB 💗</h2>
                            </div>
                            <div className='chats'>
                                <img src="https://ui-avatars.com/api/?name=JAZZ&background=313338&color=dcdee1&rounded=false&bold=true&uppercase=true" className='image-for-groupchat' alt="Chat" />
                                <h2>JAZZ 💗</h2>
                            </div>
                            <div className='chats'>
                                <img src="https://ui-avatars.com/api/?name=RNB&background=313338&color=dcdee1&rounded=false&bold=true&uppercase=true" className='image-for-groupchat' alt="Chat" />
                                <h2>RNB 💗</h2>
                            </div>
                        </div>
                        <div className='main-page-content'>
                            <div className='chat-messages'>
                                <ChatMessage
                                    Text="Yo rishaan add me on fn"
                                    Pfp="https://scontent.cdninstagram.com/v/t51.2885-19/451213827_456969657195410_8203832684952343674_n.jpg?stp=dst-jpg_p100x100&_nc_cat=101&ccb=1-7&_nc_sid=fcb8ef&_nc_ohc=VspLKG4b-c0Q7kNvgGGUGrJ&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.cdninstagram.com&oh=00_AYA13mOwE8_csU5Ya_56IJ5qMiuUnXzbLJKa_AWrqcWYuA&oe=66C1FB83"
                                    Time="10:30 AM"
                                    sent={false} 
                                />
                                <ChatMessage
                                    Text="sweatyqxc"
                                    Pfp="https://scontent.cdninstagram.com/v/t51.2885-19/451213827_456969657195410_8203832684952343674_n.jpg?stp=dst-jpg_p100x100&_nc_cat=101&ccb=1-7&_nc_sid=fcb8ef&_nc_ohc=VspLKG4b-c0Q7kNvgGGUGrJ&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.cdninstagram.com&oh=00_AYA13mOwE8_csU5Ya_56IJ5qMiuUnXzbLJKa_AWrqcWYuA&oe=66C1FB83"
                                    Time="10:31 AM"
                                    sent={false}
                                />
                                <ChatMessage
                                    Text="laterr"
                                    Pfp="https://scontent.cdninstagram.com/v/t51.2885-19/452325340_2468852763315742_4989731620836503120_n.jpg?stp=dst-jpg_p100x100&_nc_cat=102&ccb=1-7&_nc_sid=fcb8ef&_nc_ohc=3XwgRaK0j8AQ7kNvgG6Jeuz&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.cdninstagram.com&oh=00_AYBBTI-1EGEl6ybcWtu49w_EBzDKjbaW3mimuky297y8nQ&oe=66C1C04D"
                                    Time="10:31 AM"
                                    sent={true}
                                />


                            </div>
                            <form className='send-smt' onSubmit={(e) => {
                                e.preventDefault();
                                const message = e.target[0].value.trim(); // Get the input value and trim any whitespace
                                if (message) {
                                    sendMessage(message); // Call your sendMessage function with the message
                                    e.target[0].value = ''; // Clear the input field if needed
                                }
                            }}>
                                <input type='text' placeholder='Type a message...' />
                                <button>
                                    <svg className='svg-button-send' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480l0-83.6c0-4 1.5-7.8 4.2-10.8L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z"/>
                                    </svg>
                                </button>
                            </form>

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
