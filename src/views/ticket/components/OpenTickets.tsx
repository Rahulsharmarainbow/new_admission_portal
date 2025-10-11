// src/Frontend/Pages/Tickets/OpenTickets.tsx
import React from 'react';
import TicketTable from './TicketTable';

const OpenTickets: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Open Tickets</h1>
        {/* <p className="text-gray-600">Tickets that are currently open and awaiting action</p> */}
      </div>
      <TicketTable status="open" />
    </div>
  );
};

export default OpenTickets;