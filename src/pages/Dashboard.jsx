import React from 'react';

import ProblemForm from '../components/ProblemForm.jsx';
import api from '../services/api.js';
import ProblemListUser from '../components/ProblemListUser.jsx';

function Dashboard() {
  const handlePostProblem = async (data) => {
    try {
      await api.post('/problems', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      // Refresh problems
    } catch (err) {
      console.error('Failed to post problem');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <ProblemForm onSubmit={handlePostProblem} />
      <ProblemListUser myProblems={true} />
    </div>
  );
}

export default Dashboard;