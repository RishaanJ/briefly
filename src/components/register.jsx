import React, { useState, useEffect } from 'react';
import '../componentscss/register.css';
import Logo from "../assets/BRIEFLY.png"
import { ToastContainer, toast } from 'react-toastify';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import {auth, db} from './firebase';
import 'react-toastify/dist/ReactToastify.css';
import {setDoc, doc} from "firebase/firestore"
import { useNavigate } from 'react-router-dom';



function Register() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate("/main"); 
            }
        });
        return () => unsubscribe(); 
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await createUserWithEmailAndPassword(auth, email, password);
            const user = auth.currentUser;
            if(user){
                await setDoc(doc(db, "Users", user.uid), {
                    email: user.email,
                    username: username,
                    pfp: "https://braverplayers.org/wp-content/uploads/2022/09/braver-blank-pfp.jpg"

                })
                toast.success("Welcome to Briefly!", {position:"top-right"});
                window.location.href = "/main"
            }
            

        }catch(error){
            toast.error(error, {position: "top-right"})
        }
    };
    useEffect(() => {
        document.title = "Register - Briefly"
    })

    return (
        <>
            <img src={Logo}/>
            <div className="register-container">
                <h1>Register</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className="button" type="submit">Register</button>
                    <h1 className='already'>Already have an account? <a href={"/login"}className='already'>Login Here</a></h1>
                </form>
            </div>
            <ToastContainer/>
        </>
    );
}

export default Register;
