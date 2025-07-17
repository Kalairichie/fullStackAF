import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Toast = () => {
  return (
    <ToastContainer
      theme="dark"
      style={{
        fontSize: "16px",
        fontWeight: "bold",
        marginTop: 100,
        zIndex: 99999,
      }}
      position="top-center"
      autoClose={3000}
    />
  );
};

export default React.memo(Toast);
