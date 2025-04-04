import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Books from "./pages/Books";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyReads from "./pages/MyReads";
import EditClubPage from "./pages/EditClubPage";
import Clubs from "./pages/Clubs";
import ClubPage from "./pages/ClubPage";
import MyClub from "./pages/MyClub";
import CreateClub from "./pages/CreateClub";
import SingleBook from "./pages/SingleBook";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="books" element={<Books />} />
            <Route path="books/:id" element={<SingleBook />} />
            <Route path="profile" element={<Profile />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="my-reads" element={<MyReads />} />
            <Route path="clubs" element={<Clubs />} />
            <Route path="club/:id" element={<ClubPage />} />
            <Route path="my-club" element={<MyClub />} />
            <Route path="create-club" element={<CreateClub />} />
            <Route path="edit-club/:id" element={<EditClubPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);
