import { createContext, useState } from "react";

export const LastDocContext = createContext();

export const LastDocProvider = ({ children }) => {
  const [lastDoc, setLastDoc] = useState(null);
  const [lists, setLists] = useState([]); 

  return (
    <LastDocContext.Provider value={{ lastDoc, setLastDoc, lists, setLists }}>
      {children}
    </LastDocContext.Provider>
  );
};
