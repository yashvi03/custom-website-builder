import { Link, Outlet, useNavigate } from "react-router-dom";
import Table from "../components/Table";
import RoleTableConstants from "../components/RoleTableConstants";
import { useState, useEffect } from "react";
import Button from "../components/Button";
import Navbar from "../components/Navbar";
import axiosInstance from "../services/axiosInstance";
import { useAlert } from "../context/AlertContext";

const RolePage = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const perm = JSON.parse(localStorage.getItem("perm"));
  const is_super = JSON.parse(localStorage.getItem("is_super"));

  useEffect(() => {
    getRole();
  }, []);

  const getRole = async () => {
    try {
      const response = await axiosInstance.get("/get_role");
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleView = async (id) => {
    const response = await axiosInstance.get(`/get_role/${id}`);
    navigate("/addRole", {
      state: {
        id: response.data.data.id,
        roleName: response.data.data.role_name,
        permissions: response.data.data.permissions,
        emp_permission: response.data.data.permissions[0].permission,
        role_permission: response.data.data.permissions[1].permission,
        disabled: true,
      },
    });
  };

  const handleEdit = async (id) => {
    const response = await axiosInstance.get(`/get_role/${id}`);
    navigate("/addRole", {
      state: {
        id: response.data.data.id,
        roleName: response.data.data.role_name,
        permissions: response.data.data.permissions,
        emp_permission: response.data.data.permissions[0].permission,
        role_permission: response.data.data.permissions[1].permission,
        disabled: false,
      },
    });
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`delete_role/${id}`);
      showAlert("Record deleted successfully!");
      getRole();
    } catch (error) {
      showAlert("Role not deleted.");
      console.log(error);
    }
  };

  return (
    <div>
      <Outlet />
      <Navbar />
      <div className="container mx-auto p-10">
        <div className="w-full flex items-center justify-between">
          <p className="font-semibold py-8">Roles Details Table</p>
          {(perm[1].page === "Role" && perm[1].permission.add) || is_super && (
            <Link to="/addRole">
              <Button>Add</Button>
            </Link>
          )}
        </div>
        <Table
          cols={RoleTableConstants(handleView, handleEdit, handleDelete)}
          data={data}
        />
        <br />
      </div>
    </div>
  );
};

export default RolePage;
