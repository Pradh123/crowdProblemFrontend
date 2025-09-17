import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import AdminPage from './pages/AdminPage';
import Profile from './pages/Profile';
import ProblemDetail from './pages/ProblemDetail';
import './App.css'
function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/problems/:id" element={<ProblemDetail />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;