import React, { useEffect, useState, useRef } from 'react';
import { auth, db } from './firebase';
import { doc, updateDoc, getDoc, setDoc, collection, onSnapshot, query, orderBy, getDocs, deleteDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from "../assets/BRIEFLY.png";
import '../componentscss/main.css';
import ChatMessage from './chatmessage';
import EmojiPicker from 'emoji-picker-react';
import GroupChat from './groupchatsidebar';
import Filter from 'bad-words';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function Main() {
    const filter = new Filter();

    const [userDetails, setUserDetails] = useState(null);
    const [messages, setMessages] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [messageInput, setMessageInput] = useState('');
    const [groupChat, setGroupChat] = useState('Chat 1');
    const emojiButtonRef = useRef(null)
    const bottomRef = useRef(null);
    const [chatGroups, setChatGroups] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null); 
    const [dragging, setDragging] = useState(false); 
    const inputRef = useRef(null); 

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };
    
    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedImage(file); 
        }
    };

    if (inputRef.current) {
        inputRef.current.focus();
    }
    
    const handleDragLeave = (e) => {
        setDragging(false);
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted");
        const message = messageInput.trim();
    
        if (selectedImage) {
            try {
                console.log("Uploading image...");
                const imageUrl = await uploadImage(selectedImage);
                console.log("Image uploaded. URL:", imageUrl);
                await sendMessage(message, imageUrl);
            } catch (error) {
                console.error("Error sending image:", error);
            } finally {
                setSelectedImage(null);
                setMessageInput('');
            }
        } else {
            if (message) {
                console.log("Sending text message:", message);
                await sendMessage(message);
                setMessageInput('');
            }
        }
    };

    const fetchChatGroups = async () => {
        const chatsRef = collection(db, "Chats");
        const snapshot = await getDocs(chatsRef);
        const groupList = snapshot.docs.map(doc => doc.id);
        setChatGroups(groupList);
    };
    

    useEffect(() => {
        fetchChatGroups();
    }, []);
    function setTheme(newTheme) {
        document.body.className = `${newTheme}-theme`;
    }

    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    function handleEmojiClick(emojiObject) {
        setMessageInput((prevInput) => prevInput + emojiObject.emoji); 
    }
    function createGroupChat(){
        let name = alert("GroupChat Name")
        if(name == "Chats"){return true}
        
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
        if (!groupChat) return; 
    
        console.log(groupChat);
        const groupChatRef = doc(db, "Chats", groupChat);
    
        const unsubscribe = onSnapshot(groupChatRef, (docSnapshot) => {
            const data = docSnapshot.data();
            if (data && data.messages) {
                const messagesArray = Object.values(data.messages).sort((a, b) => a.REALtime - b.REALtime);
                setMessages(messagesArray);
            } else {
                setMessages([]); 
            }
        });
    
        return unsubscribe; 
    };
     
    useEffect(() => {
        console.log(`Loading ${groupChat}`)
        const unsubscribe = fetchMessages();
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [groupChat]);
    
    

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

    function selectGroupChat(chatTitle) {
        setGroupChat(chatTitle);
        console.log(groupChat)
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
    const uploadImage = async (file) => {
        const storage = getStorage();
        const imageRef = ref(storage, `images/${file.name}`);
        try {
            await uploadBytes(imageRef, file);
            const url = await getDownloadURL(imageRef);
            return url;
        } catch (error) {
            console.error("Error uploading image: ", error);
            throw error;
        }
    };
    
    async function sendMessage(message, imageUrl = null) {
        try {
            console.log("Sending message:", message, "Image URL:", imageUrl);
            console.log(message)
            const sanitizedMessage = filter.clean(message);
            const now = new Date();
            const timestamp = now.getTime();
    
            if (userDetails && auth.currentUser) {
                if (message.startsWith("!clear") && auth.currentUser.uid === "KNlXRhe561QKimrgCXn7gOjvJVb2") {
                    const parts = message.split(" ");
                    const numMessages = parseInt(parts[1], 10);
                    
                    if (isNaN(numMessages) || numMessages <= 0) {
                        toast.error("Invalid number of messages to clear", { position: "top-right" });
                        return;
                    }
    
                    const messagesRef = collection(db, "Chats", groupChat, "messages");
                    const q = query(messagesRef, orderBy("REALtime", "desc"));
                    const snapshot = await getDocs(q);
    
                    const messages = snapshot.docs
                        .map(doc => ({ id: doc.id, ...doc.data() }))
                        .sort((a, b) => b.REALtime - a.REALtime);
    
                    const messagesToDelete = messages.slice(0, numMessages);
    
                    console.log("Messages to delete:", messagesToDelete);
    
                    for (const msg of messagesToDelete) {
                        console.log("Attempting to delete message ID:", msg.id);
                        try {
                            await deleteDoc(doc(db, "Chats", groupChat, "messages", msg.id));
                            console.log("Successfully deleted message ID:", msg.id);
                        } catch (error) {
                            console.error("Error deleting message ID:", msg.id, "Error:", error);
                        }
                    }
    
                    toast.success(`${numMessages} messages cleared`, { position: "top-right" });
                } else {
                    const newMessage = {
                        id: generateUID(),
                        messageContent: sanitizedMessage,
                        imageUrl: imageUrl || null,
                        date: getCurrentTime(),
                        profilePic: userDetails.pfp,
                        senderUid: auth.currentUser.uid,
                        REALtime: timestamp
                    };
    
                    // Reference to the group chat document
                    const groupChatRef = doc(db, "Chats", groupChat);
    
                    // Update the `messages` map field inside the `groupChat` document
                    await updateDoc(groupChatRef, {
                        [`messages.${newMessage.id}`]: newMessage
                    });
    
                    console.log("Message sent successfully");
                }
            }
        } catch (error) {
            console.error("Error sending message:", error);
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
        const unsubscribe = onSnapshot(collection(db, "Chats", groupChat, "messages"), (snapshot) => {
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

    function switchTheme(theme){
        console.log('theme picked')
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
                                <div className='themes-button-container'>
                                    <button onClick={() => setTheme("")} className="themes-button">⚙️</button>
                                    <button onClick={() => setTheme("water")} className="themes-button">🌊</button>
                                    <button onClick={() => setTheme("cyber")} className="themes-button">💻</button>
                                    <button onClick={() => setTheme("forest")} className="themes-button">🌳</button>
                                </div>
                            </div>
                            <img onClick={() => window.location.href = "/settings"} src={userDetails.pfp} alt="Profile Pic" />
                        </div>
                    </div>
                    <div className='main-page-content-container'>
                        <div className='sidebar-main-page-content'>
                            <button onClick={() => console.log('create a groupchat')} className='button'>Make a Chatter</button>
                            {chatGroups.map(group => (
                                <GroupChat
                                    key={group}
                                    Title={group}
                                    onClick={() => selectGroupChat(group)}
                                    selected={groupChat === group}
                                />
                            ))}
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
                                        imageUrl={msg.imageUrl}
                                    />
                                ))}
                                <div ref={bottomRef} />
                            </div>
                            <form className={`send-smt ${dragging ? 'dragging' : ''}`} onDragOver={handleDragOver} onDrop={handleDrop} onDragLeave={handleDragLeave} onSubmit={handleSubmit}>
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
                                <div className='input-area'>
                                {selectedImage && (
                                        <div className="image-preview">
                                            <img src={URL.createObjectURL(selectedImage)} alt="Selected" />
                                        </div>
                                    )}
                                    <input
                                        type='text'
                                        value={messageInput}
                                        ref={inputRef}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        placeholder='Type a message or drag an image here...'
                                        className='text-input-send-smt'
                                    />
                                </div>
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
