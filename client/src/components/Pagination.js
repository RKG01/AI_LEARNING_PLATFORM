import React from 'react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  hasNextPage, 
  hasPrevPage, 
  onPageChange,
  totalItems,
  itemsPerPage,
  className = ''
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={`pagination-container ${className}`}>
      <div className="pagination-info">
        <span>
          Showing {startItem}-{endItem} of {totalItems} items
        </span>
      </div>
      
      <div className="pagination-controls">
        <button
          onClick={() => onPageChange(1)}
          disabled={!hasPrevPage}
          className="btn btn-secondary pagination-btn"
          title="First page"
        >
          ⏮️
        </button>
        
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          className="btn btn-secondary pagination-btn"
        >
          ← Previous
        </button>
        
        <div className="page-numbers">
          {/* Show page numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`btn pagination-btn ${
                  pageNum === currentPage ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className="btn btn-secondary pagination-btn"
        >
          Next →
        </button>
        
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNextPage}
          className="btn btn-secondary pagination-btn"
          title="Last page"
        >
          ⏭️
        </button>
      </div>
    </div>
  );
};

export default Pagination;