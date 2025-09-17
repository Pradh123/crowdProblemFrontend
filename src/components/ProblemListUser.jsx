import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Pagination from './Pagination';
import { Link } from 'react-router-dom';
import ProblemForm from './ProblemForm';

function ProblemListUser({ myProblems = false }) {
  const [problems, setProblems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingProblemId, setEditingProblemId] = useState(null);
  const [error, setError] = useState(null);
  const pageSize = 8;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setError(null);
        const endpoint = myProblems ? '/problems/my' : '/problems';
        const response = await api.get(endpoint);
        setProblems(response.data);
        setTotalPages(Math.ceil(response.data.length / pageSize));
      } catch (err) {
        console.error('Failed to fetch problems:', err);
        if (err.response?.status === 401) {
          setError('Unauthorized: Please log in again.');
          // Optionally redirect to login
          navigate('/login');
        } else {
          setError('Failed to load problems. Please try again later.');
        }
      }
    };
    fetchProblems();
  }, [myProblems, navigate]);

  const handleDelete = async (id) => {
    try {
      setError(null);
      await api.delete(`/problems/${id}`);
      setProblems(problems.filter((problem) => problem._id !== id));
      // Recalculate total pages after deletion
      setTotalPages(Math.ceil((problems.length - 1) / pageSize));
      // If the current page becomes empty and isn't the first page, go to the previous page
      if (
        paginatedProblems.length === 1 &&
        currentPage > 1 &&
        currentPage > Math.ceil((problems.length - 1) / pageSize)
      ) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      console.error('Failed to delete problem:', err);
      if (err.response?.status === 401) {
        setError('Unauthorized: Please log in again.');
        navigate('/login');
      } else if (err.response?.status === 403) {
        setError('You do not have permission to delete this problem.');
      } else {
        setError('Failed to delete problem. Please try again.');
      }
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      setError(null);
      await api.put(`/problems/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const response = await api.get(`/problems/${id}`);
      setProblems(
        problems.map((problem) =>
          problem._id === id ? response.data : problem
        )
      );
      setEditingProblemId(null);
    } catch (err) {
      console.error('Failed to update problem:', err);
      if (err.response?.status === 401) {
        setError('Unauthorized: Please log in again.');
        navigate('/login');
      } else if (err.response?.status === 403) {
        setError('You do not have permission to edit this problem.');
      } else {
        setError('Failed to update problem. Please try again.');
      }
    }
  };

  const paginatedProblems = problems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        {myProblems ? 'My Problems' : 'All Problems'}
      </h2>
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedProblems?.map((problem) => (
          <div
            key={problem._id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
          >
            {editingProblemId === problem._id ? (
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Edit Problem
                </h3>
                <ProblemForm
                  onSubmit={(data) => handleUpdate(problem._id, data)}
                  initialData={problem}
                />
                <button
                  onClick={() => setEditingProblemId(null)}
                  className="mt-4 bg-gray-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {problem.location}
                </h3>
                {problem.image && (
                  <img
                    src={problem.image.url}
                    alt="Problem"
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                )}
                <div className="flex items-center space-x-4 mb-3">
                  <span className="text-sm font-medium text-green-600">
                    Upvotes: {problem.upvotes.length}
                  </span>
                  <span className="text-sm font-medium text-red-600">
                    Downvotes: {problem.downvotes.length}
                  </span>
                </div>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {problem.description}
                </p>
                <div className="flex space-x-3">
                  <Link
                    to={`/problems/${problem._id}`}
                    className="inline-block bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    View Problem
                  </Link>
                  <button
                    onClick={() => setEditingProblemId(problem._id)}
                    className="bg-green-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(problem._id)}
                    className="bg-red-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default ProblemListUser;