import { useState } from 'react';
import { registerUser } from '../api/authService';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    return email.includes('@') && email.endsWith('.com');
  };

  const validatePassword = (password) => {
    return password.length > 3;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      setIsSuccess(false);
      setMessage('Invalid email format. Email must contain "@" and end with ".com"');
      return;
    }

    if (!validatePassword(formData.password)) {
      setIsSuccess(false);
      setMessage('Password must be at least 4 characters long.');
      return;
    }

    try {
      const response = await registerUser(formData);
      setIsSuccess(true);
      setMessage(response.message);
      window.location.href = '/login';
    } catch (err) {
      setIsSuccess(false);
      setMessage(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form className="w-full max-w-md bg-white p-8 shadow-md rounded" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        {message && (
          <p className={`text-center mb-4 ${isSuccess ? 'text-blue-500' : 'text-red-500'}`}>
            {message}
          </p>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            className="w-full border rounded px-3 py-2"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            className="w-full border rounded px-3 py-2"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            className="w-full border rounded px-3 py-2"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="w-full mb-3 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          Register
        </button>
        <p className="text-sm">
          Have an account?{' '}
          <a href="/login" className="text-blue-500 border-blue-400 border-b-2">
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;
