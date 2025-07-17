import { useState } from "react";
import logo from "../../assets/ASI LOGO 2 - WHITE.png";
import "./header.css";
import { NavLink, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  setEstimation,
  setManagement,
  setSales,
  setSalesOrder,
} from "../../store/provider/providerSlice";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };
  const dispatch = useDispatch();
  const location = useLocation();
  const navigationList = [
    {
      name: "Lead",
      link: "/sales",
    },
    {
      name: "Estimation",
      link: "/estimation",
    },
    {
      name: "Sales Order",
      link: "/sales-order",
    },
    {
      name: "Management",
      link: "/management",
    },
  ];

  const currentPath = location.pathname;
  const matchedPage = navigationList.find(
    (link) =>
      currentPath === link.link || currentPath.startsWith(link.link + "/")
  );
  const handleLogout = () => {
    if (matchedPage?.name === "Lead") {
      dispatch(setSales(null));
      sessionStorage.removeItem("sales_isLoggedIn");
    } else if (matchedPage?.name === "Estimation") {
      dispatch(setEstimation(null));
      sessionStorage.removeItem("estimation_isLoggedIn");
    } else if (matchedPage?.name === "Sales Order") {
      dispatch(setSalesOrder(null));
      sessionStorage.removeItem("salesOrder_isLoggedIn");
    } else if (matchedPage?.name === "Management") {
      dispatch(setManagement(null));
      sessionStorage.removeItem("management_isLoggedIn");
    }
  };

  return (
    <>
      <header>
        <nav className="navbar">
          <div className="logo d-flex align-items-center justify-content-center">
            <a href="/">
              <img className="header-logo" src={logo} alt="logo" />
            </a>
          </div>
          <ul className={`nav-menu ${menuOpen ? "active" : ""}`}>
            {navigationList?.map((item, i) => (
              <NavLink
                to={item.link}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
                style={{ textDecoration: "none" }}>
                {item.name}
              </NavLink>
            ))}

            {matchedPage && (
              <li className="nav-item">
                <a href="/" className="nav-link" onClick={handleLogout}>
                  <span>Exit</span>
                </a>
              </li>
            )}
          </ul>
          <div
            className={`hamburger ${menuOpen ? "active" : ""}`}
            onClick={toggleMenu}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Header;
