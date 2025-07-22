import { useDispatch, useSelector } from "react-redux";
import Login from "../Login/Login";
import { setSessionStorage, useSessionAuth } from "../../utils/UserSession";
import SalesForm from "./components/SalesForm";
import { API_URLS } from "../../services/ApiUrls";
import { setSales } from "../../store/provider/providerSlice";

function Sales() {
  const { sales } = useSelector((state) => state.Provider);

  const isAuthenticated = useSessionAuth("sales");
  const dispatch = useDispatch();
  const handleSalesLogin = (data) => {
    if (!data) return;
    setSessionStorage(`sales_isLoggedIn`, true);
    dispatch(setSales(data));
  };
  return (
    <>
      {sales?.success || isAuthenticated ? (
        <SalesForm />
      ) : (
        <Login
          url={API_URLS.SALES_LOGIN}
          type="sales"
          handleLogin={handleSalesLogin}
        />
      )}
    </>
  );
}

export default Sales;
