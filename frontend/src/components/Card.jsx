import { Link } from "react-router-dom";
const Card = ({ data }) => {
  const job = data.job.split(" ")[0] || data.job.split(",")[0];
  const iconName = job.toLowerCase();
  const iconClass =
    "devicon-" +
    iconName +
    "-plain" +
    " colored text-3xl flex items-center justify-start mb-3 ";
  return (
    <div className="group relative block ">
      <span className="absolute rounded-2xl inset-0  border-black"></span>

      <div className=" h-full shadow-4xm border border-gray-200 rounded-2xl   bg-white transition-transform group-hover:shadow-xl group-hover:-translate-x-2 group-hover:-translate-y-2">
        <div className=" text-start  relative group-hover:opacity-100 sm:p-6 lg:p-8">
          <i className={iconClass}></i>
          <h3 className="mb-4 text-xl font-medium sm:text-2xl">{data.job}</h3>
          <div className="flex text-gray-500 gap-2 items-center">
            <i className="fa-solid fa-briefcase"></i>
            <p className=" text-sm sm:text-base">{data.type}</p>
          </div>
          <div className="flex text-gray-500 gap-3 items-center">
            <i className="fa-solid fa-location-dot"></i>
            <p className=" text-sm sm:text-base">{data.location}</p>
          </div>
          <Link to="/career-page" state={{ data }}>
            <button className="mt-4  hover:bg-white hover:border-2 border-black hover:text-black font-semibold rounded-3xl bg-black text-white px-6 py-2">
              View
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Card;
