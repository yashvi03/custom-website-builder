import Navbar from "../components/Navbar";
import Table from "../components/Table";
import UserTableConstant from "../components/UserTableConstant";
import axiosInstance from "../services/axiosInstance";
import { useEffect, useState } from "react";
import { useAlert } from "../context/AlertContext";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

const UserPage = () => {
  const [authorizedUsers, setAuthorizedUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const { showAlert } = useAlert();

  useEffect(() => {
    getUser();
  }, []);

  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState({});
  const [active, setActive] = useState({});

  useEffect(() => {
    getRoles();
  }, []);

  const getRoles = async () => {
    try {
      const response = await axiosInstance.get("/get_roles");
      const roleData = response.data.data.map((d) => ({
        role_id: d.role_id || null,
        role_name: d.role_name,
      }));
      setRoles(roleData);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleChange = (id, value) => {
    setSelectedRoles((prev) => ({ ...prev, [id]: value }));
  };

  const handleActiveChange = (id, value) => {
    setActive((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async (id, role_id, is_active) => {
    console.log("active[id],is_active", selectedRoles[id], role_id);

    const updateUserData = {
      is_active: active[id] !== undefined ? active[id] : is_active,
      role_id: selectedRoles[id] == undefined ? role_id : selectedRoles[id],
    };

    console.log(updateUserData);

    try {
      const response = await axiosInstance.put(
        `/update_user/${id}`,
        updateUserData
      );
      getUser();
      showAlert("Data saved successfully", response);
    } catch (error) {
      showAlert("Data not saved successfully", error);
    }
  };

  const getUser = async () => {
    try {
      const response = await axiosInstance.get("/get_user");
      console.log("user", response.data.data);
      setAuthorizedUsers(response.data.data.authorized_users);
      setPendingUsers(response.data.data.pending_users);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axiosInstance.delete(`/delete_user/${id}`);
      console.log(res);
      showAlert("Record deleted successfully!");
      getUser();
    } catch (error) {
      showAlert("Employee detail not deleted.");
      console.log(error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-10">
        <p className="font-semibold py-8">User Details Table</p>

        <TabGroup>
          <TabList className="flex gap-4 ">
            <Tab className="shrink-0 border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-500 selected-hover: none aria-selected:text-sky-600 aria-selected:border-sky-400 hover:border-gray-300 hover:text-gray-700">
              Authorized
            </Tab>
            <Tab className="shrink-0 border-b-2 border-transparent px-1 pb-4 text-sm font-medium aria-selected:text-sky-600 aria-selected:border-sky-400 text-gray-500 hover:border-gray-300 hover:text-gray-700">
              Pending
            </Tab>
          </TabList>
          <TabPanels className="mt-3">
            <TabPanel>
              <Table
                cols={UserTableConstant(
                  roles,
                  handleChange,
                  handleActiveChange,
                  handleSave,
                  handleDelete,
                  true
                )}
                data={authorizedUsers}
              />
            </TabPanel>
            <TabPanel>
              <Table
                cols={UserTableConstant(
                  roles,
                  handleChange,
                  handleActiveChange,
                  handleSave,
                  handleDelete
                )}
                data={pendingUsers}
              />
            </TabPanel>
          </TabPanels>
        </TabGroup>

        <br />
      </div>
    </div>
  );
};

export default UserPage;
