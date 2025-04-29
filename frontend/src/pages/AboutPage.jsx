import { useEffect, useState } from "react";

const AboutPage = ({ data }) => {
  const [pageData, setPageData] = useState({});

  useEffect(() => {
    if (data?.page_data) {
      setPageData(data.page_data);
    }
  }, [data]);

  return (
    <div className="h-fit    bg-gray-100 ">
      <div className=" px-24 relative">
        <button className="m-4 mt-12 py-3 px-6 rounded-4xl w-xm border border-gray-500 font-medium">
          About Us
        </button>
        <div className="flex items-center pb-20 justify-between g-64">
          <h2 className="w-xl text-4xl font-semibold text-black text-center">
            {pageData.title}
          </h2>
          <p className="w-2xl text-start text-xm text-gray-500">
            {pageData.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
