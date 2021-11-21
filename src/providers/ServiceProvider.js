import { createContext, useEffect, useMemo, useState } from "react";
import Service from "../service";

export const ServiceContext = createContext({
  service: null,
  auth: null,
  login: null,
});

export function ServiceProvider({ children }) {
  const [service] = useState(new Service());
  const [auth, setAuth] = useState(null);

  function login(email) {
    service.setEmail(email).then(() => setAuth(email));
    console.log(service, auth);
  }

  const memoedValue = useMemo(() => ({
    service,
    auth,
    login,
  }), [service, auth]);


  return <ServiceContext.Provider value={memoedValue}>{children}</ServiceContext.Provider>
};