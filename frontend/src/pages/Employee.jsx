import Button from "../components/Button";
import EmployeeTableConstants from "../components/EmployeeTableConstants";
import Table from "../components/Table";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axiosInstance from "../services/axiosInstance";
import { useAlert } from "../context/AlertContext";

const Employee = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const perm = JSON.parse(localStorage.getItem("perm"));
  const is_super = JSON.parse(localStorage.getItem("is_super"));

  useEffect(() => {
    getEmp();
  }, []);

  const getEmp = async () => {
    try {
      const response = await axiosInstance.get("/get_emp");
      console.log("emp", response.data.data);
      setData(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = async (id) => {
    const response = await axiosInstance.get(`/get_emp/${id}`);

    navigate("/create", {
      state: {
        id: response.data.data.id || "",
        name: response.data.data.name || "",
        designation: response.data.data.designation || "",
        email: response.data.data.email || "",
        phone: response.data.data.phone || "",
        city: response.data.data.city || "",
      },
    });
  };

  const handleDelete = async (id) => {
    try {
      const res = await axiosInstance.delete(`/delete_emp/${id}`);
      console.log(res);
      showAlert("Record deleted successfully!");
      getEmp();
    } catch (error) {
      showAlert("Employee detail not deleted.");
      console.log(error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-10">
        <div className="w-full flex items-center justify-between">
          <p className="font-semibold py-8">Employee Details Table</p>
          {(perm[0].page === "Employee" && perm[0].permission.add) ||
            (is_super && (
              <Link to="/create">
                <Button>Add</Button>
              </Link>
            ))}
        </div>
        <Table
          cols={EmployeeTableConstants(handleEdit, handleDelete)}
          data={data}
        />
        <br />
      </div>
    </div>
  );
};

export default Employee;
