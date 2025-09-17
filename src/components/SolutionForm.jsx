import React, { useState } from 'react';
import api from '../services/api';

function SolutionForm({ problemId, onSubmit }) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/solutions/${problemId}`, { text });
      setText('');
      onSubmit();
    } catch (err) {
      setError('Failed to post solution');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="Suggest a solution..."
        required
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-2">
        Post Solution
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}

export default SolutionForm;