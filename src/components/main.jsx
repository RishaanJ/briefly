import React, { useEffect, useState, useRef } from 'react';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc, collection, onSnapshot, query, orderBy, getDocs, deleteDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from "../assets/BRIEFLY.png";
import '../componentscss/main.css';
import ChatMessage from './chatmessage';
import EmojiPicker from 'emoji-picker-react';

function Main() {
    const [userDetails, setUserDetails] = useState(null);
    const [messages, setMessages] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [messageInput, setMessageInput] = useState('');
    const emojiButtonRef = useRef(null)
    const bottomRef = useRef(null);

    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    function handleEmojiClick(emojiObject) {
        setMessageInput((prevInput) => prevInput + emojiObject.emoji); 
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiButtonRef.current && !emojiButtonRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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

    const fetchMessages = () => {
        const messagesRef = collection(db, "Chats");
        const q = query(messagesRef, orderBy("date")); // Order messages by time

        // Set up the real-time listener
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const updatedMessages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(updatedMessages);
        });

        return unsubscribe; // Return the unsubscribe function to stop listening when the component unmounts
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
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    function replaceWord(str, targetWord, replacementWord) {
        const regex = new RegExp(`\\b${targetWord}(?:a|er)?\\b`, 'gi');
        return str.replace(regex, replacementWord);
    }
    async function sendMessage(message) {
        function sanitizeMessage(msg) {
            const offensivePattern = /\b(n[\s'_\-]*i[\s'_\-]*g[\s'_\-]*g[\s'_\-]*a|n[\s'_\-]*i[\s'_\-]*g[\s'_\-]*g[\s'_\-]*r|n[\s'_\-]*i[\s'_\-]*g[\s'_\-]*g[\s'_\-]*e[\s'_\-]*r)\b/gi;
            return msg.replace(offensivePattern, 'ninja');
        }
        function replaceEmojis(message) {
            return message.replace(/:\w+:/g, (match) => emojiMap[match] || match);
        }
    
        const sanitizedMessage = sanitizeMessage(message);
        const finalMessage = replaceEmojis(sanitizedMessage);
    
        console.log("message sent: " + finalMessage);
    
        const now = new Date();
        const timestamp = now.getTime(); 
        if (userDetails && auth.currentUser) {
            if (message.startsWith("!clear") && auth.currentUser.uid == "KNlXRhe561QKimrgCXn7gOjvJVb2") {
                const parts = message.split(" ");
                const numMessages = parseInt(parts[1], 10);
        
                if (isNaN(numMessages) || numMessages <= 0) {
                    toast.error("Invalid number of messages to clear", { position: "top-right" });
                    return;
                }
        
                const messagesRef = collection(db, "Chats");
                const q = query(messagesRef, orderBy("REALtime", "desc"));
                const snapshot = await getDocs(q);
        
                const messages = snapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .sort((a, b) => b.REALtime - a.REALtime); 
        
                const messagesToDelete = messages.slice(0, numMessages);
        
                for (const msg of messagesToDelete) {
                    await deleteDoc(doc(db, "Chats", msg.id));
                }
        
                toast.success(`${numMessages} messages cleared`, { position: "top-right" });
            }
            await setDoc(doc(db, "Chats", generateUID()), {
                messageContent: finalMessage,
                date: getCurrentTime(),
                profilePic: userDetails.pfp,
                senderUid: auth.currentUser.uid,
                REALtime: timestamp
            });
        }
    }
    
    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const docRef = doc(db, "Users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserDetails(docSnap.data());
                } else {
                    console.log("User document does not exist in Firestore");
                }
            } else {
                setUserDetails(null);
            }
        });

        return () => unsubscribeAuth(); // Clean up the subscription
    }, []);


    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "Chats"), (snapshot) => {
            const sortedMessages = snapshot.docs
                .map((doc) => ({ id: doc.id, ...doc.data() }))
                .sort((a, b) => a.REALtime - b.REALtime); // Sort by timestamp
            setMessages(sortedMessages);
            scrollToBottom(); // Ensure the view scrolls to the latest message
        });
    
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);
        function scrollToBottom() {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }
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
                            <img onClick={() => window.location.href = "/settings"} src={userDetails.pfp} alt="Profile Pic" />
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
                                {messages.map((msg) => (
                                    <ChatMessage
                                        key={msg.id}
                                        Text={msg.messageContent}
                                        Pfp={msg.profilePic}
                                        Time={msg.date}
                                        sent={msg.senderUid === auth.currentUser.uid} 
                                    />
                                ))}
                                <div ref={bottomRef} />
                            </div>
                            <form className='send-smt' onSubmit={(e) => {
                                e.preventDefault();
                                const message = messageInput.trim(); 
                                if (message) {
                                    sendMessage(message); 
                                    setMessageInput(''); 
                                }
                            }}>
                                <div className='emoji-picker-container' ref={emojiButtonRef}>
                                    <svg onClick={toggleEmojiPicker} className="emojiPickerButton" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm177.6 62.1C192.8 334.5 218.8 352 256 352s63.2-17.5 78.4-33.9c9-9.7 24.2-10.4 33.9-1.4s10.4 24.2 1.4 33.9c-22 23.8-60 49.4-113.6 49.4s-91.7-25.5-113.6-49.4c-9-9.7-8.4-24.9 1.4-33.9s24.9-8.4 33.9 1.4zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/>
                                    </svg>
                                    {showEmojiPicker && (
                                        <div className='emoji-picker'>
                                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                                        </div>
                                    )}
                                </div>
                                <input type='text' value={messageInput} onChange={(e) => setMessageInput(e.target.value)} placeholder='Type a message...' />
                                <button className='buttton'>
                                    <svg className='svg-button-send' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480l0-83.6c0-4 1.5-7.8 4.2-10.8L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
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
