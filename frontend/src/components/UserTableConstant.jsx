import Button from "./Button";

const UserTableConstants = (
  roles,
  handleChange,
  handleActiveChange,
  handleSave,
  handleDelete,
  isDisabled
) => {
  let userTable = [
    {
      title: "ID",
      render: (rowData) => <span>{rowData.id}</span>,
    },
    {
      title: "Profile",
      render: (rowData) => <img className="w-10" src={`http://localhost:8000/${rowData.profile}`} />,
    },
    {
      title: "Name",
      render: (rowData) => <span>{rowData.name}</span>,
    },
    {
      title: "Username",
      render: (rowData) => <span>{rowData.username}</span>,
    },
    {
      title: "Active",
      render: (rowData) => (
        <input
          type="checkbox"
          onChange={(e) => handleActiveChange(rowData.id, e.target.checked)}
          defaultChecked={rowData.is_active || false}
        />
      ),
    },
    {
      title: "Role",
      render: (rowData) => (
        <select
          name="roles"
          id="roles"
          className="mt-2 w-full rounded-lg p-3 border border-gray-300 text-gray-700 sm:text-sm"
          onChange={(e) => handleChange(rowData.id, e.target.value)}
          defaultValue={rowData.role_id || ""}
          disabled={isDisabled}
        >
          <option value="" disabled>
            Select a role
          </option>
          {roles.map((role) => (
            <option key={role.role_id} value={role.role_id}>
              {role.role_name}
            </option>
          ))}
        </select>
      ),
    },
    {
      title: "Action",
      action: "save",
      render: (rowData) => (
        <Button
          onClick={(e) => {
            e.preventDefault();
            handleSave(rowData.id, rowData.role_id, rowData.is_active);
          }}
        >
          Save
        </Button>
      ),
    },

    {
      title: "Action",
      action: "delete",
      render: (rowData) => (
        <Button
          onClick={(e) => {
            e.preventDefault();
            handleDelete(rowData.id);
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  return userTable;
};

export default UserTableConstants;
