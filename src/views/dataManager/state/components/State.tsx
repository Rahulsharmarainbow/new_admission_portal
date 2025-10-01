import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Button,
  Table, 
  TableHead, 
  TableHeadCell, 
  TableBody, 
  TableRow, 
  TableCell, 
  Checkbox,
  TextInput,
  Spinner,
  Pagination,
  Tooltip,
  Modal, 
  ModalHeader, 
  ModalBody,   
  ModalFooter, 
} from 'flowbite-react';

// LATEST REVISION (R3) - Please ensure these packages are installed via npm/yarn.
import { IconSearch, IconTrash, IconEdit } from '@tabler/icons-react';
import { Toaster, toast } from 'react-hot-toast';
import { HiArrowSmDown, HiArrowSmUp } from 'react-icons/hi';
// Note: If 'lodash.debounce' causes an error, switch to 'import { debounce } from "lodash";' 
// and ensure '@types/lodash' is installed.
import debounce from "lodash.debounce"; 

// REQUIRED DEPENDENCIES
import DeleteConfirmationDialog from '../../../../views/commons/components/DeleteConfirmationDialog.tsx'; 
import AddState from './AddState'; // <-- Import the newly created AddState component

// --- TYPE DEFINITIONS ---
interface StateRow {
  state_id: number;
  state_title: string;
  state_description?: string;
  status?: number;
}

interface HeadCell {
  id: keyof StateRow | 's_no' | 'action';
  numeric: boolean;
  disablePadding: boolean;
  label: string;
}

type Order = 'asc' | 'desc';

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof StateRow | 's_no' | 'action') => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
  rows: StateRow[];
}


// --- TABLE LOGIC FUNCTIONS (Ensuring robustness) ---

const descendingComparator = (a: StateRow, b: StateRow, orderBy: keyof StateRow | 's_no' | 'action'): number => {
  if (orderBy === 's_no' || orderBy === 'action') return 0;

  // Type assertion is safe here as orderBy is guaranteed to be a key of StateRow if not 's_no' or 'action'
  const aVal = a[orderBy as keyof StateRow];
  const bVal = b[orderBy as keyof StateRow];
  
  // Handle null/undefined values by pushing them to the end (e.g., sort numerically)
  if (aVal === undefined || aVal === null) return 1;
  if (bVal === undefined || bVal === null) return -1;


  if (typeof aVal === 'string' && typeof bVal === 'string') {
      // Robust string comparison
      return bVal.localeCompare(aVal);
  }
  
  // Standard comparison logic (which you highlighted)
  if (bVal < aVal) {
    return -1;
  }
  if (bVal > aVal) {
    return 1;
  }
  return 0;
};

const getComparator = (order: Order, orderBy: keyof StateRow | 's_no' | 'action'): (a: StateRow, b: StateRow) => number => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

const stableSort = (array: StateRow[], comparator: (a: StateRow, b: StateRow) => number): StateRow[] => {
  const stabilizedThis = array.map((el, index) => [el, index] as [StateRow, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};


// --- TABLE HEAD COMPONENT (Flowbite Adaptation) ---

const headCells: HeadCell[] = [
  { id: 's_no', numeric: false, disablePadding: false, label: 'S.NO' },
  { id: 'state_title', numeric: false, disablePadding: false, label: 'State Name' },
  { id: 'action', numeric: false, disablePadding: false, label: 'Action' },
];

const EnhancedTableHead: React.FC<EnhancedTableProps> = (props) => {
  const { onSelectAllClick, order, orderBy, numSelected, onRequestSort, rows } = props;
  const createSortHandler = (property: keyof StateRow | 's_no' | 'action') => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  const isAllSelected = rows.length > 0 && numSelected === rows.length;

  return (
    <TableHead> 
      <TableHeadCell className="p-4 w-4"> 
        <Checkbox
          checked={isAllSelected}
          onChange={onSelectAllClick}
          className="rounded text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
        />
      </TableHeadCell>
      {headCells.map((headCell) => (
        <TableHeadCell 
          key={headCell.id}
          className="cursor-pointer"
          onClick={headCell.id !== 'action' && headCell.id !== 's_no' ? createSortHandler(headCell.id) : undefined}
          style={{ width: headCell.id === 'action' ? '120px' : 'auto' }}
        >
          <div className="flex items-center space-x-1">
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {headCell.label}
            </span>
            {headCell.id !== 'action' && headCell.id !== 's_no' && (
              <span className="text-gray-500 dark:text-gray-400">
                {orderBy === headCell.id ? (
                  order === 'desc' ? (
                    <HiArrowSmDown className="w-4 h-4" />
                  ) : (
                    <HiArrowSmUp className="w-4 h-4" />
                  )
                ) : (
                  <div className="w-4 h-4 opacity-0" /> 
                )}
              </span>
            )}
          </div>
        </TableHeadCell>
      ))}
    </TableHead>
  );
};

// --- MAIN COMPONENT ---

interface StateListProps {
  // handleClickAddFormOpen is no longer passed as a prop, but defined internally
}

const StateList: React.FC<StateListProps> = () => {
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<keyof StateRow | 's_no' | 'action'>('state_id');
  const [selected, setSelected] = useState<number[]>([]); 
  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState<StateRow[]>([]);
  const [search, setSearch] = useState('');
  const [totalRows, setTotalRows] = useState(0);
  const [singleDeleteDialogOpen, setSingleDeleteDialogOpen] = useState(false);
  const [multiDeleteDialogOpen, setMultiDeleteDialogOpen] = useState(false);
  const [dataToDelete, setDataToDelete] = useState<number | null>(null);
  // State for the Edit Modal
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedState, setSelectedState] = useState<StateRow | null>(null);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  // NEW: State for the Add Modal
  const [addDialogOpen, setAddDialogOpen] = useState(false); 


  const searchInputRef = useRef<HTMLInputElement>(null);

  // Mock data for demonstration
  const mockRows: StateRow[] = useMemo(() => ([
    { state_id: 1, state_title: 'California' },
    { state_id: 2, state_title: 'Texas' },
    { state_id: 3, state_title: 'New York' },
    { state_id: 4, state_title: 'Florida' },
    { state_id: 5, state_title: 'Illinois' },
    { state_id: 6, state_title: 'Pennsylvania' },
    { state_id: 7, state_title: 'Ohio' },
    { state_id: 8, state_title: 'Georgia' },
    { state_id: 9, state_title: 'North Carolina' },
    { state_id: 10, state_title: 'Michigan' },
    { state_id: 11, state_title: 'New Jersey' },
    { state_id: 12, state_title: 'Virginia' },
    { state_id: 13, state_title: 'Washington' },
    { state_id: 14, state_title: 'Arizona' },
    { state_id: 15, state_title: 'Massachusetts' },
  ]), []);


  // API Call logic (Mocked with local data)
  const fetchData = useCallback(async (query = search) => {
    setLoading(true);

    // --- MOCKING API call latency ---
    await new Promise(resolve => setTimeout(resolve, 500)); 

    let filteredRows = stableSort(mockRows, getComparator(order, orderBy));

    filteredRows = filteredRows.filter(row =>
      row.state_title.toLowerCase().includes(query.toLowerCase())
    );

    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    
    // Sort logic to simulate new data addition (simulate higher IDs for newer states)
    const sortedMockRows = [...mockRows].sort((a, b) => b.state_id - a.state_id);
    
    setRows(filteredRows.slice(start, end));
    setTotalRows(filteredRows.length);
    // --- End Mocking API call ---

    setLoading(false);
  }, [page, rowsPerPage, order, orderBy, search, mockRows]);

  // Debounced search handler setup
  const debouncedSearch = useRef(
    debounce((query: string) => {
      fetchData(query);
    }, 300)
  ).current;

  // Effect to fetch data on initial load and parameter changes
  useEffect(() => {
    fetchData();
    // Cleanup function for debounce
    return () => debouncedSearch.cancel();
  }, [page, rowsPerPage, order, orderBy, reload, fetchData, debouncedSearch]);


  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setPage(0); 
    setSearch(query);
    debouncedSearch(query);
  };


  const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof StateRow | 's_no' | 'action') => {
    if (property === 's_no' || property === 'action') return; 

    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    setPage(0); 
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.state_id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  /**
   * Handles individual row selection/deselection.
   * Renamed 'event' to '_event' to prevent unused variable warning.
   */
  const handleClick = (_event: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  };


  const handlePageChange = (newPage: number) => {
    // Flowbite Pagination is 1-indexed, convert to 0-indexed for internal state/API
    setPage(newPage - 1); 
  };
  
  // --- ADD HANDLERS (New) ---
  const handleClickAddFormOpen = () => {
    setAddDialogOpen(true);
  };

  const handleCloseAddForm = () => {
    setAddDialogOpen(false);
  };


  // --- DELETE HANDLERS ---

  const handleDeleteClick = (state: StateRow) => {
    setDataToDelete(state.state_id);
    setSingleDeleteDialogOpen(true);
  };

  const handleSingleDeleteConfirm = async () => {
    setSingleDeleteDialogOpen(false);
    
    // --- Mock Delete Logic ---
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`MOCK: Deleting single state ID: ${dataToDelete}`);
    toast.success("State deleted successfully (MOCK)");
    setSelected(selected.filter(id => id !== dataToDelete)); 
    setDataToDelete(null);
    setReload((prev) => !prev);
    // --- End Mock Delete Logic ---
  };

  const handleMultipleDelete = async () => {
    setMultiDeleteDialogOpen(false);

    // --- Mock Delete Logic ---
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`MOCK: Deleting multiple state IDs: ${selected.join(', ')}`);
    toast.success(`${selected.length} states deleted successfully (MOCK)`);
    setSelected([]);
    setReload((prev) => !prev);
    // --- End Mock Delete Logic ---
  };


  // --- EDIT HANDLERS (Simplified) ---

  const handleEditClickOpen = (state: StateRow) => {
    setSelectedState(state);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedState(null);
    setReload((prev) => !prev); 
  };


  const isSelected = (id: number) => selected.indexOf(id) !== -1;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Spinner size="xl" />
        <span className="ml-3 text-lg">Loading data...</span>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <Toaster />
      
      {/* Table Toolbar */}
      <div className={`flex items-center justify-between p-4 mb-4 rounded-lg 
        ${selected.length > 0 ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-gray-50 dark:bg-gray-700'} 
        transition-colors duration-200 border border-gray-200 dark:border-gray-700`}>
        
        {selected.length > 0 ? (
          <h6 className="text-xl text-gray-700 dark:text-gray-200 font-semibold">
            {selected.length} selected
          </h6>
        ) : (
          <div className="w-full max-w-xs">
            <TextInput
              icon={IconSearch}
              placeholder="Search State"
              value={search}
              onChange={handleSearchChange}
              ref={searchInputRef}
              className="w-full"
            />
          </div>
        )}

        <div className="flex space-x-2">
          {selected.length > 0 ? (
            <Tooltip content="Delete Selected">
              <Button color="failure" onClick={() => setMultiDeleteDialogOpen(true)} size="sm" pill>
                <IconTrash className="w-5 h-5 mr-1" />
                Delete ({selected.length})
              </Button>
            </Tooltip>
          ) : (
            <Button
              color="primary"
              onClick={handleClickAddFormOpen} // <-- Hooked up to open Add Modal
              size="sm"
            >
              Add State
            </Button>
          )}
        </div>
      </div>

      {/* Main Table Container */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <Table hoverable>
          <EnhancedTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
            rows={rows}
          />
          <TableBody className="divide-y"> 
            {rows.length > 0 ? (
              rows.map((row, index) => {
                const isItemSelected = isSelected(row.state_id);

                return (
                  <TableRow 
                    key={row.state_id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <TableCell className="p-4 w-4"> 
                      <Checkbox
                        checked={isItemSelected}
                        // Correctly passes the event and ID to the handleClick function
                        onChange={(e) => handleClick(e, row.state_id)} 
                        className="rounded text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                      />
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white"> 
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell>{row.state_title}</TableCell> 
                    <TableCell> 
                      <div className="flex space-x-2">
                        <Tooltip content="Edit">
                            <Button size="xs" color="light" onClick={() => handleEditClickOpen(row)} className="p-1">
                                <IconEdit className="w-4 h-4" />
                            </Button>
                        </Tooltip>
                        <Tooltip content="Delete">
                            <Button size="xs" color="light" onClick={() => handleDeleteClick(row)} className="p-1">
                                <IconTrash className="w-4 h-4 text-red-600" />
                            </Button>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow> 
                <TableCell colSpan={headCells.length + 1} className="text-center py-8"> 
                  <span className="text-gray-500 dark:text-gray-400">No states found.</span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center p-4 mt-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Showing {Math.min(totalRows, page * rowsPerPage + 1)} to {Math.min(totalRows, (page + 1) * rowsPerPage)} of {totalRows} entries
          </span>
          <Pagination 
              currentPage={page + 1} 
              totalPages={totalPages || 1} 
              onPageChange={handlePageChange} 
              showIcons
              className="self-end"
          />
      </div>

      {/* --- MODALS --- */}

      {/* 1. Add State Modal (New Integration) */}
      <AddState
        open={addDialogOpen}
        handleClose={handleCloseAddForm}
        setReload={setReload}
      />

      {/* 2. Single Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={singleDeleteDialogOpen}
        title="Confirm Deletion"
        content={`Are you sure you want to delete state "${rows.find(r => r.state_id === dataToDelete)?.state_title || 'item'}"? This action cannot be undone.`}
        onClose={() => setSingleDeleteDialogOpen(false)}
        onConfirm={handleSingleDeleteConfirm}
      />

      {/* 3. Multiple Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={multiDeleteDialogOpen}
        title="Confirm Multiple Deletion"
        content={`Are you sure you want to delete the ${selected.length} selected items? This action cannot be undone.`}
        onClose={() => setMultiDeleteDialogOpen(false)}
        onConfirm={handleMultipleDelete}
      />
      
      {/* 4. MOCK EDIT STATE MODAL */}
      {editDialogOpen && selectedState && (
        <Modal show={editDialogOpen} size="lg" onClose={handleEditDialogClose} dismissible>
          <ModalHeader>Edit State: {selectedState.state_title}</ModalHeader> 
          <ModalBody>
            <div className="space-y-6">
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                This is a placeholder for the **Edit State form**.
              </p>
              <TextInput 
                id="stateTitle" 
                placeholder="State Title"
                defaultValue={selectedState.state_title} 
                required 
              />
              <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                 <IconEdit className="w-5 h-5"/> 
                 <span>State ID: {selectedState.state_id}</span>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            {/* Mock Save button that just closes the dialog and reloads the list */}
            <Button onClick={handleEditDialogClose}>Save (Mock)</Button>
            <Button color="gray" onClick={handleEditDialogClose}>Cancel</Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
};

export default StateList;
















// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { Toaster, toast } from 'react-hot-toast';

// // --- INLINE SVG ICON COMPONENTS (Replacing lucide-react, etc.) ---
// // These components use React.SVGProps<SVGSVGElement> for correct TypeScript spread argument handling.

// const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
//   <svg 
//     xmlns="http://www.w3.org/2000/svg" 
//     width="24" height="24" 
//     viewBox="0 0 24 24" 
//     fill="none" 
//     stroke="currentColor" 
//     strokeWidth="2" 
//     strokeLinecap="round" 
//     strokeLinejoin="round" 
//     {...props}
//   >
//     <circle cx="11" cy="11" r="8" />
//     <path d="m21 21-4.3-4.3" />
//   </svg>
// );

// const Trash2Icon = (props: React.SVGProps<SVGSVGElement>) => (
//   <svg 
//     xmlns="http://www.w3.org/2000/svg" 
//     width="24" height="24" 
//     viewBox="0 0 24 24" 
//     fill="none" 
//     stroke="currentColor" 
//     strokeWidth="2" 
//     strokeLinecap="round" 
//     strokeLinejoin="round" 
//     {...props}
//   >
//     <path d="M3 6h18" />
//     <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
//     <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
//     <line x1="10" x2="10" y1="11" y2="17" />
//     <line x1="14" x2="14" y1="11" y2="17" />
//   </svg>
// );

// const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (
//   <svg 
//     xmlns="http://www.w3.org/2000/svg" 
//     width="24" height="24" 
//     viewBox="0 0 24 24" 
//     fill="none" 
//     stroke="currentColor" 
//     strokeWidth="2" 
//     strokeLinecap="round" 
//     strokeLinejoin="round" 
//     {...props}
//   >
//     <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
//   </svg>
// );

// const ArrowDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
//   <svg 
//     xmlns="http://www.w3.org/2000/svg" 
//     width="24" height="24" 
//     viewBox="0 0 24 24" 
//     fill="none" 
//     stroke="currentColor" 
//     strokeWidth="2" 
//     strokeLinecap="round" 
//     strokeLinejoin="round" 
//     {...props}
//   >
//     <path d="M12 5v14" />
//     <path d="m19 12-7 7-7-7" />
//   </svg>
// );

// const ArrowUpIcon = (props: React.SVGProps<SVGSVGElement>) => (
//   <svg 
//     xmlns="http://www.w3.org/2000/svg" 
//     width="24" height="24" 
//     viewBox="0 0 24 24" 
//     fill="none" 
//     stroke="currentColor" 
//     strokeWidth="2" 
//     strokeLinecap="round" 
//     strokeLinejoin="round" 
//     {...props}
//   >
//     <path d="M12 19V5" />
//     <path d="m5 12 7-7 7 7" />
//   </svg>
// );

// const Loader2Icon = (props: React.SVGProps<SVGSVGElement>) => (
//   <svg 
//     xmlns="http://www.w3.org/2000/svg" 
//     width="24" height="24" 
//     viewBox="0 0 24 24" 
//     fill="none" 
//     stroke="currentColor" 
//     strokeWidth="2" 
//     strokeLinecap="round" 
//     strokeLinejoin="round" 
//     {...props}
//   >
//     <path d="M21 12a9 9 0 1 1-6.219-8.56" />
//   </svg>
// );

// // --- TYPE DEFINITIONS ---
// interface StateRow {
//   state_id: number;
//   state_title: string;
//   state_description?: string;
//   status?: number;
// }

// interface HeadCell {
//   id: keyof StateRow | 's_no' | 'action';
//   numeric: boolean;
//   disablePadding: boolean;
//   label: string;
// }

// type Order = 'asc' | 'desc';

// interface EnhancedTableProps {
//   numSelected: number;
//   onRequestSort: (event: React.MouseEvent<unknown>, property: keyof StateRow | 's_no' | 'action') => void;
//   onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
//   order: Order;
//   orderBy: string;
//   rowCount: number;
//   rows: StateRow[];
// }


// // --- UTILITY FUNCTIONS ---

// /**
//  * Custom hook for simple debouncing logic, replacing external library dependency.
//  */
// const useDebounce = (callback: (query: string) => void, delay: number) => {
//     const timeoutRef = useRef<number | undefined>();

//     return useCallback((...args: any[]) => {
//         if (timeoutRef.current) {
//             clearTimeout(timeoutRef.current);
//         }
//         timeoutRef.current = window.setTimeout(() => {
//             callback(...args);
//         }, delay);
//     }, [callback, delay]);
// };


// const descendingComparator = (a: StateRow, b: StateRow, orderBy: keyof StateRow | 's_no' | 'action'): number => {
//   if (orderBy === 's_no' || orderBy === 'action') return 0;

//   const aVal = a[orderBy as keyof StateRow];
//   const bVal = b[orderBy as keyof StateRow];
  
//   if (aVal === undefined || aVal === null) return 1;
//   if (bVal === undefined || bVal === null) return -1;

//   if (typeof aVal === 'string' && typeof bVal === 'string') {
//       return bVal.localeCompare(aVal);
//   }
  
//   if (bVal < aVal) {
//     return -1;
//   }
//   if (bVal > aVal) {
//     return 1;
//   }
//   return 0;
// };

// const getComparator = (order: Order, orderBy: keyof StateRow | 's_no' | 'action'): (a: StateRow, b: StateRow) => number => {
//   return order === 'desc'
//     ? (a, b) => descendingComparator(a, b, orderBy)
//     : (a, b) => -descendingComparator(a, b, orderBy);
// };

// const stableSort = (array: StateRow[], comparator: (a: StateRow, b: StateRow) => number): StateRow[] => {
//   const stabilizedThis = array.map((el, index) => [el, index] as [StateRow, number]);
//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) {
//       return order;
//     }
//     return a[1] - b[1];
//   });
//   return stabilizedThis.map((el) => el[0]);
// };


// // --- MOCK DEPENDENCIES (Refactored using Tailwind for Modal/UI components) ---

// /**
//  * MOCK: DeleteConfirmationDialog Component (Tailwind/HTML Modal replacement)
//  */
// interface DeleteConfirmationDialogProps {
//     open: boolean;
//     title: string;
//     content: string;
//     onClose: () => void;
//     onConfirm: () => void;
// }

// const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({ 
//     open, 
//     title, 
//     content, 
//     onClose, 
//     onConfirm 
// }) => {
//     if (!open) return null;

//     return (
//         <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex justify-center items-center backdrop-blur-sm">
//             <div className="relative w-full max-w-md p-6 bg-white rounded-xl shadow-2xl dark:bg-gray-800 transform transition-all scale-100 duration-300">
//                 <div className="flex justify-between items-start">
//                     <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
//                     <button 
//                         onClick={onClose} 
//                         className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
//                         aria-label="Close"
//                     >
//                         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
//                     </button>
//                 </div>
//                 <div className="py-8 text-center">
//                     <Trash2Icon className="mx-auto mb-4 h-14 w-14 text-red-500" />
//                     <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
//                         {content}
//                     </h3>
//                     <div className="flex justify-center gap-4">
//                         <button 
//                             className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:focus:ring-red-800 transition duration-150 shadow-md"
//                             onClick={onConfirm}
//                         >
//                             Yes, I'm sure
//                         </button>
//                         <button 
//                             className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 transition duration-150 shadow-sm"
//                             onClick={onClose}
//                         >
//                             No, cancel
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };


// /**
//  * MOCK: AddState Component (Tailwind/HTML Modal replacement)
//  */
// interface AddStateProps {
//     open: boolean;
//     onClose: () => void;
//     onSaveSuccess: () => void; 
// }

// const AddState: React.FC<AddStateProps> = ({ open, onClose, onSaveSuccess }) => {
//     if (!open) return null;

//     const handleMockSave = () => {
//         // Mock API call simulation
//         toast.success("State added successfully (MOCK)");
//         onSaveSuccess();
//         onClose();
//     };

//     return (
//         <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex justify-center items-center backdrop-blur-sm">
//             <div className="relative w-full max-w-lg p-6 bg-white rounded-xl shadow-2xl dark:bg-gray-800 transform transition-all scale-100 duration-300">
//                 <div className="flex justify-between items-center pb-4 border-b dark:border-gray-700">
//                     <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Add New State</h3>
//                     <button 
//                         onClick={onClose} 
//                         className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
//                         aria-label="Close"
//                     >
//                         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
//                     </button>
//                 </div>

//                 <div className="space-y-6 py-6">
//                     <p className="text-sm text-gray-500 dark:text-gray-400">
//                         Enter the details for the new state/region.
//                     </p>
//                     <div>
//                         <label htmlFor="stateTitle" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">State Title</label>
//                         <input
//                             type="text"
//                             id="stateTitle" 
//                             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 shadow-inner"
//                             placeholder="e.g., California"
//                             required 
//                         />
//                     </div>
//                 </div>

//                 <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
//                     <button 
//                         onClick={handleMockSave}
//                         className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition duration-150 shadow-md"
//                     >
//                         Save State
//                     </button>
//                     <button 
//                         onClick={onClose}
//                         className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 transition duration-150 shadow-sm"
//                     >
//                         Cancel
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };


// // --- TABLE HEAD COMPONENT (Refactored to HTML/Tailwind) ---

// const headCells: HeadCell[] = [
//   { id: 's_no', numeric: false, disablePadding: false, label: 'S.NO' },
//   { id: 'state_title', numeric: false, disablePadding: false, label: 'State Name' },
//   { id: 'action', numeric: false, disablePadding: false, label: 'Action' },
// ];

// const EnhancedTableHead: React.FC<EnhancedTableProps> = (props) => {
//   const { onSelectAllClick, order, orderBy, numSelected, onRequestSort, rows } = props;
//   const createSortHandler = (property: keyof StateRow | 's_no' | 'action') => (event: React.MouseEvent<unknown>) => {
//     onRequestSort(event, property);
//   };

//   const isAllSelected = rows.length > 0 && numSelected === rows.length;

//   return (
//     <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"> 
//       <tr> 
//         <th scope="col" className="p-4 w-4"> 
//           <input
//             type="checkbox"
//             checked={isAllSelected}
//             onChange={onSelectAllClick}
//             className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
//           />
//         </th>
//         {headCells.map((headCell) => (
//           <th 
//             scope="col"
//             key={headCell.id}
//             className={`px-6 py-3 ${headCell.id !== 'action' && headCell.id !== 's_no' ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600' : ''}`}
//             onClick={headCell.id !== 'action' && headCell.id !== 's_no' ? createSortHandler(headCell.id) : undefined}
//             style={{ width: headCell.id === 'action' ? '120px' : 'auto' }}
//           >
//             <div className="flex items-center space-x-1">
//               <span className="font-semibold">
//                 {headCell.label}
//               </span>
//               {headCell.id !== 'action' && headCell.id !== 's_no' && (
//                 <span className="text-gray-500 dark:text-gray-400">
//                   {orderBy === headCell.id ? (
//                     order === 'desc' ? (
//                       <ArrowDownIcon className="w-4 h-4" />
//                     ) : (
//                       <ArrowUpIcon className="w-4 h-4" />
//                     )
//                   ) : (
//                     <div className="w-4 h-4 opacity-0" /> 
//                   )}
//                 </span>
//               )}
//             </div>
//           </th>
//         ))}
//       </tr>
//     </thead>
//   );
// };


// // --- PAGINATION COMPONENT (Refactored to HTML/Tailwind) ---
// interface PaginationControlsProps {
//     page: number;
//     rowsPerPage: number;
//     totalRows: number;
//     onPageChange: (page: number) => void;
// }

// /**
//  * Encapsulates the table's footer containing pagination details and controls.
//  */
// const PaginationControls: React.FC<PaginationControlsProps> = ({
//     page,
//     rowsPerPage,
//     totalRows,
//     onPageChange
// }) => {
//     // Calculate total pages (ensures at least 1 page if totalRows is 0)
//     const totalPages = Math.ceil(totalRows / rowsPerPage) || 1;
    
//     // Calculate display range
//     const startEntry = Math.min(totalRows, page * rowsPerPage + 1);
//     const endEntry = Math.min(totalRows, (page + 1) * rowsPerPage);

//     // Pagination display is 1-indexed
//     const currentPageDisplay = page + 1; 

//     const handlePrevious = () => {
//         if (currentPageDisplay > 1) {
//             // Internal state is 0-indexed, but onPageChange expects 1-indexed
//             onPageChange(currentPageDisplay - 1); 
//         }
//     };

//     const handleNext = () => {
//         if (currentPageDisplay < totalPages) {
//             // Internal state is 0-indexed, but onPageChange expects 1-indexed
//             onPageChange(currentPageDisplay + 1); 
//         }
//     };
    
//     // Generate page numbers for display, handling large totalPages by showing a condensed set
//     const getPageNumbers = () => {
//         const delta = 2; // Show 2 pages before and after current
//         const range = [];

//         for (let i = 1; i <= totalPages; i++) {
//             if (i === 1 || i === totalPages || (i >= currentPageDisplay - delta && i <= currentPageDisplay + delta)) {
//                 range.push(i);
//             }
//         }
        
//         // Add ellipses logic
//         const pagesWithEllipses: (number | string)[] = [];
//         let last = 0;
//         for (let i of range) {
//             if (i - last > 1) {
//                 pagesWithEllipses.push('...');
//             }
//             pagesWithEllipses.push(i);
//             last = i;
//         }
//         return pagesWithEllipses;
//     };


//     return (
//         <div className="flex flex-col sm:flex-row justify-between items-center p-4 mt-4 space-y-4 sm:space-y-0">
//             <span className="text-sm text-gray-500 dark:text-gray-400">
//                 Showing {startEntry} to {endEntry} of {totalRows} entries
//             </span>
            
//             <nav className="flex items-center space-x-1" aria-label="Pagination">
//                 <button
//                     onClick={handlePrevious}
//                     disabled={currentPageDisplay === 1}
//                     className="p-2 border border-gray-300 rounded-lg text-gray-500 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 hover:bg-gray-100 disabled:opacity-50 transition duration-150"
//                     aria-label="Previous Page"
//                 >
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
//                 </button>
                
//                 {getPageNumbers().map((p, index) => {
//                     if (p === '...') {
//                         return (
//                             <span key={index} className="px-3 py-1 text-sm text-gray-500 dark:text-gray-400">...</span>
//                         );
//                     }
//                     const pageNumber = p as number;
//                     return (
//                         <button
//                             key={pageNumber}
//                             onClick={() => onPageChange(pageNumber)}
//                             aria-current={pageNumber === currentPageDisplay ? 'page' : undefined}
//                             className={`px-3 py-1 text-sm font-medium rounded-lg transition duration-150 
//                                 ${pageNumber === currentPageDisplay 
//                                     ? 'bg-blue-600 text-white dark:bg-blue-500 shadow-md' 
//                                     : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
//                                 }`}
//                         >
//                             {pageNumber}
//                         </button>
//                     );
//                 })}

//                 <button
//                     onClick={handleNext}
//                     disabled={currentPageDisplay === totalPages || totalRows === 0}
//                     className="p-2 border border-gray-300 rounded-lg text-gray-500 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 hover:bg-gray-100 disabled:opacity-50 transition duration-150"
//                     aria-label="Next Page"
//                 >
//                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
//                 </button>
//             </nav>
//         </div>
//     );
// };


// // --- MAIN COMPONENT ---

// const StateList: React.FC = () => {
//   const [order, setOrder] = useState<Order>('desc');
//   const [orderBy, setOrderBy] = useState<keyof StateRow | 's_no' | 'action'>('state_id');
//   const [selected, setSelected] = useState<number[]>([]); 
//   const [page, setPage] = useState(0); 
//   const [rowsPerPage] = useState(10); 
//   const [rows, setRows] = useState<StateRow[]>([]);
//   const [search, setSearch] = useState('');
//   const [totalRows, setTotalRows] = useState(0);
//   const [singleDeleteDialogOpen, setSingleDeleteDialogOpen] = useState(false);
//   const [multiDeleteDialogOpen, setMultiDeleteDialogOpen] = useState(false);
//   const [dataToDelete, setDataToDelete] = useState<number | null>(null);
//   const [editDialogOpen, setEditDialogOpen] = useState(false);
//   const [selectedState, setSelectedState] = useState<StateRow | null>(null);
//   const [reload, setReload] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [addDialogOpen, setAddDialogOpen] = useState(false); 


//   const searchInputRef = useRef<HTMLInputElement>(null);

//   // Mock data for demonstration - use state here to allow addition/deletion to reflect in the UI reload
//   const [mockData, setMockData] = useState<StateRow[]>(
//     [
//         { state_id: 1, state_title: 'California' },
//         { state_id: 2, state_title: 'Texas' },
//         { state_id: 3, state_title: 'New York' },
//         { state_id: 4, state_title: 'Florida' },
//         { state_id: 5, state_title: 'Illinois' },
//         { state_id: 6, state_title: 'Pennsylvania' },
//         { state_id: 7, state_title: 'Ohio' },
//         { state_id: 8, state_title: 'Georgia' },
//         { state_id: 9, state_title: 'North Carolina' },
//         { state_id: 10, state_title: 'Michigan' },
//         { state_id: 11, state_title: 'New Jersey' },
//         { state_id: 12, state_title: 'Virginia' },
//         { state_id: 13, state_title: 'Washington' },
//         { state_id: 14, state_title: 'Arizona' },
//         { state_id: 15, state_title: 'Massachusetts' },
//         { state_id: 16, state_title: 'Indiana' },
//         { state_id: 17, state_title: 'Colorado' },
//         { state_id: 18, state_title: 'Tennessee' },
//         { state_id: 19, state_title: 'Maryland' },
//         { state_id: 20, state_title: 'Missouri' },
//         { state_id: 21, state_title: 'Wisconsin' },
//         { state_id: 22, state_title: 'Minnesota' },
//         { state_id: 23, state_title: 'South Carolina' },
//         { state_id: 24, state_title: 'Alabama' },
//         { state_id: 25, state_title: 'Louisiana' },
//     ]
//   );

//   // API Call logic (Mocked with local data)
//   const fetchData = useCallback(async (query = search) => {
//     setLoading(true);

//     // --- MOCKING API call latency ---
//     await new Promise(resolve => setTimeout(resolve, 500)); 

//     let filteredRows = [...mockData];

//     // 1. Filtering
//     filteredRows = filteredRows.filter(row =>
//       row.state_title.toLowerCase().includes(query.toLowerCase())
//     );
    
//     // 2. Sorting
//     filteredRows = stableSort(filteredRows, getComparator(order, orderBy));

//     // 3. Pagination
//     const start = page * rowsPerPage;
//     const end = start + rowsPerPage;
    
//     setRows(filteredRows.slice(start, end));
//     setTotalRows(filteredRows.length);
//     setSelected([]); // Clear selection on data reload
    
//     // --- End Mocking API call ---
//     setLoading(false);
//   }, [page, rowsPerPage, order, orderBy, search, mockData]);

//   // Debounced search handler setup
//   const debouncedSearch = useDebounce(fetchData, 300);

//   // Effect to fetch data on initial load and parameter changes (page, order, reload)
//   useEffect(() => {
//     fetchData();
//   }, [page, rowsPerPage, order, orderBy, reload, fetchData]);


//   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const query = event.target.value;
//     setPage(0); 
//     setSearch(query);
//     debouncedSearch(query);
//   };


//   const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof StateRow | 's_no' | 'action') => {
//     if (property === 's_no' || property === 'action') return; 

//     const isAsc = orderBy === property && order === 'asc';
//     setOrder(isAsc ? 'desc' : 'asc');
//     setOrderBy(property);
//     setPage(0); 
//   };

//   const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.checked) {
//       const newSelecteds = rows.map((n) => n.state_id);
//       setSelected(newSelecteds);
//       return;
//     }
//     setSelected([]);
//   };

//   const handleClick = (_event: React.ChangeEvent<HTMLInputElement>, id: number) => {
//     const selectedIndex = selected.indexOf(id);
//     let newSelected: number[] = [];

//     if (selectedIndex === -1) {
//       newSelected = newSelected.concat(selected, id);
//     } else if (selectedIndex === 0) {
//       newSelected = newSelected.concat(selected.slice(1));
//     } else if (selectedIndex === selected.length - 1) {
//       newSelected = newSelected.concat(selected.slice(0, -1));
//     } else if (selectedIndex > 0) {
//       newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
//     }

//     setSelected(newSelected);
//   };


//   const handlePageChange = (newPage: number) => {
//     // Input is 1-indexed, convert to 0-indexed for internal state/API
//     setPage(newPage - 1); 
//   };
  
//   // --- ADD HANDLERS ---
//   const handleClickAddFormOpen = () => {
//     setAddDialogOpen(true);
//   };

//   const handleCloseAddForm = () => {
//     setAddDialogOpen(false);
//   };
  
//   // Logic to simulate adding a new state
//   const handleAddSuccess = () => {
//     const newId = Math.max(...mockData.map(r => r.state_id)) + 1;
//     const newRow: StateRow = { state_id: newId, state_title: `New State ${newId}` };
//     setMockData(prev => [...prev, newRow]);
//     setReload(prev => !prev);
//   }


//   // --- DELETE HANDLERS ---

//   const handleDeleteClick = (state: StateRow) => {
//     setDataToDelete(state.state_id);
//     setSingleDeleteDialogOpen(true);
//   };

//   const handleSingleDeleteConfirm = async () => {
//     setSingleDeleteDialogOpen(false);
    
//     // --- Mock Delete Logic ---
//     await new Promise(resolve => setTimeout(resolve, 500));
//     setMockData(prev => prev.filter(r => r.state_id !== dataToDelete));
//     toast.success("State deleted successfully (MOCK)");
//     setSelected(selected.filter(id => id !== dataToDelete)); 
//     setDataToDelete(null);
//     setReload((prev) => !prev);
//     // --- End Mock Delete Logic ---
//   };

//   const handleMultipleDelete = async () => {
//     setMultiDeleteDialogOpen(false);
//     // --- Mock Delete Logic ---
//     await new Promise(resolve => setTimeout(resolve, 500));
//     setMockData(prev => prev.filter(r => !selected.includes(r.state_id)));
//     toast.success(`${selected.length} states deleted successfully (MOCK)`);
//     setSelected([]);
//     setReload((prev) => !prev);
//     // --- End Mock Delete Logic ---
//   };


//   // --- EDIT HANDLERS (Simplified) ---

//   const handleEditClickOpen = (state: StateRow) => {
//     setSelectedState(state);
//     setEditDialogOpen(true);
//   };

//   const handleEditDialogClose = () => {
//     setEditDialogOpen(false);
//     setSelectedState(null);
//     setReload((prev) => !prev); 
//   };


//   const isSelected = (id: number) => selected.indexOf(id) !== -1;

//   if (loading && rows.length === 0) {
//     return (
//       <div className="flex justify-center items-center h-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
//         <Loader2Icon className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
//         <span className="ml-3 text-lg text-gray-700 dark:text-gray-200">Loading data...</span>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl font-inter">
//       <Toaster position="top-right" />
      
//       <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">State List Management (Mock)</h2>
//       <hr className="mb-4 border-gray-200 dark:border-gray-700"/>

//       {/* Table Toolbar */}
//       <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 mb-4 rounded-lg 
//         ${selected.length > 0 ? 'bg-blue-50 dark:bg-blue-900/50' : 'bg-gray-50 dark:bg-gray-700'} 
//         transition-colors duration-200 border border-gray-200 dark:border-gray-700 shadow-sm`}>
        
//         {selected.length > 0 ? (
//           <h6 className="text-xl text-gray-700 dark:text-gray-200 font-semibold mb-2 sm:mb-0">
//             {selected.length} state(s) selected
//           </h6>
//         ) : (
//           <div className="w-full max-w-xs mb-2 sm:mb-0 relative">
//             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                 <SearchIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search State"
//               value={search}
//               onChange={handleSearchChange}
//               ref={searchInputRef}
//               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 shadow-inner"
//             />
//           </div>
//         )}

//         <div className="flex space-x-2">
//           {selected.length > 0 ? (
//             <button 
//                 title="Delete Selected"
//                 className="flex items-center text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-4 py-2 dark:focus:ring-red-800 transition duration-150 shadow-lg"
//                 onClick={() => setMultiDeleteDialogOpen(true)} 
//             >
//                 <Trash2Icon className="w-5 h-5 mr-1" />
//                 <span className="hidden sm:inline">Delete ({selected.length})</span>
//             </button>
//           ) : (
//             <button
//               className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition duration-150 shadow-md"
//               onClick={handleClickAddFormOpen}
//             >
//               Add State
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Main Table Container */}
//       <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-md">
//         <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
//           <EnhancedTableHead
//             numSelected={selected.length}
//             order={order}
//             orderBy={orderBy}
//             onSelectAllClick={handleSelectAllClick}
//             onRequestSort={handleRequestSort}
//             rowCount={rows.length}
//             rows={rows}
//           />
//           <tbody> 
//             {loading && rows.length === 0 ? (
//                  <tr> 
//                     <td colSpan={headCells.length + 1} className="text-center py-8"> 
//                         <Loader2Icon className="w-6 h-6 animate-spin mx-auto text-blue-600 dark:text-blue-400" />
//                     </td>
//                 </tr>
//             ) : (rows.length > 0 ? (
//               rows.map((row, index) => {
//                 const isItemSelected = isSelected(row.state_id);

//                 return (
//                   <tr 
//                     key={row.state_id}
//                     className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition duration-100"
//                   >
//                     <td className="p-4 w-4"> 
//                       <input
//                         type="checkbox"
//                         checked={isItemSelected}
//                         onChange={(e) => handleClick(e, row.state_id)} 
//                         className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
//                       />
//                     </td>
//                     <th scope="row" className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white"> 
//                       {page * rowsPerPage + index + 1}
//                     </th>
//                     <td className="px-6 py-4">{row.state_title}</td> 
//                     <td className="px-6 py-4"> 
//                       <div className="flex space-x-2">
//                         <button 
//                             title="Edit"
//                             onClick={() => handleEditClickOpen(row)} 
//                             className="p-2 text-blue-600 dark:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition duration-150"
//                         >
//                             <EditIcon className="w-4 h-4" />
//                         </button>
//                         <button 
//                             title="Delete"
//                             onClick={() => handleDeleteClick(row)} 
//                             className="p-2 text-red-600 dark:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition duration-150"
//                         >
//                             <Trash2Icon className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })
//             ) : (
//               <tr> 
//                 <td colSpan={headCells.length + 1} className="text-center py-8"> 
//                   <span className="text-gray-500 dark:text-gray-400">No states found. Try adjusting your search or adding a new state.</span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination (Refactored Component) */}
//       <PaginationControls
//         page={page}
//         rowsPerPage={rowsPerPage}
//         totalRows={totalRows}
//         onPageChange={handlePageChange}
//       />


//       {/* Single Delete Confirmation Dialog (MOCK) */}
//       <DeleteConfirmationDialog
//         open={singleDeleteDialogOpen}
//         title="Confirm Deletion"
//         content={`Are you sure you want to delete state "${mockData.find(r => r.state_id === dataToDelete)?.state_title || 'item'}"? This action cannot be undone.`}
//         onClose={() => setSingleDeleteDialogOpen(false)}
//         onConfirm={handleSingleDeleteConfirm}
//       />

//       {/* Multiple Delete Confirmation Dialog (MOCK) */}
//       <DeleteConfirmationDialog
//         open={multiDeleteDialogOpen}
//         title="Confirm Multiple Deletion"
//         content={`Are you sure you want to delete the ${selected.length} selected item(s)? This action cannot be undone.`}
//         onClose={() => setMultiDeleteDialogOpen(false)}
//         onConfirm={handleMultipleDelete}
//       />
      
//       {/* MOCK ADD STATE MODAL */}
//       <AddState 
//         open={addDialogOpen}
//         onClose={handleCloseAddForm}
//         onSaveSuccess={handleAddSuccess}
//       />

//       {/* --- MOCK EDIT STATE MODAL (Tailwind Modal) --- */}
//       {editDialogOpen && selectedState && (
//         <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex justify-center items-center backdrop-blur-sm">
//             <div className="relative w-full max-w-lg p-6 bg-white rounded-xl shadow-2xl dark:bg-gray-800 transform transition-all scale-100 duration-300">
//                 <div className="flex justify-between items-center pb-4 border-b dark:border-gray-700">
//                     <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Edit State: {selectedState.state_title}</h3>
//                     <button 
//                         onClick={handleEditDialogClose} 
//                         className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
//                         aria-label="Close"
//                     >
//                         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
//                     </button>
//                 </div>

//                 <div className="space-y-4 py-6">
//                     <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
//                         This is a placeholder for the **Edit State form**.
//                     </p>
//                     <div>
//                         <label htmlFor="editStateTitle" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">State Title</label>
//                         <input
//                           type="text"
//                           id="editStateTitle" 
//                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 shadow-inner"
//                           placeholder="State Title"
//                           defaultValue={selectedState.state_title} 
//                           required 
//                         />
//                     </div>
//                     <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
//                        <EditIcon className="w-5 h-5"/> 
//                        <span>State ID: {selectedState.state_id}</span>
//                     </div>
//                 </div>

//                 <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
//                     <button 
//                         onClick={handleEditDialogClose}
//                         className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition duration-150 shadow-md"
//                     >
//                         Save (Mock)
//                     </button>
//                     <button 
//                         onClick={handleEditDialogClose}
//                         className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 transition duration-150 shadow-sm"
//                     >
//                         Cancel
//                     </button>
//                 </div>
//             </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StateList;
