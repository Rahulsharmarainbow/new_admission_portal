import React, { useState, useMemo } from 'react';
import { MdEdit, MdDelete } from 'react-icons/md';
import { BsArrowRightCircleFill } from 'react-icons/bs';
import { Button } from 'flowbite-react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

// Define the data structure for a single account row
interface Account {
  id: number;
  logoUrl: string;
  organizationName: string;
  type: 'School' | 'College';
  primaryEmail: string;
  website: string;
  isActive: boolean;
}

// Sample data to populate the table
const initialAccountsData: Account[] = [
  { id: 1, logoUrl: 'https://via.placeholder.com/40', organizationName: 'Cambridge University', type: 'College', primaryEmail: 'admissions@cam.ac.uk', website: 'https://www.cam.ac.uk', isActive: true },
  { id: 2, logoUrl: 'https://via.placeholder.com/40', organizationName: 'École Polytechnique', type: 'College', primaryEmail: 'contact@polytechnique.edu', website: 'https://www.polytechnique.edu', isActive: true },
  { id: 3, logoUrl: 'https://via.placeholder.com/40', organizationName: 'The Juilliard School', type: 'School', primaryEmail: 'info@juilliard.edu', website: 'https://www.juilliard.edu', isActive: true },
  { id: 4, logoUrl: 'https://via.placeholder.com/40', organizationName: 'University of Tokyo', type: 'College', primaryEmail: 'admissions@u-tokyo.ac.jp', website: 'https://www.u-tokyo.ac.jp', isActive: true },
  { id: 5, logoUrl: 'https://via.placeholder.com/40', organizationName: 'Zurich International School', type: 'School', primaryEmail: 'admissions@zis.ch', website: 'https://www.zis.ch', isActive: false },
  { id: 6, logoUrl: 'https://via.placeholder.com/40', organizationName: 'Hogwarts School of Witchcraft and Wizardry', type: 'School', primaryEmail: 'headmaster@hogwarts.uk', website: 'https://www.hogwarts.edu', isActive: true },
  { id: 7, logoUrl: 'https://via.placeholder.com/40', organizationName: 'University of Sydney', type: 'College', primaryEmail: 'info@sydney.edu.au', website: 'https://www.sydney.edu.au', isActive: true },
  { id: 8, logoUrl: 'https://via.placeholder.com/40', organizationName: 'Paris-Sorbonne University', type: 'College', primaryEmail: 'contact@sorbonne-universite.fr', website: 'https://www.sorbonne-universite.fr', isActive: true },
];

const AccountTable: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>(initialAccountsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sort, setSort] = useState({ key: '', direction: 'asc' });
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [accountToDeleteId, setAccountToDeleteId] = useState<number | null>(null);

  // Filter accounts based on search query
  const filteredAccounts = useMemo(() => {
    return accounts.filter(account =>
      account.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.primaryEmail.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, accounts]);

  // Sort the filtered accounts
  const sortedAccounts = useMemo(() => {
    if (sort.key) {
      return [...filteredAccounts].sort((a, b) => {
        const aValue = a[sort.key as keyof Account];
        const bValue = b[sort.key as keyof Account];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
          if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return filteredAccounts;
  }, [filteredAccounts, sort]);

  // Get current accounts for the current page
  const paginatedAccounts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedAccounts.slice(startIndex, endIndex);
  }, [sortedAccounts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedAccounts.length / itemsPerPage);

  const handleSort = (key: string) => {
    setSort(prevSort => ({
      key,
      direction: prevSort.key === key && prevSort.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (key: string) => {
    if (sort.key !== key) {
      return <FaSort className="text-gray-400" />;
    }
    if (sort.direction === 'asc') {
      return <FaSortUp className="text-gray-600" />;
    }
    return <FaSortDown className="text-gray-600" />;
  };

  // Handler to show the delete confirmation pop-up
  const handleDeleteClick = (id: number) => {
    setAccountToDeleteId(id);
    setShowDeletePopup(true);
  };

  // Handler to perform the deletion
  const confirmDelete = () => {
    if (accountToDeleteId !== null) {
      setAccounts(prevAccounts => prevAccounts.filter(account => account.id !== accountToDeleteId));
      setShowDeletePopup(false);
      setAccountToDeleteId(null);
    }
  };

  // Handler for the edit button
  const handleEdit = (id: number) => {
    // In a real application, you would navigate to an edit form or open a modal.
    // For this example, we'll just log the action.
    alert(`Editing account with ID: ${id}. This would navigate to an edit form.`);
  };

  // New handler to toggle the isActive state
  const toggleActiveStatus = (id: number) => {
    setAccounts(prevAccounts =>
      prevAccounts.map(account =>
        account.id === id ? { ...account, isActive: !account.isActive } : account
      )
    );
  };

  // Handler for "Make it Live" button
  const handleMakeLive = (id: number) => {
    alert(`Making account with ID: ${id} live. This would trigger a live deployment.`);
    // Add your make live logic here
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md relative overflow-x-auto">
      {/* Search bar is at the top */}
      <div className="flex justify-end mb-4">
        <div className="relative w-full sm:w-1/3">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Table Body */}
      <div className="shadow-md rounded-lg min-w-full">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="w-12 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                S.NO
              </th>
              <th scope="col" className="w-16 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Logo
              </th>
              <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none" onClick={() => handleSort('organizationName')}>
                <div className="flex items-center">
                  Organization Name {getSortIcon('organizationName')}
                </div>
              </th>
              <th scope="col" className="w-24 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none" onClick={() => handleSort('primaryEmail')}>
                <div className="flex items-center">
                  Primary Email {getSortIcon('primaryEmail')}
                </div>
              </th>
              <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Website
              </th>
              <th scope="col" className="w-64 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedAccounts.length > 0 ? (
              paginatedAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {account.id}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    <img src={account.logoUrl} alt={`${account.organizationName} logo`} className="h-10 w-10 rounded-full" />
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-blue-600 truncate">
                    {account.organizationName}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${account.type === 'School' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                      {account.type}
                    </span>
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 truncate">
                    {account.primaryEmail}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm">
                    <a href={account.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center">
                      Click here <BsArrowRightCircleFill className="ml-1" />
                    </a>
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Button 
                        color={account.isActive ? 'success' : 'light'} 
                        className="text-xs px-3 py-1"
                        onClick={() => toggleActiveStatus(account.id)}
                      >
                        {account.isActive ? 'Deactivate Now' : 'Activate Now'}
                      </Button>
                      <Button 
                        color="blue" 
                        className="text-xs px-3 py-1"
                        onClick={() => handleMakeLive(account.id)}
                      >
                        Make it Live
                      </Button>
                      <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEdit(account.id)}>
                        <MdEdit size={20} />
                      </button>
                      <button className="text-red-500 hover:text-red-700" onClick={() => handleDeleteClick(account.id)}>
                        <MdDelete size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls moved to the left */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 space-y-4 sm:space-y-0 text-sm">
        <div className="flex items-center space-x-2">
          <label className="text-gray-600">Rows per page:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="p-1 border rounded"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">
            {`${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, sortedAccounts.length)} of ${sortedAccounts.length}`}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Conditional Delete Pop-up */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this account?</p>
            <div className="flex justify-center space-x-4">
              <Button color="failure" onClick={confirmDelete}>
                Delete
              </Button>
              <Button color="light" onClick={() => setShowDeletePopup(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountTable;