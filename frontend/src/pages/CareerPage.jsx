import { Outlet } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import { useAlert } from "../context/AlertContext";
import BackNav from "../components/BackNav";

const CareerPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const is_super = JSON.parse(localStorage.getItem("is_super"));

  const { state } = location || {};

  const data = state || {};

  const handleEdit = async () => {
    navigate("/job", { state: data.data });
  };

  const job = data.data.job.split(" ")[0] || data.data.job.split(",")[0];
  const iconName = job.toLowerCase();
  const iconClass =
    "devicon-" +
    iconName +
    "-plain" +
    " colored text-4xl flex items-center justify-center place-self-center";

  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.delete(`delete_career/${id}`);
      console.log(response);
      navigate("/home");
      showAlert("Card deleted successfully!");
    } catch (error) {
      showAlert("Card not deleted.");
      console.log(error);
    }
  };

  return (
    <div>
      <BackNav/>

      <div className="container mx-auto p-30">
        <div className="flex mb-4 items-center gap-4">
          <h1 className="text-2xl font-bold sm:text-3xl">{data.data.job}</h1>
          <i className={iconClass}></i>
        </div>
        {is_super && (
          <span className="mb-16 inline-flex gap-2 ">
            <button
              className="inline-block border border-gray-400  rounded-md p-2 text-gray-700 hover:bg-gray-50 focus:relative"
              title="Edit Product"
              onClick={handleEdit}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            </button>

            <button
              className="inline-block border border-gray-400 rounded-md p-2 text-gray-700 hover:bg-gray-50 focus:relative"
              title="Delete Product"
              onClick={(e) => {
                e.preventDefault();
                handleDelete(data.data.id);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </button>
          </span>
        )}

        <div className="flex justify-between align-top">
          <div>
            <div className="w-4xl ">
              <h2 className=" mb-2 font-semibold ">Job Description</h2>
              <div
                className="text-gray-700 mb-2 "
                dangerouslySetInnerHTML={{
                  __html: data.data.details.description,
                }}
              ></div>
            </div>
            <div className="w-4xl mt-12 ">
              <h2 className=" mb-2 font-semibold ">Job Responsibilities</h2>
              <p className="text-gray-700 mb-2 ">
                {data.data.details.responsibilities}
              </p>
            </div>

            <div className="w-4xl mt-12 ">
              <h2 className=" mb-2 font-semibold ">Job Requirements</h2>
              <p className="text-gray-700 mb-2 ">
                {data.data.details.requirements}
              </p>
            </div>

            <div className="w-4xl mt-12 ">
              <h2 className=" mb-2 font-semibold ">Job Benefits</h2>
              <p className="text-gray-700 mb-2 ">
                {data.data.details.benefits}
              </p>
            </div>
          </div>
          <div className="w-xs">
            <button className="border bg-black text-white w-xs py-2 rounded-full">
              Apply
            </button>
            <button className="mt-4 border w-xs py-2 rounded-full">
              Share
            </button>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default CareerPage;
