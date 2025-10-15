// src/Frontend/Pages/Tickets/ResolvedTickets.tsx
import React from 'react';
import TicketTable from './TicketTable';
import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';

const ResolvedTickets: React.FC = () => {
  return (
    <div className="p-6">
      <BreadcrumbHeader
        title="Resolved Tickets"
        paths={[{ name: 'Resolved Tickets', link: '#' }]}
      />
      <TicketTable status="resolved" />
    </div>
  );
};

export default ResolvedTickets;