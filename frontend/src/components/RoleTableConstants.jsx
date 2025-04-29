import Button from "./Button";
import "../Styles.css";

const RoleTableConstants = (handleView, handleEdit, handleDelete) => {
  const perm = JSON.parse(localStorage.getItem("perm"));
  const is_super = JSON.parse(localStorage.getItem("is_super"));

  let roleTable = [
    {
      title: "ID",
      render: (rowData) => {
        return <span>{rowData.id}</span>;
      },
    },
    {
      title: "Role Name",
      render: (rowData) => {
        return <span>{rowData.role_name}</span>;
      },
    },

    {
      title: "Action",
      action: "view",

      render: (rowData) => {
        return (
          <Button
            onClick={(e) => {
              e.preventDefault;
              handleView(rowData.id);
            }}
          >
            View
          </Button>
        );
      },
    },
    {
      title: "Action",
      action: "edit",
      render: (rowData) => {
        return (
          <Button
            onClick={(e) => {
              e.preventDefault;
              handleEdit(rowData.id);
            }}
          >
            Edit
          </Button>
        );
      },
    },
    {
      title: "Action",
      action: "delete",

      render: (rowData) => {
        return (
          <Button
            onClick={(e) => {
              e.preventDefault;
              handleDelete(rowData.id);
            }}
          >
            Delete
          </Button>
        );
      },
    },
  ];

  if (perm[1].permission.edit == false && is_super == false) {
    roleTable = roleTable.filter((item) => item.action !== "edit");
  }
  if (perm[1].permission.view == false && is_super == false) {
    roleTable =  roleTable.filter((item) => item.action !== "view");
  }
  if (perm[1].permission.delete == false && is_super == false) {
    roleTable =  roleTable.filter((item) => item.action !== "delete");
  }

  return roleTable;
};

export default RoleTableConstants;
