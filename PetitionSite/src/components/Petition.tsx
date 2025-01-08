import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {Typography, Grid, Card, CardContent, CardMedia, Avatar, Box} from '@mui/material';
import NavigationBar from "./NavigationBar";
import {isNumberObject} from "node:util/types";

const Petition = () => {
    const { id } = useParams<{ id: string }>();
    const petitionId: number | undefined = parseInt(id || '');

    const [petition, setPetition] = useState<any>(null);

    useEffect(() => {
        fetchPetitionDetails();
    }, []);

    const fetchPetitionDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:4941/api/v1/petitions/${id}`);
            console.log(response.data)
            setPetition(response.data);
        } catch (error) {
            console.error('Error fetching petition details:', error);
        }
    };

    const getOwnerImage = (ownerId: number) => {
        console.log(petition.ownerId)
        return (URL +  '/users/' + petition.ownerId + '/image')

    }
    const getFileImagePath = (petitionId: number) => {
        return `http://localhost:4941/api/v1/petitions/${petitionId}/image`;
    };

    return (
        <Grid container justifyContent="center" sx={{ p: 4 }} style={{ paddingTop: "100px" }}>
            {/* NavigationBar outside of the main grid */}
            <Box component="nav" sx={{ marginBottom: 4 }}>
                <NavigationBar />
            </Box>
            <Grid item xs={12} md={8} sx={{ maxWidth: '100%', borderRadius: 2, overflow: 'hidden', boxShadow: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {petition && (
                    <Card sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                            <CardMedia
                                component="img"
                                sx={{
                                    objectFit: "cover",
                                    width: 500,
                                    height: 300,
                                    borderRadius: '10px',
                                }}
                                src={getFileImagePath(petitionId)}
                                alt="Petition image"
                            />
                            <CardContent sx={{ flexGrow: 1, padding: 2 }}>
                                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    {petition.title}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Creation Date: {petition.creationDate}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Description: {petition.description}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Owner: {petition.ownerFirstName} {petition.ownerLastName}
                                </Typography>
                                <CardMedia
                                    component="img"
                                    sx={{
                                        objectFit: "cover",
                                        width: 100,
                                        height: 100,
                                        borderRadius: '50%',
                                    }}
                                    src={getOwnerImage(petition.ownerId)}
                                    alt="Owner image"
                                />
                                <Typography variant="body1" gutterBottom>
                                    Number of Supporters: {petition.numberOfSupporters}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Total Money Raised: {petition.totalMoneyRaised}
                                </Typography>
                                <Typography variant="h6" gutterBottom>
                                    List of Support Tiers:
                                </Typography>
                                {petition.supportTiers.map((tier:any) => (
                                    <Box key={tier.id} sx={{ mb: 2 }}>
                                        <Typography variant="subtitle1">{tier.title}</Typography>
                                        <Typography variant="body2">Description: {tier.description}</Typography>
                                        <Typography variant="body2">Cost: {tier.cost}</Typography>
                                    </Box>
                                ))}
                            </CardContent>
                        </Box>
                    </Card>
                )}
            </Grid>
        </Grid>
    );


};

export default Petition;
