import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import CareerGrid from "../pages/CareerGrid";
import HomePage from "../pages/HomePage";
import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import { useNavigate } from "react-router-dom";
import AboutPage from "../pages/AboutPage";
import ContactUs from "../pages/Contact";
import "../Styles.css";

const Home = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [home, setHome] = useState({});
  const [about, setAbout] = useState({});
  const [footer, setFooter] = useState({});
  const [contact, setContact] = useState({});

  useEffect(() => {
    getPage();
  }, []);

  async function getPage() {
    const response = await axiosInstance.get("/get_page");
    setData(response.data);

    response.data.data.map((page) => {
      page.page_name === "home" && setHome(page);
      page.page_name === "about" && setAbout(page);
      page.page_name === "footer" && setFooter(page);
      page.page_name === "contact" && setContact(page);
    });
  }

  async function editPage() {
    const response = await axiosInstance.get("/get_page");
    console.log(response.data);

    navigate("/home-form", { state: data });
  }

  return (
    <div>
      <Navbar></Navbar>

      <div id="home">{home && <HomePage data={home} edit={editPage} />}</div>
      <div id="about">{about && <AboutPage data={about} />}</div>
      <div id="career">{<CareerGrid />}</div>
      <div id="contact">{<ContactUs />}</div>
      {footer && contact && <Footer data={footer} contact={contact}></Footer>}
    </div>
  );
};

export default Home;
