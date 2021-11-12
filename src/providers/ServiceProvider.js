import { createContext, useEffect, useState } from "react";
import Service from "../service";

export const ServiceContext = createContext({ firestoreData: null });

export function ServiceProvider({ children }) {
  const [service, setService] = useState(null);

  useEffect(() => {
    setService(new Service());
  }, []);

  return <ServiceContext.Provider value={{service}}>{children}</ServiceContext.Provider>
};