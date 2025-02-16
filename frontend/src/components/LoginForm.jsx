import  { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login Details:', { email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 bg-gray-100 p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <label className="block mb-2">Email:</label>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        className="w-full p-2 mb-4 border rounded" 
      />
      <label className="block mb-2">Password:</label>
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        className="w-full p-2 mb-4 border rounded" 
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Login</button>
    </form>
  );
};

export default Login;
