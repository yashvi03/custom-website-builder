const empDetailsValidate = (data) => {
  console.log('erros',data);
  const errors = {};

  if (!data.designation) {
    errors.designation = "Designation is required";
  }
  if (!data.city) {
    errors.city = "City is required";
  }

  if (!data.phone) {
    errors.phone = "Phone number is required";
  }

  if (!data.email) {
    errors.email = "Email is required";
  }

  if (!data.name) {
    errors.name = "Name is required";
  }

  return errors;
};

export default empDetailsValidate;
