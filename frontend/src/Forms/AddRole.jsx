import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import "../Styles.css";
import { useState } from "react";
import axiosInstance from "../services/axiosInstance";
import { useAlert } from "../context/AlertContext";
import BackNav from "../components/BackNav";
import FormInput from "../components/FormInput";

const AddRole = () => {
  let navigate = useNavigate();
  const { state } = useLocation();
  const { showAlert } = useAlert();
  const { id, roleName, emp_permission, role_permission, disabled } =
    state || {};

  const isDisabled = disabled;

  const [formData, setFormData] = useState({
    roleName: roleName || "",
    permissions: [
      {
        page: "Employee",
        permission: {
          e_view: emp_permission?.view || false,
          e_edit: emp_permission?.edit || false,
          e_add: emp_permission?.add || false,
          e_delete: emp_permission?.delete || false,
        },
      },
      {
        page: "Role",
        permission: {
          r_view: role_permission?.view || false,
          r_edit: role_permission?.edit || false,
          r_add: role_permission?.add || false,
          r_delete: role_permission?.delete || false,
        },
      },
    ],
  });

  const handleChange = (e) => {
    const { name, checked, value } = e.target;
    if (name == "roleName") setFormData({ ...formData, roleName: value });
    setFormData((prev) => {
      const updatedPermissions = prev.permissions.map((perm) => {
        if (perm.page === "Employee" && name.startsWith("e_")) {
          return {
            ...perm,
            permission: { ...perm.permission, [name]: checked },
          };
        }

        if (perm.page === "Role" && name.startsWith("r_")) {
          return {
            ...perm,
            permission: { ...perm.permission, [name]: checked },
          };
        }
        return perm;
      });
      return { ...prev, permissions: updatedPermissions };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const RoleData = {
      role_name: formData.roleName,
      permissions: [
        {
          page: "Employee",
          permission: {
            view: formData.permissions[0].permission.e_view,
            edit: formData.permissions[0].permission.e_edit,
            add: formData.permissions[0].permission.e_add,
            delete: formData.permissions[0].permission.e_delete,
          },
        },
        {
          page: "Role",
          permission: {
            view: formData.permissions[1].permission.r_view,
            edit: formData.permissions[1].permission.r_edit,
            add: formData.permissions[1].permission.r_add,
            delete: formData.permissions[1].permission.r_delete,
          },
        },
      ],
    };
    console.log("formdata", formData.roleName);
    console.log("sent data", RoleData);

    try {
      const response = id
        ? await axiosInstance.put(`/update_role/${id}`, RoleData)
        : await axiosInstance.post("/role", RoleData);

      console.log(response);
      console.log("updated data", RoleData);

      showAlert("Details updated successfully!");
      navigate("/role");
    } catch (error) {
      showAlert(id ? "Role details not updated." : "Role not added.");
      console.error("Fetch error:", error);
    }
  };

  return (
    <div>
      <BackNav />
      <div className="container mx-auto p-30">
        <form onSubmit={handleSubmit}>
          <FormInput
            type="text"
            onChange={handleChange}
            disabled={isDisabled}
            placeholder="Student"
            value={formData.roleName}
            name="roleName"
          />

          <table className="mt-12 min-w-full divide-y-2 divide-gray-200  text-sm ">
            <thead className="ltr:text-left rtl:text-right">
              <tr>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Page Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  View
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Edit
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Add
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  Employee
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  <input
                    name="e_view"
                    type="checkbox"
                    className="size-4 rounded border-gray-300"
                    checked={
                      formData.permissions.find((p) => p.page === "Employee")
                        .permission.e_view
                    }
                    onChange={handleChange}
                    disabled={isDisabled}
                  />
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  <input
                    name="e_edit"
                    type="checkbox"
                    className="size-4 rounded border-gray-300"
                    checked={
                      formData.permissions.find((p) => p.page === "Employee")
                        .permission.e_edit
                    }
                    onChange={handleChange}
                    disabled={isDisabled}
                  />
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  <input
                    className="size-4 rounded border-gray-300"
                    name="e_add"
                    type="checkbox"
                    checked={
                      formData.permissions.find((p) => p.page === "Employee")
                        .permission.e_add
                    }
                    onChange={handleChange}
                    disabled={isDisabled}
                  />
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  <input
                    className="size-4 rounded border-gray-300"
                    name="e_delete"
                    type="checkbox"
                    checked={
                      formData.permissions.find((p) => p.page === "Employee")
                        .permission.e_delete
                    }
                    onChange={handleChange}
                    disabled={isDisabled}
                  />
                </td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  Role
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  <input
                    className="size-4 rounded border-gray-300"
                    name="r_view"
                    type="checkbox"
                    checked={
                      formData.permissions.find((p) => p.page === "Role")
                        .permission.r_view
                    }
                    onChange={handleChange}
                    disabled={isDisabled}
                  />
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  <input
                    className="size-4 rounded border-gray-300"
                    name="r_edit"
                    type="checkbox"
                    checked={
                      formData.permissions.find((p) => p.page === "Role")
                        .permission.r_edit
                    }
                    onChange={handleChange}
                    disabled={isDisabled}
                  />
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  <input
                    className="size-4 rounded border-gray-300"
                    name="r_add"
                    type="checkbox"
                    checked={
                      formData.permissions.find((p) => p.page === "Role")
                        .permission.r_add
                    }
                    onChange={handleChange}
                    disabled={isDisabled}
                  />
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  <input
                    className="size-4 rounded border-gray-300"
                    name="r_delete"
                    type="checkbox"
                    checked={
                      formData.permissions.find((p) => p.page === "Role")
                        .permission.r_delete
                    }
                    onChange={handleChange}
                    disabled={isDisabled}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <br />
          {isDisabled ? <div></div> : <Button type="submit">Save</Button>}
        </form>
        <br />

        <Outlet />
      </div>
    </div>
  );
};

export default AddRole;
