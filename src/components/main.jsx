import React, { useEffect, useState } from 'react';
import {auth, db} from './firebase'
import {doc, getDoc} from 'firebase/firestore'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from "../assets/BRIEFLY.png"
import '../componentscss/main.css'


function Main(){
    const [userDetails, setUserDetails] = useState(null);

    const fetchUserData = async () => {
        auth.onAuthStateChanged(async(user)=>{
            console.log(user)
            const docRef = doc(db, "Users", user.uid)
            const docSnap = await getDoc(docRef)
            if(docSnap.exists()){
                setUserDetails(docSnap.data())
            } else{
                console.log("user not logged in")
            }

        })
    }

    async function handleLogout(){
        try{
            await auth.signOut()
            window.location.href = "/login"
            console.log("user logged out successfully");
        } catch(error){
            toast.error(error, {position: "top-right"})
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
                        <img src={Logo}/>
                        <div className='info'>
                            <h1>Hey {userDetails.username}</h1>
                            <button onClick={() => handleLogout()}>Logout</button>
                        </div>
                    </div>
                    <div className='main-page-content-container'>
                        <div className='sidebar-main-page-content'>
                            <div className='chats'>
                                <img src="https://images.pexels.com/photos/1207875/pexels-photo-1207875.jpeg?cs=srgb&dl=pexels-andre-mouton-1207875.jpg&fm=jpg" className='image-for-groupchat'/>
                                <h2>SBB 💗</h2>
                            </div>
                            <div className='chats'>
                                <img src="https://images.pexels.com/photos/1207875/pexels-photo-1207875.jpeg?cs=srgb&dl=pexels-andre-mouton-1207875.jpg&fm=jpg" className='image-for-groupchat'/>
                                <h2>JAZZ 💗</h2>
                            </div>
                            <div className='chats'>
                                <img src="https://images.pexels.com/photos/1207875/pexels-photo-1207875.jpeg?cs=srgb&dl=pexels-andre-mouton-1207875.jpg&fm=jpg" className='image-for-groupchat'/>
                                <h2>RNB 💗</h2>
                            </div>
                        </div>
                        <div className='main-page-content'>
                            
                        </div>
                    </div>
                    
                </>
            ) : (
                <h1>Not Logged In :C</h1>
            )}
        <ToastContainer/>
        </div>
    )
}

export default Main;