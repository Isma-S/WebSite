import axios from 'axios';
import React, {useEffect, useState,ChangeEvent} from "react";
import CSS from 'csstype';
import {
    Paper,
    AlertTitle,
    Alert,
    Pagination,
    FormControl,
    InputLabel,
    OutlinedInput,
    MenuItem,
    Checkbox,
    ListItemText,
    Select,
    Button,
    SelectChangeEvent,
    TableRow,
    TableCell,
    TableContainer,
    Table,
    TableHead,
    TableBody, CardMedia, Typography, Chip, Box, ThemeProvider, createTheme
} from "@mui/material";

import NavigationBar from "./NavigationBar";

import {Link, useLocation, useParams} from "react-router-dom";
import {Category} from "@mui/icons-material";

interface Petition {
    petitionId: number,
    title: string,
    categoryId: number,
    creationDate: string,
    ownerId: number,
    ownerFirstName: string,
    ownerLastName: string,
    numberOfSupporters: number,
    supportingCost: number,
}
interface Categories {
    categoryId: number,
    name: String
}

// AC.1
const RowsPerPage = 10;
const PetitionList = () => {
    const [petitions, setPetitions] = useState<Petition[]>([]);
    // Page for view of set of pages
    const [currentPage, setCurrentPage] = useState(0);
    const startIndex = currentPage * RowsPerPage;
    const endIndex = (currentPage + 1) * RowsPerPage;
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState<Petition | null>(null);
    const [addUserUsername, setAddUserUsername] = useState("");

    const { search } = useLocation();
    const [query, setQuery] = React.useState<string>(new URLSearchParams(search).get("q")||'');

    const [categoryIds, setCategoryIds] = React.useState<number[]>([]);
    const [supportingCost, setSupportingCost] = useState(null);
    const [ownerId, setOwnerId] = useState(null);
    const [supporterId, setSupporterId] =useState(null);
    const [sortBy, setSortBy] = useState<string>('');


    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);




    const [selectedSortOption, setSelectedSortOption] = React.useState("");
    useEffect(() => {
        getPetitions();
    }, [query,categoryIds,supportingCost,ownerId,supporterId,sortBy]);



    // const handleSearch = (event: { preventDefault: () => void; }) => {
    //     event.preventDefault();
    //
    //     if (query !== '') {
    //         window.location.href = `/petitions?q=${query}`;
    //     } else {
    //         window.location.href = `/petitions`;
    //     }
    //
    // };
    //
    const handleInputChange = (event: { target: { value: any; }; }) => {
        setQuery(event.target.value);
    };

    const handleSortChange = (event: SelectChangeEvent<string>) => {
        const selectedSort = event.target.value;
        setSortBy(selectedSort);
    };




    const card: CSS.Properties = {
        padding: "60px",
        margin: "20px",
        display: "block",
        width: "90%" }
    let URL = "http://localhost:4941/api/v1"

    const { id } = useParams<{ id: string }>();
    // con
    const getPetitions = () => {
        axios.get("http://localhost:4941/api/v1/petitions", {
            params: {
                // startIndex:startIndex || 0,
                q: query || undefined,
                categoryIds: categoryIds || undefined,
                supportingCost: supportingCost || undefined,
                ownerId: ownerId || undefined,
                // supporterId: supporterId || undefined,
                sortBy: sortBy || undefined,
            }
        })
            .then((response) => {
                setErrorFlag(false);
                setErrorMessage("");
                console.log(response.data);
                console.log("ids set to ", categoryIds);
                const params = response.config.params; // Accessing the params object from the response config
                console.log("params:", params);
                console.log("id:", id);
                setPetitions(response.data.petitions);
            })
            .catch((error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            });

        // axios.get('http://localhost:4941/api/v1/petitions', {
        //     params: {
        //         // startIndex:startIndex || 0,
        //         q: query || undefined,
        //         categoryIds: categoryIds || undefined,
        //         supportingCost: supportingCost || undefined,
        //         ownerId: ownerId || undefined,
        //         // supporterId: supporterId || undefined,
        //         sortBy: sortBy || undefined,
        //     }
        // })
        //     .then((response) => {
        //         setErrorFlag(false);
        //         setErrorMessage("");
        //         console.log(response.data);
        //         console.log("ids set to ", categoryIds);
        //         setPetitions(response.data.petitions);
        //     })
        //     .catch((error) => {
        //         setErrorFlag(true);
        //         setErrorMessage(error.toString());
        //     });
    };
    const theme = createTheme({
        palette: {
            primary: {
                main: '#1976d2', // Example primary color
            },
            secondary: {
                main: '#dc004e', // Example secondary color
            },
        },
    });
    const getFileImagePath = (petitionId: number) => {
        return `http://localhost:4941/api/v1/petitions/${petitionId}/image`;
    };
    const getOwnerImage = (ownerId: number) => {
        return (URL +  '/users/' + ownerId + '/image')

    }

    const petition_rows = (startIndex:number, endIndex:number) => {


        const handlePetitionClick = (petitionId: number) => {
            window.location.href = `http://localhost:4942/petition/${petitionId}`;
        };

        return (
            <ThemeProvider theme={theme}>
                {petitions.slice(startIndex, endIndex).map((row: Petition) => {
                    // Find the category name for the current row
                    const categoryName = categories.find(category => category.categoryId === row.categoryId)?.name || 'Unknown';

                    return (
                        <TableRow
                            hover
                            tabIndex={-1}
                            key={row.petitionId}
                            onClick={() => handlePetitionClick(row.petitionId)}
                            sx={{
                                '&:hover': {
                                    backgroundColor: theme.palette.action.hover,
                                },
                                cursor: 'pointer',
                                '& td': {
                                    border: 'none',
                                    padding: 0,

                                },
                            }}
                        >
                            <TableCell colSpan={1} sx={{ textAlign: 'center' }}> {/* Adjusted to span 2 columns and center text */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: '10px', // Add rounded corners to the box
                                        overflow: 'hidden', // Prevent content from overflowing the box
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        sx={{
                                            objectFit: 'cover',
                                            borderRadius: 'inherit', // Match the box's border radius
                                            width: 150, // Increased width
                                            height: 150, // Increased height
                                        }}
                                        src={getFileImagePath(row.petitionId)}
                                        alt="Petition image"
                                    />
                                </Box>
                            </TableCell>
                            <TableCell>{row.title}</TableCell>
                            <TableCell>{row.creationDate}</TableCell>
                            <TableCell>{categoryName}</TableCell> {/* Display category name instead of ID */}
                            <TableCell>{row.ownerFirstName}</TableCell>
                            <TableCell>{row.ownerLastName}</TableCell>
                            <TableCell>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        sx={{
                                            objectFit: 'cover',
                                            borderRadius: '50%', // Keep the original border radius for the owner image
                                            width: 100, // Original width
                                            height: 100, // Original height
                                        }}
                                        src={getOwnerImage(row.ownerId)}
                                        alt="No image"
                                    />
                                </Box>
                            </TableCell>
                            <TableCell>{row.supportingCost}</TableCell>
                        </TableRow>

                    );
                })}
            </ThemeProvider>
        );
    }
    const handlePageChange = (event: ChangeEvent<any>, newPage: number) => {
        setCurrentPage(newPage -1);
    };


    // const handleCategoryChange = (event: any) => {
    //     setCategoryIds(event.target.value as number[]);
    // };
    const handleSupportingCostChange = (event: any) => {
        const cost = event.target.value;
        setSupportingCost(cost);
        console.log("supporting cost set to " + cost)
    };



    // const handleCategoryChange = (event: any) => {
    //     const selectedCategoryIds = event.target.value as number[];
    //     setCategoryIds(selectedCategoryIds);
    // };


    const handleCategoryChange = (event: any) => {
        // setCategoryIds((prevCategoryIds) => [...prevCategoryIds, ...event.target.value]);
        setCategoryIds(event.target.value);
    };
    const handleCategoryDelete = (categoryIdToRemove:any) => {
        setCategoryIds((prevCategoryIds) => prevCategoryIds.filter(id => id !== categoryIdToRemove));
    };


    // [
    //     {
    //         "categoryId": 1,
    //         "name": "Art"
    //     }
    // ]
    const [categories, setCategories] = useState<Categories[]>([]);


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
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const totalPages = Math.ceil(petitions.length / RowsPerPage);

    return (
        <div>
            <NavigationBar />

            <Paper elevation={3} style={card}>
                <Typography variant="h4" align="center" gutterBottom>Petitions</Typography>

                <p>{selectedSortOption}</p>
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "auto",
                    padding: "20px"
                }}>
                    <FormControl sx={{margin: "0px 5px", width: '200px', height: '60px'}}>
                    <InputLabel id="sort-by-label">Sort By</InputLabel>
                        <Select
                            labelId="sort-by-label"
                            id="sort-by"
                            value={selectedSortOption}
                            onChange={handleSortChange}
                            input={<OutlinedInput label="Sort By"/>}
                        >
                            <MenuItem value={'ALPHABETICAL_ASC'}>Title (A-Z)</MenuItem>
                            <MenuItem value={'ALPHABETICAL_DESC'}>Title (Z-A)</MenuItem>
                            <MenuItem value={'COST_ASC'}>Cost (Lowest to Highest)</MenuItem>
                            <MenuItem value={'COST_DESC'}>Cost (Highest to Lowest)</MenuItem>
                            <MenuItem value={'CREATED_ASC'}>Date (Oldest to Newest)</MenuItem>
                            <MenuItem value={'CREATED_DESC'}>Date (Newest to Oldest)</MenuItem>
                        </Select>
                    </FormControl>
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: "auto",
                        padding: "20px"
                    }}>


                        {/*<div style={{marginRight: "20px"}}>*/}
                        {/*    <FormControl sx={{margin: "0px 5px", width: '200px', height: '60px'}}>*/}
                        {/*        <InputLabel id="category-label">Categories</InputLabel>*/}
                        {/*        <Select*/}
                        {/*            labelId="category-label"*/}
                        {/*            id="category-select"*/}
                        {/*            multiple*/}
                        {/*            value={categoryIds}*/}
                        {/*            onChange={handleCategoryChange}*/}
                        {/*            input={<OutlinedInput label="Categories"/>}*/}
                        {/*            renderValue={(selected) => (selected as number[]).map((value) => `Category ${value}`).join(', ')}*/}
                        {/*        >*/}
                        {/*            <MenuItem value={1}>Category 1</MenuItem>*/}
                        {/*            <MenuItem value={2}>Category 2</MenuItem>*/}
                        {/*            <MenuItem value={3}>Category 3</MenuItem>*/}
                        {/*        </Select>*/}
                        {/*    </FormControl>*/}
                        {/*</div>*/}

                        <div>
                            <FormControl sx={{margin: "0px 5px", width: "200px", height: "60px"}}>
                                <InputLabel id="supporting-cost-label">Supporting Cost</InputLabel>
                                <OutlinedInput
                                    id="supporting-cost-input"
                                    value={supportingCost || ""}
                                    onChange={handleSupportingCostChange}
                                    type="number"
                                    startAdornment={<span>$</span>}
                                    label="Supporting Cost"
                                />
                            </FormControl>

                        </div>

                        {/*//Categories area*/}
                        <FormControl sx={{ margin: '10px', minWidth: 180 }}>
                            <InputLabel id="select-multiple-chip-label">Select Categories</InputLabel>
                            <Select
                                labelId="select-multiple-chip-label"
                                id="select-multiple-chip"
                                multiple
                                value={categoryIds}
                                open={isDropdownOpen}
                                onClose={() => setIsDropdownOpen(false)}
                                onOpen={() => setIsDropdownOpen(true)}
                                onChange={handleCategoryChange}

                                renderValue={(selected) => (
                                    <div>
                                        {(selected as number[]).map((categoryId) => {
                                            const category = categories.find(cat => cat.categoryId === categoryId);
                                            return <Chip
                                                key={categoryId}
                                                label={category ? category.name : 'Unknown'}
                                                onDelete={() => handleCategoryDelete(categoryId)} />;
                                        })}
                                    </div>
                                )}

                            >
                                {categories.map((category) => (
                                    <MenuItem key={category.categoryId} value={category.categoryId}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>


                </div>
                <h1>Petitions</h1>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ mb: 1 }}>Hero image</TableCell>
                                <TableCell sx={{ mb: 1 }}>Title</TableCell>
                                <TableCell sx={{ mb: 1 }}>Creation Date</TableCell>
                                <TableCell sx={{ mb: 1 }}>Category ID</TableCell>
                                <TableCell sx={{ mb: 1 }}>Owner First Name</TableCell>
                                <TableCell sx={{ mb: 1 }}>Owner Last Name</TableCell>
                                {/*<TableCell>Number of Supporters</TableCell>*/}
                                <TableCell sx={{ mb: 1 }}>Owner Image</TableCell>
                                <TableCell sx={{ mb: 1 }}>Supporting Cost</TableCell>
                                {/*<TableCell>Petition Image</TableCell>*/}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {petition_rows(startIndex, endIndex)}
                            <TableRow>
                                <TableCell style={{ height: '50px' }} />
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={9} />
                            </TableRow>
                            <Pagination count={totalPages} page={currentPage + 1} onChange={handlePageChange} />
                        </TableBody>

                    </Table>

                </TableContainer>
            </Paper>
        </div>


    )
}

export default PetitionList;