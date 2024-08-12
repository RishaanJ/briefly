import React, { useEffect, useState } from 'react';
import '../componentscss/register.css';
import Logo from "../assets/BRIEFLY.png"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {auth} from './firebase'

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await signInWithEmailAndPassword(auth, email, password)
            toast.success("Welcome back!", {position:"top-right"})

        }catch(error){
            toast.error(error, {position:"top-right"})

        }
    };
    useEffect(() => {
        document.title = "Login - Briefly"
    })
    return (

        <>
            <img src={Logo}/>
            <div className="register-container">
                <h1>Login</h1>
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
                    <h1 className='already'>Don't have an account? <a className='already' href="/register">Register Here</a></h1>
                </form>
            </div>
            <ToastContainer/>
        </>
    );
}

export default Login;
