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
    TableBody, CardMedia, Typography, Chip
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
const MyPetitionList = () => {
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
    const [ownerId, setOwnerId] = useState<number | null>(null);

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

    // Initialize ownerId state based on local storage when the component mounts
    // const [ownerId, setOwnerId] = useState<number | null>(null);

// Initialize ownerId state based on local storage when the component mounts


    const getPetitions = () => {
        const storedOwnerId = localStorage.getItem("userId");
        console.log("dagkyajdf" +storedOwnerId)
        axios.get("http://localhost:4941/api/v1/petitions?ownerId="+storedOwnerId, {
            params: {
                q: query || undefined,
                categoryIds: categoryIds || undefined,
                supportingCost: supportingCost || undefined,
                ownerId: ownerId || undefined,
                sortBy: sortBy || undefined,
            }
        })
            .then((response) => {
                setErrorFlag(false);
                setErrorMessage("");
                setPetitions(response.data.petitions);
            })
            .catch((error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            });
    };

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
        return petitions.slice(startIndex, endIndex).map((row: Petition) => (



            <TableRow hover tabIndex={-1} key={row.petitionId}  onClick = {() => handlePetitionClick(row.petitionId)}>
                <TableCell>{row.petitionId}</TableCell>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.ownerFirstName}</TableCell>
                <TableCell>{row.ownerLastName}</TableCell>
                <TableCell>{row.numberOfSupporters}</TableCell>
                <TableCell>{row.creationDate}</TableCell>
                <TableCell>{row.categoryId}</TableCell>
                <TableCell>{row.supportingCost}</TableCell>
                <TableCell>{row.ownerId}</TableCell>


                <TableCell>
                    <CardMedia
                        component="img"
                        sx={{
                            objectFit: "cover",
                            width: 100,
                            height: 100,
                        }}
                        // sx={{ objectFit: "contain" }}
                        src={getOwnerImage(row.ownerId)}
                        alt="Owner image"

                    />
                </TableCell>
                <TableCell>
                    <CardMedia
                        component="img"
                        sx={{
                            objectFit: "cover",
                            width: 100,
                            height: 100,
                        }}
                        // sx={{ objectFit: "contain" }}
                        src={getFileImagePath(row.petitionId)}
                        alt="Petition image"

                    />
                </TableCell>

            </TableRow>
        ));
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
                                <TableCell>Petition ID</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Owner First Name</TableCell>
                                <TableCell>Owner Last Name</TableCell>
                                <TableCell>Number of Supporters</TableCell>
                                <TableCell>Creation Date</TableCell>
                                <TableCell>Category ID</TableCell>
                                <TableCell>Supporting Cost</TableCell>
                                <TableCell>Owner Image</TableCell>
                                <TableCell>Petition Image</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {petition_rows(startIndex, endIndex)}
                            <Pagination count={Math.ceil(petitions.length) / RowsPerPage}
                                        page={currentPage + 1}
                                        onChange={handlePageChange}
                            />
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </div>


    )
}

export default MyPetitionList;