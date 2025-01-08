import React, { useEffect, useState } from 'react';
import {Alert, AlertTitle, Button, Card, CardContent, FormHelperText, Paper, TextField} from '@mui/material';
import CSS from 'csstype';
import axios from "axios";
import NavigationBar from "./NavigationBar";
import {Link, useNavigate} from "react-router-dom";

const Register = () => {
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [showPassword, setShowPassword] = useState(false);
    const [postForm, setPostForm] = React.useState(false)
    const [authentication,setAuthentication] = useState(false);

    const [registerSuccess, setRegisterSuccess] = React.useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [imageType, setImageType] = useState<any | null>(null);
    const supportedImageTypes = ["image/jpeg", "image/png", "image/gif"];
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    const containerStyles: CSS.Properties = {
        display: 'grid',
        gap: '1rem',
    };

    const registerCardStyles: CSS.Properties = {
        display: "inline-block",
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '30%',
        height: '60%',
        margin: '20 auto',
        padding: "50px",
        textAlign: "center"
    };
    const handleChange = (event:any) => {
        const { name, value } = event.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    };
    let URL = "http://localhost:4941/api/v1"
    const handleSubmit = async (event: any) => {
        event.preventDefault();

        try {
            const response = await axios.post(`${URL}/users/register`, {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                password: user.password
            });


            if (response.status === 201) {
                setRegisterSuccess(true);


                localStorage.setItem('authToken', response.data.token);
                localStorage.setItem("userId",response.data.userId);
                const authToken = localStorage.getItem('authToken');
                // localStorage.removeItem('key');


            }
        } catch (error) {

            console.error('Registration failed:', error);

            setErrorMessage('Registration failed. Please try again.');
            setErrorFlag(true);
        }
    };


    return (
        <Paper elevation={3} style={{padding: '150px'}}>
            <NavigationBar />
            <Card sx={registerCardStyles}>
                <CardContent>
                    <h2>Register</h2>
                    <form onSubmit={handleSubmit}>
                        <div style={containerStyles}>
                            <TextField
                                label="First Name"
                                type="text"
                                name="firstName"
                                value={user.firstName}
                                onChange={handleChange}
                                fullWidth
                                required

                            />



                            <TextField
                                label="Last Name"
                                type="text"
                                name="lastName"
                                value={user.lastName}
                                onChange={handleChange}

                            />


                            <TextField
                                label="Email"
                                type="email"
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                                fullWidth
                                required
                            />


                            <TextField
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={user.password}
                                onChange={handleChange}
                                fullWidth
                                required
                            />

                            <TextField
                                label="Confirm Password"
                                type={showPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={user.confirmPassword}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                            <Button onClick={togglePasswordVisibility}>
                                {showPassword ? 'Hide Password' : 'Show Password'}
                            </Button>
                            {errors.password && <span>{errors.password}</span>}
                            <div style={{margin: '30px'}}>
                                <label htmlFor="heroImage">Profile image: </label>
                                <input
                                    type="file"
                                    id="heroImage"
                                    name="heroImage"
                                    accept="image/jpeg, image/png, image/gif"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <Button type="submit" variant="contained">
                            Register
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Paper>
    );
};

export default Register;
