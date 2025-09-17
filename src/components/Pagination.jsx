import React from 'react';

function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex justify-center mt-4">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`mx-1 p-2 rounded ${page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          {page}
        </button>
      ))}
    </div>
  );
}

export default Pagination;