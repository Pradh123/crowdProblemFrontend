import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Pagination from './Pagination';

function SolutionList({ problemId }) {
  const [solutions, setSolutions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const response = await api.get(`/solutions/${problemId}`);
        setSolutions(response.data);
        setTotalPages(Math.ceil(response.data.length / pageSize));
      } catch (err) {
        console.error('Failed to fetch solutions');
      }
    };
    fetchSolutions();
  }, [problemId]);

  const handleVote = async (solutionId, type) => {
    try {
      await api.post(`/solutions/${solutionId}/${type}`);
      // Refresh solutions
      const response = await api.get(`/solutions/${problemId}`);
      setSolutions(response.data);
    } catch (err) {
      console.error('Failed to vote');
    }
  };

  const paginatedSolutions = solutions.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Solutions</h3>
      {paginatedSolutions?.map(solution => (
        <div key={solution._id} className="mb-4 p-4 bg-white rounded shadow">
          <p>{solution.text}</p>
          <p>Upvotes: {solution.upvotes.length} | Downvotes: {solution.downvotes.length}</p>
          <button onClick={() => handleVote(solution._id, 'upvote')} className="mr-2 text-blue-500">Upvote</button>
          <button onClick={() => handleVote(solution._id, 'downvote')} className="text-red-500">Downvote</button>
          {/* Comments can be added similarly */}
        </div>
      ))}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}

export default SolutionList;