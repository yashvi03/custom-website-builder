import { useState, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useAlert } from "../context/AlertContext";
import empDetailsValidate from "../utils/empDetailsValidate";
import BackNav from "../components/BackNav";
import FormInput from "../components/FormInput";
import { updateEmp, addEmp } from "../services/api";

const Create = () => {
  let navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const { state } = useLocation();
  const { id, name, designation, email, phone, city } = state || {};
  const { showAlert } = useAlert();
  const [formData, setFormData] = useState({
    inputName: name || "",
    inputDesignation: designation || "",
    inputEmail: email || "",
    inputPhone: phone || "",
    inputCity: city || "",
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

    const selectedData = {
      name: formData.get("name"),
      designation: formData.get("designation"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      city: formData.get("city"),
    };

    const newErrors = empDetailsValidate(selectedData);
    if (Object.keys(newErrors).length > 0) {
      setErrors({ ...newErrors });
      return;
    }

    if (id) {
      try {
        const res = await updateEmp(id, selectedData);
        console.log(res, "update emp");
        showAlert("Details updated successfully!");
        navigate("/employee");
      } catch (error) {
        showAlert("Employee detail not updated.");
        console.log("data not sent back", error);
      }
    } else {
      try {
        const response = await addEmp(selectedData);
        console.log(response, "add emp");
        showAlert("Details added successfully!");
        navigate("/employee");
      } catch (error) {
        showAlert("Employee detail not added.");
        console.log("data not sent back", error);
      }
    }
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      for (let val of Object.values(errors)) {
        showAlert(val);
      }
    }
  }, [errors, showAlert]);

  return (
    <div>
      <BackNav />
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-2xl font-bold sm:text-3xl">Employee Details</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mb-0 mt-8 max-w-md space-y-4"
        >
          <FormInput
            type="text"
            name="name"
            placeholder="Yashvi Agrawal"
            defaultValue={formData.inputName}
          />

          <FormInput
            type="text"
            name="designation"
            placeholder="Student"
            defaultValue={formData.inputDesignation}
            onChange={handleChange}
          />

          <FormInput
            type="email"
            name="email"
            placeholder="user@example.com"
            defaultValue={formData.inputEmail}
            onChange={handleChange}
          />

          <FormInput
            type="text"
            name="phone"
            placeholder="+91 9374808167"
            defaultValue={formData.inputPhone}
            onChange={handleChange}
          />

          <FormInput
            type="text"
            name="city"
            placeholder="Bangalore"
            defaultValue={formData.inputCity}
            onChange={handleChange}
          />

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

export default Create;
