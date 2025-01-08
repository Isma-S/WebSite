import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';

import PetitionList from './components/Petitions';
import Register from "./components/Register";
import NavigationBar from "./components/NavigationBar";
import Login from './components/Login';
import Petition from "./components/Petition";
import CreatePetition from './components/CreatePetition';
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import MyPetitionList from "./components/MyPetitions";


function App() {
    return (
        <div className="App">
            <Router>
                <div>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/petitions" element={<PetitionList />} />
                        <Route path="/myPetitions" element={<MyPetitionList />} />
                        <Route path="/petition/:id" element={<Petition/>} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/editProfile" element={<EditProfile />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/petition/create" element={<CreatePetition />} />
                        {/*<Route path="/petition/:id/edit" element={<EditPetition />} />*/}
                        {/*<Route path="*" element={<NotFound />} />*/}
                    </Routes>
                </div>
            </Router>
        </div>
    );
}

export default App;
