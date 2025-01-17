import React from "react";
import Navbar from "../components/Navbar";
import CartComponent from "../components/CartComponent";
import { SearchProvider } from "../context/SearchContext.jsx";

const Products = () => {
  return (
    <>
      <SearchProvider>
        <Navbar />
        <CartComponent />
      </SearchProvider>
    </>
  );
};

export default Products;
