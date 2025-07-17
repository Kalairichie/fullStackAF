import { BrowserRouter as Router } from "react-router-dom";
import AllRoutes from "./Routes/AllRoutes";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header/Header";
import "./App.css";
import Toast from "./components/common/Toast";
import { Provider } from "react-redux";
import { store } from "./store/store";

function App() {
  return (
    <>
      <Provider store={store}>
        <Router>
          <AuthProvider>
            <Header />
            <AllRoutes />
            <Toast />
          </AuthProvider>
        </Router>
      </Provider>
    </>
  );
}

export default App;
