import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

function ProblemForm({ onSubmit, initialData = {} }) {
  const [formData, setFormData] = useState({
    location: initialData.location || '',
    description: initialData.description || '',
    image: null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to submit a problem.');
      navigate('/login');
      return;
    }

    setError('');
    setSuccess('');
    const data = new FormData();
    data.append('location', formData.location);
    data.append('description', formData.description);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      await onSubmit(data);
      setSuccess(
        initialData._id
          ? 'Problem updated successfully!'
          : 'Problem posted successfully!'
      );
      // Clear form for new problem submissions, but not for updates
      if (!initialData._id) {
        setFormData({ location: '', description: '', image: null });
        // Reset file input
        document.getElementById('image').value = '';
      }
    } catch (err) {
      console.error('Error submitting problem:', err);
      const errorMessage =
        err.response?.data?.message ||
        (err.response?.data?.errors
          ? err.response.data.errors.map((e) => e.msg).join(', ')
          : 'Failed to submit problem. Please try again.');
      setError(errorMessage);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {initialData._id ? 'Edit Problem' : 'Post Problem'}
      </h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
          {success}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="location"
          >
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            rows="4"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="image"
          >
            Image (Optional)
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          {initialData._id ? 'Update Problem' : 'Post Problem'}
        </button>
      </form>
    </div>
  );
}

export default ProblemForm;