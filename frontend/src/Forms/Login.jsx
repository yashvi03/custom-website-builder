import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import { useAlert } from '../context/AlertContext';
import FormInput from '../components/FormInput';
import EmailIcon from '../components/EmailIcon';
import PasswordIcon from '../components/PasswordIcon';

const Login = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleInputChange = (e) => {
  const { name, value } = e.target;
  console.log('Input Change:', name, value);  // Debug
  setFormData(prev => {
    const newState = { ...prev, [name]: value };
    console.log('New FormData:', newState);  // Debug
    return newState;
  });
};

  const saveUserData = (data, token) => {
    const userData = {
      access_token: token.access_token,
      refresh_token: token.refresh_token,
      role_id: data.role_id,
      is_super: data.is_super,
      profile: data.profile,
      name: data.name,
      username: data.username,
    };

    Object.entries(userData).forEach(([key, value]) => {
      localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
    });
  };

  const fetchUserPermissions = async (roleId) => {
    try {
      const response = await axiosInstance.get(`/get_role/${roleId}?just_per=true`);
      const permissions = response.data.data.permissions;
      localStorage.setItem('perm', JSON.stringify(permissions));
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
      showAlert('Failed to load user permissions');
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axiosInstance.post('/login', formData);
      const { message, data, token } = response.data;
      console.log(message,data,token);

      saveUserData(data, token);

      if (data.is_super === 'false' || data.is_super === false) {
        await fetchUserPermissions(data.role_id);
      }

      showAlert('Login successful');
      navigate('/home');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      showAlert(errorMessage);
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">Login</h1>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto mb-0 mt-8 max-w-md space-y-4">
        <FormInput
          name="username"
          placeholder="Username"
          id="username"
          type="email"
          icon={<EmailIcon />}
          value={formData.username}
          handleChange={handleInputChange}
          disabled={isLoading}
        />

        <FormInput
          name="password"
          placeholder="Password"
          id="password"
          type="password"
          icon={<PasswordIcon />}
          value={formData.password}
          handleChange={handleInputChange}
          disabled={isLoading}
        />

        <button
          type="submit"
          className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-center text-sm text-gray-500">
          No Account?{' '}
          <a className="underline hover:text-indigo-600" href="/register">
            Register
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;