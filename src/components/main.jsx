import React, { useEffect, useState } from 'react';
import {auth, db} from './firebase'
import {doc, getDoc} from 'firebase/firestore'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



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
        <div>
            {userDetails ? (
                <>
                    <h1>Hey {userDetails.username}</h1>
                    <button onClick={() => handleLogout()}>Logout</button>
                </>
            ) : (
                <h1>Not Logged In :C</h1>
            )}
        <ToastContainer/>
        </div>
    )
}

export default Main;