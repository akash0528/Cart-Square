import { useContext, useState } from "react";
import SearchContext from "./SearchContext";

const SearchProvider = ({ children }) => {
  const [query, setQuery] = useState("");

  return (
    <SearchContext.Provider value={{ query, setQuery }}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchProvider;
