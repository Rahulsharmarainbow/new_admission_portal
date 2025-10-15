// src/Frontend/Pages/Tickets/TicketManagement.tsx
import React, { useState } from 'react';
import TicketTable from './components/TicketTable';

const TicketManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'open' | 'accepted' | 'resolved'>('open');

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Ticket Management</h1>
        <p className="text-gray-600">Manage and track all support tickets</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-6 py-3 font-medium text-sm flex items-center ${
            activeTab === 'open'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('open')}
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          Open Tickets
        </button>
        <button
          className={`px-6 py-3 font-medium text-sm flex items-center ${
            activeTab === 'accepted'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('accepted')}
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Accepted Tickets
        </button>
        <button
          className={`px-6 py-3 font-medium text-sm flex items-center ${
            activeTab === 'resolved'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('resolved')}
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Resolved Tickets
        </button>
      </div>

      <TicketTable status={activeTab} />
    </div>
  );
};

export default TicketManagement;