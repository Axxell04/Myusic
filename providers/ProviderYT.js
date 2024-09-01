import { createContext, useState } from "react";

export const YTURLContext = createContext(null);
export const YTURLIsValidContext = createContext(null);

export function ProviderYT({ children }) {
  const [ ytURL, setYTURL ] = useState("");
  const [ ytURLIsValid, setYTURLIsValid ] = useState(false);

  return (
    <YTURLContext.Provider value={{ ytURL, setYTURL }}>
      <YTURLIsValidContext.Provider value={{ ytURLIsValid, setYTURLIsValid }}>
        {children}
      </YTURLIsValidContext.Provider>
    </YTURLContext.Provider>
  );
}
