import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom
import { loginUser } from '../api/authService';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  // const navigate = useNavigate();  // Initialize the navigate function

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData);
      setMessage('Login successful');
      
      // Store the token in localStorage
      localStorage.setItem('token', response.token);
      
      // Redirect to the home page after successful login
      window.location.href = '/'; // Replace '/' with the desired path
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        className="w-full max-w-md bg-white p-8 shadow-md rounded"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {message && <p className="text-center text-red-500">{message}</p>}
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
          Login
        </button>
       do not have an acount  <a href="/register" className=' text-sm'><span className='text-blue-500 border-blue-400 border-b-2'>register</span></a>
      </form>
      {/* <a href="/register">do not have an acount register</a> */}
    </div>
  );
};

export default Login;
