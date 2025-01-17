import React from "react";
import Navbar from "../components/Navbar";
import MyOrder from "../components/MyOrderComponent";
import { SearchProvider } from "../context/SearchContext.jsx";

const Products = () => {
  return (
    <>
      <SearchProvider>
        <Navbar />
        <MyOrder />
      </SearchProvider>
    </>
  );
};

export default Products;
