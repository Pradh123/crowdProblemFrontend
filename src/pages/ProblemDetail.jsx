import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import SolutionList from '../components/SolutionList.jsx';
import SolutionForm from '../components/SolutionForm.jsx';
import ProblemForm from '../components/ProblemForm.jsx';
import { toast } from 'react-toastify';

function ProblemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await api.get(`/problems/${id}`);
        setProblem(response.data);
      } catch (err) {
        console.error('Failed to fetch problem');
      }
    };
    fetchProblem();
  }, [id]);

  const handleVote = async (type) => {
    try {
      await api.post(`/problems/${id}/${type}`);
      const response = await api.get(`/problems/${id}`);
      toast.success("clicked")
      setProblem(response.data);
    } catch (err) {
      toast.error("something went wrong")
    }
  };

  const handleUpdate = async (data) => {
    try {
      await api.put(`/problems/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setEditing(false);
      const response = await api.get(`/problems/${id}`);
      toast.success("updated")
      setProblem(response.data);
    } catch (err) {
      
      toast.error("Failed to update")
    }
  };

  const handlePostSolution = () => {
    // Refresh solutions (assuming SolutionList handles its own refresh)
  };

  if (!problem) return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-xl text-gray-600">Loading...</div>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {editing ? (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Problem</h2>
          <ProblemForm onSubmit={handleUpdate} initialData={problem} />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{problem.location}</h2>
          {problem.image && (
            <img
              src={problem.image.url}
              alt="Problem"
              className="w-full max-w-xl mx-auto h-64 object-cover rounded-lg mb-4"
            />
          )}
          <p className="text-gray-700 text-base mb-4">{problem.description}</p>
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-sm font-medium text-green-600">
              Upvotes: {problem.upvotes.length}
            </span>
            <span className="text-sm font-medium text-red-600">
              Downvotes: {problem.downvotes.length}
            </span>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => handleVote('upvote')}
              className="bg-green-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              Upvote
            </button>
            <button
              onClick={() => handleVote('downvote')}
              className="bg-red-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Downvote
            </button>
            {/* <button
              onClick={() => setEditing(true)}
              className="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Edit
            </button> */}
            {/* <button
              onClick={handleDelete}
              className="bg-gray-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              Delete
            </button> */}
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Add a Solution</h3>
        <SolutionForm problemId={id} onSubmit={handlePostSolution} />
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Solutions</h3>
        <SolutionList problemId={id} />
      </div>
    </div>
  );
}

export default ProblemDetail;