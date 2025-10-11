// src/Frontend/Pages/Tickets/ResolvedTickets.tsx
import React from 'react';
import TicketTable from './TicketTable';

const ResolvedTickets: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Resolved Tickets</h1>
        <p className="text-gray-600">Tickets that have been successfully resolved</p>
      </div>
      <TicketTable status="resolved" />
    </div>
  );
};

export default ResolvedTickets;