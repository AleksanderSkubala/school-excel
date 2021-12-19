import { useState, useContext, useEffect } from "react";
import { ServiceContext } from "./providers/ServiceProvider";
import Modal from "./components/molecules/Modal";
import AdminView from "./components/organisms/AdminView";

function App() {
  const { service } = useContext(ServiceContext);
  const [auth, setAuth] = useState();

  useEffect(() => {
    setAuth(service.auth);
  }, [service.auth]);

  return (
    <div>
      {auth == null ? <Modal/>  : <AdminView/>}
    </div>
  );
}

export default App;
