import Button from "./Button";

const EmployeeTableConstants = (handleEdit, handleDelete) => {
  const perm = JSON.parse(localStorage.getItem("perm"));
  const is_super = JSON.parse(localStorage.getItem("is_super"));

  let empTable = [
    {
      title: "ID",
      render: (rowData) => {
        return <span>{rowData.id}</span>;
      },
    },
    {
      title: "Employee Name",
      render: (rowData) => {
        return <span>{rowData.name}</span>;
      },
    },
    {
      title: "Designation",
      render: (rowData) => {
        return <span>{rowData.designation}</span>;
      },
    },
    {
      title: "Email",
      render: (rowData) => {
        return <span>{rowData.email}</span>;
      },
    },
    {
      title: "Phone",
      render: (rowData) => {
        return <span>{rowData.phone}</span>;
      },
    },
    {
      title: "City",
      render: (rowData) => {
        return <span>{rowData.city}</span>;
      },
    },
    {
      title: "Action",
      action: "edit",

      render: (rowData) => {
        return (
          <Button
            className={
              perm[0].page === "Employee" &&
              perm[0].permission.edit == false &&
              is_super == false
                ? "hidden"
                : "active"
            }
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
            className={
              perm[0].page === "Employee" &&
              perm[0].permission.delete == false &&
              is_super == false
                ? "hidden"
                : "active"
            }
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

  if (perm[0].permission.edit == false && is_super == false) {
    empTable = empTable.filter((item) => item.action !== "edit");
  }

  if (perm[0].permission.delete == false && is_super == false) {
    empTable = empTable.filter((item) => item.action !== "delete");
  }

  return empTable;
};

export default EmployeeTableConstants;
