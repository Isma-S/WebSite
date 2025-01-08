import React from 'react';
import NavigationBar from './NavigationBar';
import { Paper, Typography } from '@mui/material';
import CSS from 'csstype';
const Home = () => {
    const containerStyles: CSS.Properties = {
        position: 'relative',
    };

    const card: CSS.Properties = {

        display: 'block',
        width: '100%',
        height: '100vh',
        position: 'relative',
    };

    const textStyles: CSS.Properties = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1,
        textAlign: 'center',
        fontFamily: 'Roboto, cursive',
        fontWeight: 400,
        fontSize: '3rem',
    };
    return (
        <div >
            {/*<NavigationBar />*/}
            <Paper elevation={3} style={card}>
                <NavigationBar />
                <div style={textStyles}>
                    <Typography variant="h5" color="text.secondary" style={{ fontFamily: 'Roboto, cursive' }}>
                        <p>Petitions</p>
                    </Typography>
                </div>
            </Paper>
        </div>
    );

}
export default Home;