import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import axios from "axios";
import { Link } from "react-router-dom";
import NavigationBar from "./NavigationBar";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailChange = (event:any) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event:any) => {
        setPassword(event.target.value);
    };
    let URL = "http://localhost:4941/api/v1"

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${URL}/users/login`, {
                email: email,
                password: password,
            });
            console.log(email);
            console.log(response);

            if (response.status === 200) {
                localStorage.setItem('authToken', response.data.token);
                localStorage.setItem("userId", response.data.userId);
                window.location.href = `http://localhost:4942/petitions`;
                console.log('Login successful! Redirecting...');
            }
        } catch (error) {
            console.log(email);
            console.log(password);
            console.error('Login failed:', error);
        }
    };

    return (
        <div>
            <NavigationBar />
            <div>
                <h2>Login</h2>
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    fullWidth
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    fullWidth
                    required
                />
                <Button variant="contained" onClick={handleLogin}>Login</Button>
            </div>
        </div>
    );
};

export default Login;
