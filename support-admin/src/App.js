import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Switch, Link, Redirect } from 'react-router-dom';
import AdminTicketList from './components/AdminTicketList';
import TicketDetail from './components/TicketDetail';
import Login from './components/Login';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './App.css';
import { API_URL } from './config/env';

function App() {
  const [tickets, setTickets] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
        } else {
          setIsAuthenticated(true);
          fetchTickets();
        }
      } catch (err) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    }
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axios.get(API_URL+'/api/tickets', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTickets(response.data);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    }
  };

  const handleLogin = () => {
    console.log('Login successful, updating state');
    setIsAuthenticated(true);
    fetchTickets();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setTickets([]);
  };

  const activeTickets = tickets.filter(t => t.status !== 'Closed');
  const closedTickets = tickets.filter(t => t.status === 'Closed');

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="App admin-app">
        <h1>Admin Dashboard</h1>
        <nav>
          <Link to="/active" className="btn">Active Tickets</Link>
          <Link to="/closed" className="btn">Closed Tickets</Link>
          <button onClick={handleLogout} className="btn logout-btn">Logout</button>
        </nav>
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/active" />} />
          <Route exact path="/active">
            <AdminTicketList tickets={activeTickets} />
          </Route>
          <Route exact path="/closed">
            <AdminTicketList tickets={closedTickets} />
          </Route>
          <Route path="/ticket/:id">
            <TicketDetail isAdmin={true} onTicketUpdated={fetchTickets} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;