import { useState } from "react";
import Navbar from "../components/Navbar";
// import { updateUser } from "../services/api";

const Profile = () => {
  const profileImage = localStorage.getItem("profile");
  const name = localStorage.getItem("name");
  const username = localStorage.getItem("username");
  // const [profile, setProfile] = useState("");
  // const [file, setFile] = useState();

  // const handleEdit = () => {};

  // const handleFileChange = async (e) => {
  //   e.preventDefault();
  //   const selectedFile = e.target.files[0];

  //   console.log("file", selectedFile);

  //   if (selectedFile) {
  //     const reader = new FileReader();
  //     reader.onload = () => setProfile(reader.result);
  //     reader.readAsDataURL(selectedFile);
  //     setFile(selectedFile);
  //     // updateUser()
  //   }
  // };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto py-30">
        <div className="flex items-center gap-10">
          <img className="w-32" src={profileImage} alt="" />
          {/* <input
            className="text-gray-500 text-2xs m-0 mb-8"
            type="file"
            id="image"
            name="image"
            onChange={(e) => {
              handleFileChange(e);
            }}
          /> */}
          <div>
            <p className="text-lg">{name}</p>
            <p className="text-sm italic text-grey-200">{username}</p>
          </div>
          {/* <svg
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
          </svg> */}
        </div>
      </div>
    </div>
  );
};

export default Profile;
