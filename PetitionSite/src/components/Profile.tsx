import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardMedia, Paper, Typography } from '@mui/material';
import axios from "axios";
import { Link } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import CSS from "csstype";

const Profile = () => {
    const userId = parseInt(localStorage.getItem("userId") || '');
    const authToken = localStorage.getItem("authToken");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
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
                    .catch((error) => {
                        setErrorFlag(true);
                        setErrorMessage(error.response.statusText);
                    });
            };
            getUserInfo();
        }
    }, [authToken, userId]);

    const [ownerImage, setOwnerImage] = useState<string | null>(null);

    useEffect(() => {
        const URL = "http://localhost:4941/api/v1";
        const fetchOwnerImage = async () => {
            try {
                const response = await axios.get(`${URL}/users/${userId}/image`);
                setOwnerImage(response.data.url);
            } catch (error) {
                console.error('Error fetching owner image:', error);
            }
        };

        if (userId) {
            fetchOwnerImage();
        }
    }, [userId]);
    const navigationStyles: CSS.Properties = {
        // position: 'absolute',
        top: 0,
        left: 0,
        // zIndex: 2,
        background: 'linear-gradient(45deg,  #F4EEE0 30%, #FF8E53)',
    };
    return (
        <Paper elevation={3} style={{ paddingTop: "100px" }}>
            <NavigationBar />
            <Card style={navigationStyles} >
                <CardMedia
                    component="img"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        objectFit: "contain",
                        width: { xs: "25%", sm: "15%" },
                        height: { xs: "25%", sm: "15%" },
                        borderRadius: "50%",
                        margin: "auto",
                        textAlign: "center"
                    }}
                    image={ownerImage || "https://upload.wikimedia.org/wikipedia/commons/5/59/User-avatar.svg"}
                    alt="Profile image"
                />

                <CardContent sx={{ backgroundColor: 'linear-gradient(45deg, #FA6B9A 30%, #FF8E53)', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                    <Typography variant="h4" sx={{ color: 'blue', marginBottom: '10px', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
                        First name: {firstName}
                    </Typography>
                    <Typography variant="h4" sx={{ color: 'blue', marginBottom: '10px', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
                        Last Name: {lastName}
                    </Typography>
                    <Typography variant="h4" sx={{ color: 'blue', marginBottom: '20px', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
                        Email: {email}
                    </Typography>
                    <Button
                        component={Link}
                        to="/editProfile"
                        sx={{
                            backgroundColor: 'gray',
                            color: 'white',
                            ':hover': {
                                backgroundColor: 'darkgray',
                            },
                        }}
                    >
                        Edit my profile
                    </Button>
                </CardContent>


            </Card>
        </Paper>
    );
};

export default Profile;
