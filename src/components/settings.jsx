import React, { useEffect, useState } from 'react';
import { auth, db, storage } from './firebase'; 
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../componentscss/settings.css';

function Settings() {
    const [userDetails, setUserDetails] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null); 
    const [newUsername, setNewUsername] = useState(""); 
    const fetchUserData = async () => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                const docRef = doc(db, "Users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserDetails(docSnap.data());
                } else {
                    console.log("No such document! User not logged in");
                }
            }
        });
    };

    async function changePfp(newPfpUrl) {
        try {
            const userDocRef = doc(db, "Users", auth.currentUser.uid);
            await updateDoc(userDocRef, { pfp: newPfpUrl });
            toast.success("Profile Photo Changed Successfully!", { position: "top-center" });
        } catch (error) {
            toast.error(`Error updating profile photo: ${error.message}`, { position: "top-center" });
        }
    }

    async function changeUsername(newUsername) {
        try {
            const userDocRef = doc(db, "Users", auth.currentUser.uid);
            await updateDoc(userDocRef, { username: newUsername });
            toast.success("Username changed successfully!", { position: "top-center" });
        } catch (error) {
            toast.error(`Error updating username: ${error.message}`, { position: "top-center" });
        }
    }

    async function uploadImageAndSave() {
        if (!selectedImage) {
            toast.error("No image selected", { position: "top-center" });
            return;
        }

        const imageRef = ref(storage, `profilePhotos/${auth.currentUser.uid}/${selectedImage.name}`);
        try {
            await uploadBytes(imageRef, selectedImage);
            const downloadURL = await getDownloadURL(imageRef);
            changePfp(downloadURL); 
        } catch (error) {
            toast.error(`Error uploading image: ${error.message}`, { position: "top-center" });
        }
    }

    const handleSaveChanges = () => {
        let updateNeeded = false;

        if (selectedImage) {
            uploadImageAndSave();
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
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Enter new username"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                        />

                        <label htmlFor="profile-photo">Change Profile Photo</label>
                        <input
                            type="file"
                            id="profile-photo"
                            name="profile-photo"
                            accept="image/*"
                            onChange={(e) => setSelectedImage(e.target.files[0])}
                        />

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
