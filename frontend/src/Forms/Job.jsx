import { useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import { useAlert } from "../context/AlertContext";
import { Editor } from "primereact/editor";
import BackNav from "../components/BackNav";
import { updateCareer, addCareer } from "../services/api";

// import empDetailsValidate from "../utils/empDetailsValidate";

const Job = () => {
  let navigate = useNavigate();
  //   const [errors, setErrors] = useState({});
  const { state } = useLocation();
  const data = state || {};
  const { showAlert } = useAlert();
  const [text, setText] = useState("");
  const id = data.id;
  console.log(id);
  const [formData, setFormData] = useState({
    inputJobName: data.job || "",
    inputJobType: data.type || "",
    inputLocation: data.location || "",
    inputDetails: data.details || "",
  });

  const handleChange = (e) => {
    setFormData((prevalue) => {
      return {
        ...prevalue,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const Detail = {
      description: text,
      responsibilities: formData.get("responsibilities"),
      requirements: formData.get("requirements"),
      benefits: formData.get("benefits"),
    };

    const selectedData = {
      job: formData.get("job"),
      type: formData.get("type"),
      location: formData.get("location"),
      details: Detail,
    };

    // const newErrors = empDetailsValidate(selectedData);
    // if (Object.keys(newErrors).length > 0) {
    //   setErrors({ ...newErrors });
    //   return;
    // }

    if (id) {
      try {
        const res = await updateCareer(id, selectedData);
        console.log(res, "updated career");
        showAlert("Details updated successfully!");
        navigate("/career");
      } catch (error) {
        showAlert("Detail not updated.");
        console.log("data not sent back", error);
      }
    } else {
      try {
        const response = await addCareer(selectedData);
        console.log(response, "add career");
        showAlert("Details added successfully!");
        navigate("/career");
      } catch (error) {
        showAlert("Details not added.");
        console.log("data not sent back", error);
      }
    }
  };

  //   useEffect(() => {
  //     if (Object.keys(errors).length > 0) {
  //       for (let val of Object.values(errors)) {
  //         showAlert(val);
  //       }
  //     }
  //   }, [errors]);

  return (
    <div>
      <BackNav />
      <div className="mx-auto max-w-screen-xl px-4 py-30 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-2xl font-bold sm:text-3xl">Career Details</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mb-0 mt-8 w-3xl space-y-4"
        >
          <div className="flex gap-4">
            <div className="w-full">
              <label htmlFor="job" className="sr-only">
                Job Name
              </label>

              <div className="relative">
                <input
                  type="text"
                  className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                  placeholder="Job (Python Developer)"
                  id="job"
                  name="job"
                  defaultValue={formData.inputJobName}
                />
              </div>
            </div>

            <div className="w-full">
              <label htmlFor="type" className="sr-only">
                Job Type
              </label>

              <div className="relative">
                <input
                  type="text"
                  className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                  id="type"
                  name="type"
                  placeholder="Job Type (Full Time)"
                  defaultValue={formData.inputJobType}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="w-full">
              <label htmlFor="location" className="sr-only">
                Location
              </label>

              <div className="relative">
                <input
                  type="text"
                  className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                  id="location"
                  name="location"
                  placeholder="Bangalore"
                  defaultValue={formData.inputLocation}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="description" className="sr-only">
              Job Description
            </label>

            <div className="relative">
              <Editor
                value={formData.inputDetails.description}
                name="description"
                id="description"
                onTextChange={(e) => setText(e.htmlValue)}
                style={{ height: "320px" }}
              />

              {/* <textarea
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                id="description"
                name="description"
                placeholder="Job Description"
                rows="2"
                defaultValue={formData.inputDetails.description}
                onChange={handleChange}
              /> */}
            </div>
          </div>
          <div className="flex gap-4 ">
            <div className="w-full">
              <label htmlFor="responsibilities" className="sr-only">
                Job Responsibilities
              </label>

              <div className="relative">
                <textarea
                  className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                  id="responsibilities"
                  name="responsibilities"
                  rows="8"
                  placeholder="Job Responsibilities"
                  defaultValue={formData.inputDetails.responsibilities}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="w-full">
              <label htmlFor="requirements" className="sr-only">
                Job Requirements
              </label>

              <div className="relative">
                <textarea
                  className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                  id="requirements"
                  name="requirements"
                  rows="8"
                  placeholder="Job Requirements"
                  defaultValue={formData.inputDetails.requirements}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="benefits" className="sr-only">
              Job Benefits
            </label>

            <div className="relative">
              <textarea
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                id="benefits"
                name="benefits"
                rows="3"
                placeholder="Job Benefits"
                defaultValue={formData.inputDetails.benefits}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
          >
            Submit
          </button>
        </form>
      </div>
      <Outlet />
    </div>
  );
};

export default Job;
