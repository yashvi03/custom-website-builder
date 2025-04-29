import { useState } from "react";
import BackNav from "../components/BackNav";
import { Outlet } from "react-router-dom";
import { updateUser } from "../services/api";

const EditProfile = () => {
  const [file, setFile] = useState();
  const [profile, setProfile] = useState();
  const handleFileChange = async (e) => {
    e.preventDefault();
    const selectedFile = e.target.files[0];

    console.log("file", selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => setProfile(reader.result);
      reader.readAsDataURL(selectedFile);
      setFile(selectedFile);
    }
  };

  const handleSubmit = (id) => {
    updateUser(id,)
  };

  return (
    <div>
      <Outlet />
      <BackNav />
      <div className="mx-auto max-w-screen-xl px-4 py-30 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-2xl font-bold sm:text-3xl">
            Edit Profile Details
          </h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className="mx-auto mb-0 mt-8 w-3xl space-y-4"
        >
          <img className="w-fit h-fit" src={profile} alt="alternate-name"></img>
          <input
            className="text-gray-500 text-2xs m-0 mb-8"
            type="file"
            id="profile"
            name="profile"
            onChange={(e) => {
              handleFileChange(e);
            }}
          />
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
