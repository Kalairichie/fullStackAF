import SalesOrderTable from "./components/SalesOrderTable";
import Login from "../Login/Login";
import { useDispatch, useSelector } from "react-redux";
import { setSessionStorage, useSessionAuth } from "../../utils/UserSession";
import { API_URLS } from "../../services/ApiUrls";
import { setSalesOrder } from "../../store/provider/providerSlice";

const SalesOrder = () => {
  const { salesOrder } = useSelector((state) => state.Provider);
  const isAuthenticated = useSessionAuth("sales-order");
  const dispatch = useDispatch();
  const handleSalesOrderLogin = (data) => {
    if (!data) return;
    setSessionStorage(`salesOrder_isLoggedIn`, true);
    dispatch(setSalesOrder(data));
  };
  return (
    <>
      {salesOrder?.success || isAuthenticated ? (
        <SalesOrderTable />
      ) : (
        <Login
          url={API_URLS.SALES_ORDER_LOGIN}
          type="salesOrder"
          handleLogin={handleSalesOrderLogin}
        />
      )}
    </>
  );
};

export default SalesOrder;
