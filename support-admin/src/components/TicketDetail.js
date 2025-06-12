import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { API_URL } from '../config/env';

const TicketDetail = ({ isAdmin, onTicketUpdated }) => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [author] = useState(isAdmin ? 'Admin' : 'User');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/tickets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTicket(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching ticket:', err);
      setError('Failed to load ticket details.');
      setTicket(null);
    }
  };

  const handleAddComment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/api/tickets/${id}/comments`, {
        text: commentText,
        author,
      }, { headers: { Authorization: `Bearer ${token}` } });
      setTicket(response.data);
      setCommentText('');
      if (onTicketUpdated) onTicketUpdated();
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`${API_URL}/api/tickets/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTicket(response.data);
      if (onTicketUpdated) onTicketUpdated();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  if (error) return <p>{error}</p>;
  if (!ticket) return <p>Loading ticket details...</p>;

  const isClosed = ticket.status === 'Closed';

  return (
    <div className="ticket-detail">
      <h2>{ticket.title} <span className="ticket-number">[{ticket.ticketNumber}]</span></h2>
      <p dangerouslySetInnerHTML={{ __html: ticket.description }} />
      <p>Type: {ticket.supportType} | Status: {ticket.status}</p>
      <p>Created: {new Date(ticket.createdAt).toLocaleString()} | Last Activity: {new Date(ticket.lastActivity).toLocaleString()}</p>
      {isAdmin && (
        <div className="status-update">
          <label>Change Status:</label>
          <select value={ticket.status} onChange={(e) => handleStatusChange(e.target.value)}>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      )}
      <div className="chat-container">
        <h3>Case Correspondence</h3>
        {ticket.Comments && ticket.Comments.length > 0 ? (
          <div className="chat-messages">
            {ticket.Comments.map((comment) => (
              <div key={comment.id} className="chat-message">
                <div className="message-header">
                  <strong>{comment.author}</strong>
                  <span className="timestamp">{new Date(comment.createdAt).toLocaleString()}</span>
                </div>
                <div className="message-body" dangerouslySetInnerHTML={{ __html: comment.text }} />
              </div>
            ))}
          </div>
        ) : (
          <p>No correspondence yet.</p>
        )}
      </div>
      <div className="comment-form">
        {isClosed && !isAdmin ? (
          <p className="closed-notice">This ticket is closed. No further comments can be added.</p>
        ) : (
          <>
            <ReactQuill
              value={commentText}
              onChange={setCommentText}
              placeholder="Type your message here..."
              readOnly={isClosed && !isAdmin}
            />
            <button onClick={handleAddComment} disabled={isClosed && !isAdmin}>Send</button>
          </>
        )}
      </div>
    </div>
  );
};

export default TicketDetail;