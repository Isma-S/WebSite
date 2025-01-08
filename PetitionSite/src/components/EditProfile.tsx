import React, { useState, useEffect } from 'react';
import { Button, TextField, Paper, Typography } from '@mui/material';
import axios from 'axios';

const EditProfile = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [error, setError] = useState(null);
    const userId = parseInt(localStorage.getItem("userId") || '');
    const authToken = localStorage.getItem("authToken");
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (authToken !== null) {
            const getUserInfo = () => {
                axios.get(`http://localhost:4941/api/v1/users/${userId}`, {
                    headers: {
                        'X-Authorization': authToken,
                    }
                })
                    .then((response) => {
                        const { email, firstName, lastName } = response.data;
                        setEmail(email);
                        setFirstName(firstName);
                        setLastName(lastName);
                    })
                    .catch((error:any) => {
                        setErrorFlag(true);
                        setErrorMessage(error.response.statusText);
                    });
            };
            getUserInfo();
        }
    }, [authToken, userId]);

    const handleSubmit = async (e:any) => {
        e.preventDefault();

        try {
            const response = await axios.put(`http://localhost:4941/api/v1/users/${userId}`, {
                email,
                firstName,
                lastName,
                password,
                currentPassword
            });
            console.log('Profile updated successfully:', response.data);
        } catch (error:any) {
            setError(error.response.data.message);
        }
    };

    return (
        <Paper elevation={3} style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
            <Typography variant="h5" gutterBottom>Edit Profile</Typography>
            {error && <Typography variant="body1" color="error">{error}</Typography>}
            <form onSubmit={handleSubmit}>
                <TextField
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    margin="normal"
                />

                <TextField
                    type="password"
                    label="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    type="password"
                    label="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Button type="submit" variant="contained" color="primary">Save Changes</Button>
            </form>
        </Paper>
    );
};

export default EditProfile;
