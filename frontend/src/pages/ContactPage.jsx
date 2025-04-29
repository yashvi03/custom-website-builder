import { useEffect, useState } from "react";
import { Link } from "@react-email/components";

const ContactPage = ({ data }) => {
  const [pageData, setPageData] = useState({});

  useEffect(() => {
    if (data?.page_data) {
      setPageData(data.page_data);
    }
  }, [data]);

  return (
    <div>
      <div className="relative text-center ">
        <div className="w-full relative top-0 left-0 text-start   flex flex-col items-center">
          <ul className="text-start">
            <li className="text-xl font-semibold ">Contact Us</li>
            <li className="py-2">{pageData.name}</li>
            <li className="py-2">
              <a href={`mailto:${pageData.email}`}><i className="mr-2 fa-solid fa-envelope"></i>{pageData.email}</a>
            </li>
            <li className="py-2"><i className="mr-2 fa-solid fa-phone"></i>{pageData.phone}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
