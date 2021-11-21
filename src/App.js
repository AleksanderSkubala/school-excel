import { useState, useContext, useEffect } from "react";
import { ServiceContext } from "./providers/ServiceProvider";
import Modal from "./components/molecules/Modal";
import AdminView from "./components/organisms/AdminView";

function App() {
  const { service } = useContext(ServiceContext);
  const [auth, setAuth] = useState();

  useEffect(() => {
    setAuth(service.auth);
    console.log(service.auth);
  }, [service.auth]);

  return (
    <div>
      {auth == null ? <Modal/>  : <h2>Dupa</h2>}
    </div>
  );
}

export default App;
