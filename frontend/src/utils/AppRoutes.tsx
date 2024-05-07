import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import { Main } from "../pages/Main";
import { Admin } from "../pages/Admin";
import { About } from "../pages/About";
import { Sneaker } from "../pages/Sneaker";


import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const AppRoutes = () => {
    return (
        <Router basename="/">
            <Navbar />
            <Routes>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/home" element={<Main route="http://localhost:3000/sneakers" />} />
                <Route path="/buscar/:search" element={<Main route="http://localhost:3000/sneakers" />} />
                <Route path="/sobre" element={<About />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/sneaker/:id" element={<Sneaker />} />
                <Route path="/loja/:store" element={<Main route="http://localhost:3000/sneakers/store" />} />
                <Route path="/marca/:brand" element={<Main route="http://localhost:3000/sneakers/brand" />} />
                <Route path="/categoria/:category" element={<Main route="http://localhost:3000/sneakers/category" />} />
            </Routes>
            <Footer />
        </Router>
    );


}