import React, { useEffect, useState } from 'react';
import '../componentscss/register.css';
import Logo from "../assets/BRIEFLY.png"

function Login() {

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle registration logic here
        console.log({ email, username, password });
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
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            required
                        />
                    </div>
                    <button type="submit">Register</button>
                    <h1 className='already'>Don't have an account? <a className='already' href="/register">Register Here</a></h1>
                </form>
            </div>
        </>
    );
}

export default Login;
