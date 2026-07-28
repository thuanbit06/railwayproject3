// frontend/src/context/TrainContext.jsx
import React, { createContext, useState, useContext } from "react";
import { stations } from "../data";

export const TrainContext = createContext();

export const TrainProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [useMock, setUseMock] = useState(true);

  return (
    <TrainContext.Provider
      value={{
        stations,
        searchResults,
        setSearchResults,
        useMock,
        setUseMock,
      }}>
      {children}
    </TrainContext.Provider>
  );
};

// ✅ THÊM CÁI NÀY
export const useTrain = () => {
  const context = useContext(TrainContext);
  if (!context) {
    throw new Error("useTrain must be used within a TrainProvider");
  }
  return context;
};
