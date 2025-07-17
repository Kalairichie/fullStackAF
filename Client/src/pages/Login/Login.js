import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./login.css";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../../assets/favicon.png";
import { toast } from "react-toastify";
import { setSessionStorage } from "../../utils/UserSession";

function Login({ url, handleLogin, type }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(url, {
        username,
        password,
      });
      if (response.data.success) {
        handleLogin(response.data);
        toast.success("Login successful!");
        setSessionStorage(`username`, username);
      } else {
        toast.error(response.data || "Login failed");
        console.error("Error while login:", response.data);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error?.response?.data?.message ||
          "Unexpected error occurred during login."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-box">
        <img className="login-logo mb-3" src={logo} alt="login-logo" />
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="user-box">
            <input
              className="login-input"
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label>Username</label>
          </div>

          <div className="user-box position-relative">
            <input
              className="login-input"
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label>Password</label>

            <span
              className="password-toggle-icon"
              onClick={() => setShowPassword((prev) => !prev)}
              style={{
                position: "absolute",
                top: "35%",
                right: "10px",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#888",
              }}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="user-box d-flex justify-content-center">
            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;
