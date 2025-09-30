import React from 'react';

// Define the properties required by the Pagination component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  possibleItemsPerPage?: number[];
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (perPage: number) => void;
}

/**
 * A reusable component for handling table pagination controls.
 * @param {number} currentPage - The currently active page (1-indexed).
 * @param {number} totalPages - The total number of pages.
 * @param {number} totalItems - The total number of items across all pages.
 * @param {number} itemsPerPage - The number of items to display per page.
 * @param {number[]} [possibleItemsPerPage=[5, 10, 20]] - Options for the rows per page dropdown.
 * @param {(page: number) => void} onPageChange - Callback for page navigation clicks.
 * @param {(perPage: number) => void} onItemsPerPageChange - Callback when rows per page changes.
 */
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  possibleItemsPerPage = [5, 10, 20],
  onPageChange,
  onItemsPerPageChange,
}) => {
  // Calculate the starting and ending index for the display text
  const startIndex = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);
  const displayRange = `${startIndex}-${endIndex} of ${totalItems}`;

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Call the external handler with the new number of items per page
    onItemsPerPageChange(Number(e.target.value));
  };
  
  const goToPrevPage = () => {
    // Calculate the new page, ensuring it doesn't go below 1
    onPageChange(Math.max(currentPage - 1, 1));
  };

  const goToNextPage = () => {
    // Calculate the new page, ensuring it doesn't exceed totalPages
    onPageChange(Math.min(currentPage + 1, totalPages));
  };

  return (
    // Responsive container for pagination controls
    <div className="flex flex-col sm:flex-row items-center justify-end mt-4 space-y-4 sm:space-y-0 text-sm">
      <div className="flex items-center space-x-2">
        {/* Rows per page selector */}
        <label className="text-gray-600">Rows per page:</label>
        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="p-1 border rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
        >
          {possibleItemsPerPage.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        
        {/* Item count display */}
        <span className="text-gray-600 ml-4 font-medium min-w-[120px] text-right">
          {displayRange}
        </span>
        
        {/* Previous Button */}
        <button
          onClick={goToPrevPage}
          disabled={currentPage === 1}
          className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 transition duration-150 ease-in-out"
          aria-label="Previous Page"
        >
          <svg className="w-5 h-5 text-gray-700 disabled:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {/* Next Button */}
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages || totalItems === 0}
          className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 transition duration-150 ease-in-out"
          aria-label="Next Page"
        >
          <svg className="w-5 h-5 text-gray-700 disabled:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
