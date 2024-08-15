import React, { useEffect, useState } from 'react';
import { auth, db } from './firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../componentscss/settings.css';

function Settings() {
    const [userDetails, setUserDetails] = useState(null);
    

    const fetchUserData = async () => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                console.log("User is logged in:", user.uid); // Debugging log
                const docRef = doc(db, "Users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    console.log("User data fetched:", docSnap.data()); // Debugging log
                    setUserDetails(docSnap.data());
                } else {
                    console.log("No such document! User not logged in");
                }
            }
        });
    };

    async function changePfp(newPfpUrl) {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    const userDocRef = doc(db, "Users", user.uid);
                    await updateDoc(userDocRef, { pfp: newPfpUrl });
                    toast.success("Profile Photo Changed Successfully!", { position: "top-center" });
                } catch (error) {
                    toast.error(`Error updating profile photo: ${error.message}`, { position: "top-center" });
                }
            }
        });
    }

    async function changeUsername(newUsername) {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    const userDocRef = doc(db, "Users", user.uid);
                    await updateDoc(userDocRef, { username: newUsername });
                    toast.success("Username changed successfully!", { position: "top-center" });
                } catch (error) {
                    toast.error(`Error updating username: ${error.message}`, { position: "top-center" });
                }
            }
        });
    }

    const handleSaveChanges = () => {
        const newPfpUrl = document.getElementById('profile-photo').value;
        const newUsername = document.getElementById('username').value;

        let updateNeeded = false;

        if (newPfpUrl && newPfpUrl !== userDetails.pfp) {
            changePfp(newPfpUrl);
            updateNeeded = true;
        }

        if (newUsername && newUsername !== userDetails.username) {
            changeUsername(newUsername);
            updateNeeded = true;
        }

        if (!updateNeeded) {
            toast.info("No changes detected", { position: "top-center" });
        }
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
        document.title = "Settings - Briefly";
        fetchUserData();
    }, []);

    return (
        <div className='settings-page-div'>
            <ToastContainer />
            {userDetails ? (
                <div className="settings-page">
                    <h1>Settings</h1>
                    <div className="settings-form">
                        <label htmlFor="username">Change Username</label>
                        <input type="text" id="username" name="username" placeholder="Enter new username" />

                        <label htmlFor="profile-photo">Change Profile Photo URL</label>
                        <input type="text" id="profile-photo" name="profile-photo" placeholder="Enter image URL" />

                        <button type="submit" className="save-button" onClick={handleSaveChanges}>Save Changes</button>
                    </div>
                </div>
            ) : (
                <h1>Not Logged in :C</h1>
            )}
        </div>
    );
}

export default Settings;
