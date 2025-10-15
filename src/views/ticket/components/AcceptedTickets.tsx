// src/Frontend/Pages/Tickets/AcceptedTickets.tsx
import React from 'react';
import TicketTable from './TicketTable';
import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';

const AcceptedTickets: React.FC = () => {
  return (
    <div className="p-6">
      <BreadcrumbHeader
        title="Accepted Tickets"
        paths={[{ name: 'Accepted Tickets', link: '#' }]}
      />
      <TicketTable status="accepted" />
    </div>
  );
};

export default AcceptedTickets;