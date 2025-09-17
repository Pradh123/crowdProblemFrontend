import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Pagination from './Pagination';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [problems, setProblems] = useState([]);
  const [currentPageUsers, setCurrentPageUsers] = useState(1);
  const [currentPageProblems, setCurrentPageProblems] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await api.get('/admin/users');
        setUsers(usersRes.data);
        const problemsRes = await api.get('/problems');
        setProblems(problemsRes.data);
      } catch (err) {
        console.error('Failed to fetch data');
      }
    };
    fetchData();
  }, []);

  const handleBanUser = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/ban`);
      // Refresh users
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to ban user');
    }
  };

  const handleDeleteProblem = async (problemId) => {
    try {
      await api.delete(`/admin/problems/${problemId}`);
      // Refresh problems
      const res = await api.get('/problems');
      setProblems(res.data);
    } catch (err) {
      console.error('Failed to delete problem');
    }
  };

  const paginatedUsers = users.slice((currentPageUsers - 1) * pageSize, currentPageUsers * pageSize);
  const paginatedProblems = problems.slice((currentPageProblems - 1) * pageSize, currentPageProblems * pageSize);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
      <h3 className="text-xl mb-2">Users</h3>
      {paginatedUsers?.map(user => (
        <div key={user._id} className="mb-2">
          {user.username} - {user.email}
          <button onClick={() => handleBanUser(user._id)} className="ml-4 text-red-500">Ban</button>
        </div>
      ))}
      <Pagination currentPage={currentPageUsers} totalPages={Math.ceil(users.length / pageSize)} onPageChange={setCurrentPageUsers} />

      <h3 className="text-xl mb-2 mt-6">Problems</h3>
      {paginatedProblems?.map(problem => (
        <div key={problem._id} className="mb-2">
          {problem.location}
          <button onClick={() => handleDeleteProblem(problem._id)} className="ml-4 text-red-500">Delete</button>
        </div>
      ))}
      <Pagination currentPage={currentPageProblems} totalPages={Math.ceil(problems.length / pageSize)} onPageChange={setCurrentPageProblems} />
    </div>
  );
}

export default AdminPanel;