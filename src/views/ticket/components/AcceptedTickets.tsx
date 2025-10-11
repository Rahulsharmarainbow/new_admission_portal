// src/Frontend/Pages/Tickets/AcceptedTickets.tsx
import React from 'react';
import TicketTable from './TicketTable';

const AcceptedTickets: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Accepted Tickets</h1>
        <p className="text-gray-600">Tickets that have been accepted and are in progress</p>
      </div>
      <TicketTable status="accepted" />
    </div>
  );
};

export default AcceptedTickets;