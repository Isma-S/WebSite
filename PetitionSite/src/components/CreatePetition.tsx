import React, { useState, useEffect } from 'react';
import {
    Button,
    Card,
    CardContent,
    Chip,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField
} from '@mui/material';
import axios from "axios";
import NavigationBar from "./NavigationBar";
import { useNavigate } from "react-router-dom";
interface Categories {
    categoryId: number,
    name: String
}
const CreatePetition = () => {
    let apiURL = "http://localhost:4941/api/v1"
    const [category, setCategory] = useState([]);
    const [petition, setPetition] = useState({
        title: '',
        description: '',
        categoryId: '',
        supportTiers: [''],
        image: null,
    });
    const [errors, setErrors] = useState({
        title: '',
        description: '',
        categoryId: '',
        supportTiers: '',
        image: '',
    });
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const [categories, setCategories] = useState<Categories[]>([]);
    const [categoryIds, setCategoryIds] = React.useState<number[]>([]);
    const authToken = localStorage.getItem('authToken');
    const userId = localStorage.getItem("userId");
    const getCategories = () => {
        axios.get('http://localhost:4941/api/v1/petitions/categories')
            .then((response) => {
                setErrorFlag(false);
                setErrorMessage("");
                console.log(response.data);
                setCategories(response.data);
            })
            .catch((error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            });
    };
    useEffect(() => {
        getCategories();

    },[]);

    const handleChange = (event:any) => {
        const { name, value } = event.target;
        setPetition(prevPetition => ({
            ...prevPetition,
            [name]: value
        }));
    };
    const [image, setImage] = useState<File | null>(null);

    const handleImageChange = (event:any) => {
        setImage(event.target.files[0]);
    };
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    const handleSubmit = async (event:any) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${apiURL}/petitions/` + userId + "/image", image, {
                headers: {
                    'x-authorization': authToken
                }
            });

            if (response.status === 201) {
                navigate('/petitions');
            }
        } catch (error) {
            console.error('Petition creation failed:', error);
            setErrorMessage('Petition creation failed. Please try again.');
            setErrorFlag(true);
        }

        try {
            const data = {
                'title': petition.title,
                'description': petition.description,
                'categoryId': selectedCategoryId,
                "supportTiers": [
                    {
                        "title": "Primary Supporter",
                        "description": "Supporting this tier will include getting your name included on a plaque",
                        "cost": 10
                    }
                ]
            }
            console.log(data)
            console.log(petition.categoryId)

            // petition.supportTiers.forEach((tier, index) => {
            //     formData.append(`supportTiers[${index}]`, tier);
            // });

            const response = await axios.post(`${apiURL}/petitions`, data, {
                headers: {
                    'x-authorization': authToken
                }
            });

            if (response.status === 201) {
                navigate('/petitions');
            }
        } catch (error) {
            console.error('Petition creation failed:', error);
            // console.log(FormData);
            setErrorMessage('Petition creation failed. Please try again.');
            setErrorFlag(true);
        }
    };
    const handleCategoryChange = (event: any) => {
        setSelectedCategoryId(event.target.value as number); // Update to handle a single value
    };
    return (
        <Paper elevation={3} style={{ padding: '150px' }}>
            <NavigationBar />
            <Card sx={{ width: '30%', margin: '20 auto', padding: "50px", textAlign: "center" }}>
                <CardContent>
                    <h2>Create Petition</h2>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Title"
                            type="text"
                            name="title"
                            value={petition.title}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Description"
                            type="text"
                            name="description"
                            value={petition.description}
                            onChange={handleChange}
                            fullWidth
                            required
                        />

                        <FormControl sx={{ margin: '10px', minWidth: 180 }}>
                            <InputLabel id="select-category-label">Select Category</InputLabel>
                            <Select
                                labelId="select-category-label"
                                id="select-category"
                                value={selectedCategoryId || ''}
                                onChange={handleCategoryChange}
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category.categoryId} value={category.categoryId}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>





                        {/*<div>*/}
                        {/*    <label htmlFor="supportTiers">Support Tiers:</label>*/}
                        {/*    {petition.supportTiers.map((tier, index) => (*/}
                        {/*        <TextField*/}
                        {/*            key={index}*/}
                        {/*            type="text"*/}
                        {/*            name={`supportTiers[${index}]`}*/}
                        {/*            value={tier}*/}
                        {/*            onChange={handleChange}*/}
                        {/*            fullWidth*/}
                        {/*            required*/}
                        {/*        />*/}
                        {/*    ))}*/}
                        {/*    <Button type="button" onClick={() => setPetition(prevPetition => ({ ...prevPetition, supportTiers: [...prevPetition.supportTiers, ''] }))}>Add Tier</Button>*/}
                        {/*</div>*/}

                        <div>
                            <label htmlFor="image">Image:</label>
                            <input
                                type="file"
                                id="image"
                                name="image"
                                accept="image/jpeg, image/png, image/gif"
                                onChange={handleImageChange}
                                required
                            />
                        </div>

                        <Button type="submit" variant="contained">
                            Create Petition
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Paper>
    );
};

export default CreatePetition;
