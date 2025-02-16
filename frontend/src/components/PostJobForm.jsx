import  { useState } from 'react';

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    salary: '',
    location: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Job Posted:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 bg-gray-100 p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Post a Job</h2>
      <label className="block mb-2">Title:</label>
      <input 
        type="text" 
        name="title" 
        value={formData.title} 
        onChange={handleChange} 
        className="w-full p-2 mb-4 border rounded" 
      />
      <label className="block mb-2">Description:</label>
      <textarea 
        name="description" 
        value={formData.description} 
        onChange={handleChange} 
        className="w-full p-2 mb-4 border rounded" 
      />
      <label className="block mb-2">Salary:</label>
      <input 
        type="text" 
        name="salary" 
        value={formData.salary} 
        onChange={handleChange} 
        className="w-full p-2 mb-4 border rounded" 
      />
      <label className="block mb-2">Location:</label>
      <input 
        type="text" 
        name="location" 
        value={formData.location} 
        onChange={handleChange} 
        className="w-full p-2 mb-4 border rounded" 
      />
      <button type="submit" className="bg-green-500 text-white p-2 rounded w-full">Post Job</button>
    </form>
  );
};

export default PostJob;
