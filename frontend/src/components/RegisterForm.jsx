import  { useState } from 'react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Register Details:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 bg-gray-100 p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <label className="block mb-2">Name:</label>
      <input 
        type="text" 
        name="name" 
        value={formData.name} 
        onChange={handleChange} 
        className="w-full p-2 mb-4 border rounded" 
      />
      <label className="block mb-2">Email:</label>
      <input 
        type="email" 
        name="email" 
        value={formData.email} 
        onChange={handleChange} 
        className="w-full p-2 mb-4 border rounded" 
      />
      <label className="block mb-2">Password:</label>
      <input 
        type="password" 
        name="password" 
        value={formData.password} 
        onChange={handleChange} 
        className="w-full p-2 mb-4 border rounded" 
      />
      <button type="submit" className="bg-green-500 text-white p-2 rounded w-full">Register</button>
    </form>
  );
};

export default Register;
