import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ProblemList from '../components/ProblemList';

function Home() {
  const { user, loading } = useContext(AuthContext);
console.log("user----------> user",user)
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Banner Section */}
      <div className="flex flex-col items-center justify-center h-[60vh] bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to CrowdSolve
        </h1>
        <p className="text-lg md:text-xl mb-6 max-w-2xl">
          Post problems and collaborate on solutions!
        </p>
        {user ? (
          <p className="text-xl font-semibold">
            Welcome, {user.username || 'User'}!
          </p>
        ) : (
          <Link
            to="/signup"
            className="bg-white text-blue-600 font-medium py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors duration-200 shadow-md"
          >
            Register
          </Link>
        )}
      </div>
      {/* Problem List Section */}
      <div className="p-6 max-w-7xl mx-auto">
        <ProblemList />
      </div>
    </div>
  );
}

export default Home;