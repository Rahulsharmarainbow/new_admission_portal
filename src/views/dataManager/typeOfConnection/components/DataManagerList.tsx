import { useState, useEffect } from 'react';

interface DataManagerListProps {
  selectedAcademic: string;
  selectedType: string;
}

interface ListItem {
  id: number;
  name: string;
  created_at: string;
}

interface ListResponse {
  status: boolean;
  rows: ListItem[];
  total: number;
}

const DataManagerList = ({ selectedAcademic, selectedType }: DataManagerListProps) => {
  const [data, setData] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const fetchData = async (currentPage: number = 0) => {
    if (!selectedAcademic || !selectedType) {
      setData([]);
      setTotal(0);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const headers: HeadersInit = {
        'accept': '*/*',
        'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
        'origin': 'http://localhost:3010',
        'priority': 'u=1, i',
        'referer': 'http://localhost:3010/',
        'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3JhaW5ib3dzb2x1dGlvbmFuZHRlY2hub2xvZ3kuY29tL05ld0FkbWlzc2lvblBvcnRhbC9wdWJsaWMvYXBpL2F1dGgvdmVyaWZ5LW90cCIsImlhdCI6MTc1OTMwNjA1NywiZXhwIjoxNzYxODk4MDU3LCJuYmYiOjE3NTkzMDYwNTcsImp0aSI6IlRyUmhvcHdvYkJFNHBleHUiLCJzdWIiOiI0MzQiLCJlbWFpbCI6InNoYWFubXNrNEBnbWFpbC5jb20iLCJsb2dpbl90eXBlIjoxLCJyb2xlIjoiU1VQRVJBRE1JTiJ9.uU1-gvBhIrbSrnJ-2rvsBmRuGzpyE4DiazagpC61sZQ',
        'Content-Type': 'application/json'
      };

      const requestBody = {
        type: selectedType,
        s_id: 1,
        academic_id: parseInt(selectedAcademic),
        page: currentPage,
        rowsPerPage: rowsPerPage,
        order: "desc",
        orderBy: "id",
        search: ""
      };

      console.log('Fetching data with:', requestBody);

      const response = await fetch(
        'https://rainbowsolutionandtechnology.com/NewAdmissionPortal/public/api/SuperAdmin/DataManager/get-list',
        {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(requestBody)
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData: ListResponse = await response.json();
      console.log('List API Response:', responseData);
      
      if (responseData.status) {
        console.log(responseData.rows)
        setData(responseData.rows);
        setTotal(responseData.total);
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (err: any) {
      console.error('Error fetching list:', err);
      setError(`Failed to load data: ${err.message}`);
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    setPage(0);
    fetchData(0);
  }, [selectedAcademic, selectedType, rowsPerPage]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchData(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  if (!selectedAcademic || !selectedType) {
    return (
      <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg">
        <p className="text-gray-500 text-lg">
          {!selectedAcademic ? 'Please select an Academic' : 'Please select a Type'}
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-32 bg-red-50 rounded-lg">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">
          Data Manager List
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Showing data for {selectedType.replace(/_/g, ' ')} 
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.created_at}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {data.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No data found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {total > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              Showing {data.length} of {total} items
            </span>
            
            <select
              value={rowsPerPage}
              onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
              className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 0}
              className={`px-3 py-1 rounded border text-sm ${
                page === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            
            <span className="text-sm text-gray-700">
              Page {page + 1} of {Math.ceil(total / rowsPerPage)}
            </span>
            
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= Math.ceil(total / rowsPerPage) - 1}
              className={`px-3 py-1 rounded border text-sm ${
                page >= Math.ceil(total / rowsPerPage) - 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataManagerList;