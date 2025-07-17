import "../Home/home.css";
// import Sidebar from '../../components/Header/Sidebar';
import logo from "../../assets/favicon.png";
import Home1 from "../../assets/home-carousel/hdfc.webp";
import Home2 from "../../assets/home-carousel/gcit.webp";
import Home3 from "../../assets/home-carousel/IAS.webp";
import Home4 from "../../assets/home-carousel/library.webp";
import Home5 from "../../assets/home-carousel/reccaclub.webp";
import Home6 from "../../assets/home-carousel/restobar.webp";
import Home7 from "../../assets/home-carousel/T-hub.webp";
import Home8 from "../../assets/home-carousel/sernity.webp";
import Home9 from "../../assets/home-carousel/seimens.webp";

function Home() {
  return (
    <>
      <div>
        <div className="heading d-flex align-items-center justify-content-center gap-2">
          <img className="img-fluid logo-img" src={logo} alt="-heading-logo" />
          <h2 className="home-heading">WELCOME ASI TEAM</h2>
        </div>
        <div className="heading-2 mt-5">
          <h2 className="home-heading">ADVANCED ACOUSTICAL INDUSTRY TOOLS</h2>
          <p>Empowering Your Growth in Manufacturing & Sales</p>
        </div>
        <div className="slider-wrapper">
          <div className="slider-container">
            <img src={Home1} alt="project" />
            <img src={Home2} alt="project" />
            <img src={Home3} alt="project" />
            <img src={Home4} alt="project" />
            <img src={Home5} alt="project" />
            <img src={Home6} alt="project" />
            <img src={Home7} alt="project" />
            <img src={Home8} alt="project" />
            <img src={Home9} alt="project" />
          </div>
        </div>
        {/* <a id="support" href="https://www.buymeacoffee.com/imstark202u" target="_blank"><img
                    src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee"
                  /></a> */}
      </div>
    </>
  );
}

export default Home;
