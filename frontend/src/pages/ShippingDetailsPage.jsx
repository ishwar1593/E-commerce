import React from "react";
import Navbar from "../components/Navbar";
import ShippingDetail from "../components/ShippingDetail";
import { SearchProvider } from "../context/SearchContext.jsx";


const Products = () => {
  return (
    <SearchProvider>
      <Navbar />
      <ShippingDetail />
    </SearchProvider>
  );
};

export default Products;
