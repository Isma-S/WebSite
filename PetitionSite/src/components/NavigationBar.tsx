import React, { useEffect, useState } from 'react';
import {AppBar, Toolbar, Typography, Button, Menu, MenuItem, Alert, AlertTitle, OutlinedInput} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import CSS from 'csstype';
import axios from 'axios';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import PetitionList from "./Petitions";
// import OutlinedInput from '@mui/material/OutlinedInput';

const NavigationBar: React.FC = () => {

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const navigate = useNavigate();

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const userId = localStorage.getItem("userId")

    const onLogout = () => {
        localStorage.removeItem('authToken');

        axios
            .post(`http://localhost:4941/api/v1/users/logout`,{}, {
                headers: {
                    'X-Authorization': authToken,
                },
            })
            .then(() => {
                console.log('Log out successfully')

            })
            .catch((error) => {
                setErrorFlag(true);
                setErrorMessage(error.response.statusText);
            });

    };

    const navigationStyles: CSS.Properties = {
        position: 'absolute',
        top: 0,
        left: 0,
        // zIndex: 2,
        background: 'radial-gradient(circle, #F4EEE0, #393646)',
    };



    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';

        document.head.appendChild(link);

        return () => {
            document.head.removeChild(link);
        };
    }, []);
    const [query, setQuery] = useState<string>("");

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    };

    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        window.location.href = `http://localhost:4942/petitions?q=${query}`;
    };
    const handleButtonClick = () => {
        window.location.href = `http://localhost:4942/petitions`;
    };
    const authToken = localStorage.getItem('authToken');
    const handleCreatePetitionClick = () => {
        // navigate('/petitions');
        window.location.href = `http://localhost:4942/petition/create`;
    };
    const handleMyProfileClick = () => {
        // navigate('/petitions');
        window.location.href = `http://localhost:4942/profile`;
    };
    const handleMyPetitionClick = () => {

        window.location.href = "http://localhost:4942/myPetitions";
    };
    return (
        <AppBar position="static" style={navigationStyles}>

            <Toolbar>
                <Typography variant="h3" component="div" style={{fontFamily: '', flexGrow: 2}}>
                    Petition supporter
                </Typography>
                <form onSubmit={handleSearch} style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    margin: "auto",
                    padding: "5px"
                }}>
                <OutlinedInput
                    placeholder="Search"
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    style={{ margin: "0px 5px", width: '400px', height: '60px' }}
                    inputProps={{
                        style: { paddingLeft: '0', color: "black"}
                    }}

                />

                <Button type="submit" variant="contained" sx={{ margin: "0px 5px" }}>Search</Button>
                </form>
                {errorFlag ?
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {errorMessage}
                    </Alert>
                    : ""}

                {/*<Button component={Link} to="/petitions" color="inherit">*/}
                {/*    Petitions*/}
                {/*</Button>*/}
                <Button onClick={handleButtonClick}  color="inherit">
                    Petitions
                </Button>


                {!authToken && (
                    <>
                        <Button component={Link} to="/register" color="inherit">
                            Sign up
                        </Button>
                        <Button component={Link} to="/login" color="inherit">
                            Login
                        </Button>
                    </>
                )}
                {authToken && (
                    <>
                        <Button onClick={handleCreatePetitionClick} color="inherit">
                            Create Petition
                        </Button>

                        <Button onClick={handleMyPetitionClick} color="inherit">
                            My Petitions
                        </Button>
                        <Button onClick={handleMyProfileClick} color="inherit">
                            My Profile
                        </Button>

                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                        >
                        </Menu>
                        <Button onClick={onLogout} component={Link} to="/" color="inherit">
                            Log out
                        </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default NavigationBar;
