import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import { QueryClientProvider } from "react-query";

import { Main } from "../pages/Main";
import { Admin } from "../pages/Admin";
import { About } from "../pages/About";
import { Sneaker } from "../pages/Sneaker";


import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { queryClient } from "./api";

export const AppRoutes = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <Router basename="/">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Navigate to="/home" />} />
                    <Route path="/home" element={<Main route="sneakers" />} />
                    <Route path="/buscar/:search" element={<Main route="sneakers/search" />} />
                    <Route path="/sobre" element={<About />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/sneaker/:id" element={<Sneaker />} />
                    <Route path="/loja/:store" element={<Main route="sneakers/store" />} />
                    <Route path="/marca/:brand" element={<Main route="sneakers/brand" />} />
                    <Route path="/categoria/:category" element={<Main route="sneakers/category" />} />
                </Routes>
                <Footer />
            </Router>
        </QueryClientProvider>
    );


}