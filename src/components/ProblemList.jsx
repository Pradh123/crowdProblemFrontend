import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Pagination from './Pagination';
import { Link } from 'react-router-dom';

function ProblemList({ myProblems = false }) {
  const [problems, setProblems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const endpoint = myProblems ? '/problems/my' : '/problems';
        const response = await api.get(endpoint);
        setProblems(response.data);
        setTotalPages(Math.ceil(response.data.length / pageSize));
      } catch (err) {
        console.error('Failed to fetch problems');
      }
    };
    fetchProblems();
  }, [myProblems]);

  const paginatedProblems = problems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        {myProblems ? 'My Problems' : 'All Problems'}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedProblems?.map((problem) => (
          <div
            key={problem._id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
          >
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
              <Link
                to={`/problems/${problem._id}`}
                className="inline-block bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                View Problem
              </Link>
            </div>
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

export default ProblemList;