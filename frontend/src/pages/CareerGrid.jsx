import { useEffect, useState } from "react";
import Card from "../components/Card";
import axiosInstance from "../services/axiosInstance";
import Button from "../components/Button";
import { Link } from "react-router-dom";

const CareerGrid = () => {
  const [data, setDate] = useState([]);
  const is_super = JSON.parse(localStorage.getItem("is_super"));

  useEffect(() => {
    getCareer();
  }, []);

  const getCareer = async () => {
    const response = await axiosInstance.get("get_career");
    console.log(response.data.data);
    setDate(response.data.data);
  };

  return (
    <div className=" text-center relative px-24 text h-fit mb-12">
      <div>
        <h1 className="text-2xl pt-12 mb-4 font-semibold sm:text-3xl">Careers</h1>
        {is_super && (
          <Link to="/job">
            <button className="py-1 px-6 border text-gray-600 border-gray-700 hover:text-black hover:border-2 rounded-3xl">
              Add
              <i className="ml-2 fa-solid fa-plus"></i>
            </button>
          </Link>
        )}
      </div>

      {/* <div className="w-full  top-0 left-0 text-center mt-8 flex flex-col items-center "> */}
      <div className="mx-auto flex flex-col justify-center items-center text-center">
        <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
          {data.map((d, index) => (
            <Card data={d} key={index} />
          ))}
        </div>
      </div>
    </div>
    // </div>
  );
};

export default CareerGrid;
