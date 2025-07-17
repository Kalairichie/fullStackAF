import { useDispatch, useSelector } from "react-redux";
import Login from "../Login/Login";
import ManagementTable from "./components/ManagementTable";
import { setSessionStorage, useSessionAuth } from "../../utils/UserSession";
import { API_URLS } from "../../services/ApiUrls";
import { setManagement } from "../../store/provider/providerSlice";

const Management = () => {
  const { management } = useSelector((state) => state.Provider);
  const isAuthenticated = useSessionAuth("management");
  const dispatch = useDispatch();
  const handleManagementLogin = (data) => {
    if (!data) return;
    setSessionStorage(`management_isLoggedIn`, true);
    dispatch(setManagement(data));
  };
  return (
    <>
      {management?.success || isAuthenticated ? (
        <ManagementTable />
      ) : (
        <Login
          url={API_URLS.MANAGEMENT_LOGIN}
          type="management"
          handleLogin={handleManagementLogin}
        />
      )}
    </>
  );
};

export default Management;
