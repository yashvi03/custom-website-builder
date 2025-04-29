const validateFormData = (data) => {
  console.log(data);
  const errors = {};
  let pRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  if (!data.username) {
    errors.username = "Username is required";
  }

  if (!data.password) {
    errors.password = "Password is required";
  } else if (!pRegex.test(data.password)) {
    errors.password =
      "Password must be at least 8 characters long, should contain at least 1 uppercase lowercase and special character";
  }
  if (data.confirm_password !== data.password) {
    errors.confirm_password = "Passwords do not match";
  }

  if (!data.name) {
    errors.name = "Name is required";
  }

  

  return errors;
};

export default validateFormData;
