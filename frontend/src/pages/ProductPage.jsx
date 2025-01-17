import React from "react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { SearchProvider } from "../context/SearchContext.jsx";

const Products = () => {
  return (
    <>
      <SearchProvider>
        <Navbar />
        <ProductCard />
      </SearchProvider>
    </>
  );
};

export default Products;
