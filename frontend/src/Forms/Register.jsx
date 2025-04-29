import "../Styles.css";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import validateFormData from "../utils/validateFormData";
import axiosInstance from "../services/axiosInstance";
import { useAlert } from "../context/AlertContext";
import FormInput from "../components/FormInput";
import EmailIcon from "../components/EmailIcon";
import PasswordIcon from "../components/PasswordIcon";

const defaultImage = "http://localhost:8000/static/uploads/default-profile.png";

const Register = () => {
  const { showAlert } = useAlert();
  let navigate = useNavigate();

  const [formState, setFormState] = useState({
    image: defaultImage,
    file: null,
    errors: {},
    isSubmitting: false,
  });

  const handleImageError = useCallback(async () => {
    try {
      const response = await fetch(defaultImage);
      const blob = await response.blob();
      const file = new File([blob], "default-profile.png", {
        type: "image/png",
      });

      setFormState((prev) => ({
        ...prev,
        file,
        image: URL.createObjectURL(blob),
      }));
    } catch (error) {
      console.log("error loading default image", error);
      showAlert("error loading default image");
    }
  }, [showAlert]);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormState((prev) => ({
        ...prev,
        image: reader.result,
        file,
      }));
    };
    reader.readAsDataURL(file);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState((prev) => ({ ...prev, isSubmitting: true }));

    const formData = new FormData(e.target);
    if (!formState.file && formState.image === defaultImage) {
      await handleImageError();
    }

    // Always append profile as a File object
    formData.append("profile", formState.file);

    const selectedData = {
      username: formData.get("username"),
      password: formData.get("password"),
      confirm_password: formData.get("confirm_password"),
      name: formData.get("name"),
      is_super: false,
      profile: formData.get("profile"),
    };

    const newErrors = validateFormData(selectedData);

    if (Object.keys(newErrors).length > 0) {
      setFormState((prev) => ({
        ...prev,
        errors: newErrors,
        isSubmitting: false,
      }));
      return;
    }

    try {
      await axiosInstance.post("/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showAlert("User registered successfully! Please login to continue");
      navigate("/");
    } catch (error) {
      showAlert("User not registered");
      console.error("Registration error", error);
      setFormState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  useEffect(() => {
    const errors = Object.values(formState.errors);
    if (errors.length > 0) errors.forEach(showAlert);
  }, [formState.errors, showAlert]);

  return (
    <div>
      <Navbar />
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex flex-col justify-center items-center max-w-lg text-center">
          <h1 className="text-2xl font-bold sm:text-3xl">Add User</h1>
          <div className="relative mt-8 flex items-center justify-center w-48 h-48 overflow-hidden bg-white rounded-full  border border-gray-200">
            <img
              className="w-full"
              src={formState.image}
              alt="profile"
              onError={handleImageError}
            ></img>
          </div>
          <input
            className="pt-8 pl-24 m-0"
            type="file"
            id="file"
            name="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mb-0 mt-8 max-w-md space-y-4"
        >
          <FormInput
            name="name"
            placeholder="Name"
            id="name"
            type="text"
            icon={null}
          />
          <FormInput
            name="username"
            placeholder="Username"
            id="username"
            type="email"
            icon={<EmailIcon />}
          />
          <FormInput
            name="password"
            placeholder="Password"
            id="password"
            type="password"
            icon={<PasswordIcon />}
          />
          <FormInput
            name="confirm_password"
            placeholder="Confirm Password"
            id="confirm_password"
            type="password"
            icon={<PasswordIcon />}
          />

          <button
            type="submit"
            disabled={formState.isSubmitting}
            className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
          >
            {formState.isSubmitting ? "Adding User..." : "Add User"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
