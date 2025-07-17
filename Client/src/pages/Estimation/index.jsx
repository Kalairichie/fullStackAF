import EstimationTable from "./component/EstimationTable";
import { useDispatch, useSelector } from "react-redux";
import { setSessionStorage, useSessionAuth } from "../../utils/UserSession";
import Login from "../Login/Login";
import { API_URLS } from "../../services/ApiUrls";
import { setEstimation } from "../../store/provider/providerSlice";

const Estimation = () => {
  const { estimation } = useSelector((state) => state.Provider);
  const isAuthenticated = useSessionAuth("estimation");
  const dispatch = useDispatch();
  const handleEstimationLogin = (data) => {
    if (!data) return;
    setSessionStorage(`estimation_isLoggedIn`, true);
    dispatch(setEstimation(data));
  };

  return (
    <>
      {estimation?.success || isAuthenticated ? (
        <EstimationTable />
      ) : (
        <Login
          url={API_URLS.ESTIMATION_LOGIN}
          type="estimation"
          handleLogin={handleEstimationLogin}
        />
      )}
    </>
  );
};

export default Estimation;
