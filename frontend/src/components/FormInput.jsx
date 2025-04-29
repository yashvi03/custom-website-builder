const FormInput = ({
  type,
  name,
  placeholder,
  icon,
  handleChange,
  value,
  disabled,
  checked,
  // defaultValue
}) => (
  <div>
    <label htmlFor={name} className="sr-only">
      {placeholder}
    </label>
    <div className="relative">
      <input
        type={type}
        className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
        id={name}
        name={name}
        placeholder={placeholder}
        onChange={handleChange}
        value={value}
        disabled={disabled}
        checked={checked}
        // defaultValue={defaultValue}
      />
      {icon && (
        <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
          {icon}
        </span>
      )}
    </div>
  </div>
);

export default FormInput;
