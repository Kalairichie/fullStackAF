import { Route, Routes } from "react-router";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import { useSessionAuth } from "../utils/UserSession";
import Sales from "../pages/Sales";
import Estimation from "../pages/Estimation";
import SalesOrder from "../pages/SalesOrder";
import Management from "../pages/Management";

const ProtectedRoute = ({ children, authKey }) => {
  const isAuthenticated = useSessionAuth(authKey);
  console.log("useSessionAuth : ", isAuthenticated);

  return isAuthenticated ? children : <Login />;
};

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/sales" element={<Sales />} />
      <Route path="/estimation" element={<Estimation />} />
      <Route path="/sales-order" element={<SalesOrder />} />
      <Route path="/management" element={<Management />} />
    </Routes>
  );
};

export default AllRoutes;
