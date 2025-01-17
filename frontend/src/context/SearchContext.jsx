import { createContext, useContext, useState } from "react";
import { set } from "react-hook-form";

// Create Context
const SearchContext = createContext();

// Create a custom hook to use the search context
export const useSearch = () => {
  return useContext(SearchContext);
};

// Create a provider component
export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [productId, setProductId] = useState("");

  return (
    <SearchContext.Provider
      value={{ searchQuery, setSearchQuery,productId, setProductId }}
    >
      {children}
    </SearchContext.Provider>
  );
};
