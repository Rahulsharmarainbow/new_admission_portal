// src/Frontend/Pages/Tickets/OpenTickets.tsx
import React from 'react';
import TicketTable from './TicketTable';
import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';

const OpenTickets: React.FC = () => {
  return (
    <div className="p-6">
      <BreadcrumbHeader
        title="Open Tickets"
        paths={[{ name: 'Open Tickets', link: '#' }]}
      />
      <TicketTable status="open" />
    </div>
  );
};

export default OpenTickets;