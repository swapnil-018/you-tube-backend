import React from 'react';
import { Link } from 'react-router-dom';

const AdminTicketList = ({ tickets }) => {
  return (
    <div className="ticket-list">
      <h2>{tickets.some(t => t.status === 'Closed') ? 'Closed Tickets' : 'Active Tickets'}</h2>
      <p className="ticket-list-description">Here you can find a list of all tickets managed by our support team.</p>
      <div className="ticket-table">
        <div className="ticket-header">
          <span>Number</span>
          <span>Title</span>
          <span>Department</span>
          <span>Date</span>
        </div>
        {tickets.length === 0 ? (
          <p>No tickets yet.</p>
        ) : (
          tickets.map((ticket) => (
            <div key={ticket.id} className="ticket-row">
              <span className="ticket-number">#{ticket.ticketNumber}</span>
              <span className="ticket-title"><Link to={`/ticket/${ticket.id}`}>{ticket.title}</Link></span>
              <span className="ticket-department" style={{ color: '#1E90FF' }}>{ticket.supportType}</span>
              <span className="ticket-date">{new Date(ticket.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminTicketList;