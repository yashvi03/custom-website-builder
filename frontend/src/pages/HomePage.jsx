import { useEffect, useState } from "react";
import "../Styles.css";
import AnchorLink from "react-anchor-link-smooth-scroll";

const HomePage = ({ data, edit }) => {
  const [pageData, setPageData] = useState({});
  const [image, setImage] = useState("");
  const is_super = JSON.parse(localStorage.getItem("is_super"));

  useEffect(() => {
    if (data?.page_data) {
      setPageData(data.page_data);
    }
  }, [data]);

  useEffect(() => {
    if (pageData.image) {
      setImage(pageData.image);
    }
  }, [pageData]);
  return (
    <div>
      <div className="relative text-center">
        <img
          className="h-screen w-full "
          src={`https://custom-website-builder.onrender.com/${image}`}
          alt="img"
        />
        <div className="absolute inset-0 bg-black opacity-65"></div>
        <div className="w-full absolute top-0 left-0 text-center mt-64 flex flex-col items-center">
          <h2 className="animate-typing text-7xl font-semibold text-white whitespace-nowrap text-center">
            {pageData.heading}
          </h2>

          <p className="mt-4 w-2xl text-xl text-gray-300">
            {pageData.subHeading}
          </p>
          <AnchorLink href="#about">
            <button className=" mt-12 bg-white text-xm font-semibold hover:bg-transparent hover:text-white hover:border-2 border-white text-black py-4 px-8 rounded-4xl">
              {pageData.buttonText}
              <i className="  ml-6 fa-solid fa-arrow-right"></i>
            </button>
          </AnchorLink>

          {is_super && (
            <button
              onClick={edit}
              className="text-white font-semibold text-xm mt-4 py-2 px-12 border-2  hover:text-black hover:bg-white hover:border-black border-white rounded-4xl"
            >
              Edit
              <span></span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
