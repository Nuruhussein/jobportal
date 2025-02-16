// src/pages/Register.jsx
import { useState } from 'react';
import { registerUser } from '../api/authService';
import { Navigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false); // Tracks if the message is a success

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(formData);
      setIsSuccess(true); // Set success state
      setMessage(response.message);
      window.location.href = '/login'; // Replace '/' with the desired path
    } catch (err) {
      setIsSuccess(false); // Set error state
      setMessage(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        className="w-full max-w-md bg-white p-8 shadow-md rounded"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        {message && (
          <p
            className={`text-center mb-4 ${
              isSuccess ? 'text-blue-500' : 'text-red-500'
            }`}
          >
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
        <button
          type="submit"
          className="w-full mb-3 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Register
        </button>
      have an acount  <a href="/login" className=' text-sm'><span className='text-blue-500 border-blue-400 border-b-2'>login</span></a>

      </form>

    </div>
  );
};

export default Register;
