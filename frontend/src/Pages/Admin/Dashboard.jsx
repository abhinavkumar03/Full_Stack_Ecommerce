import React from 'react';
import { Link } from 'react-router-dom';
import './Admin.css';

const Dashboard = () => {
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="admin-stats">
        <div className="stat-card">
            <div>
                <h3>Products</h3>
                <Link to="/admin/products" className="admin-link">
                    Manage Products
                </Link>
            </div>
            <div>
                <h3>User</h3>
                <Link to="/admin/users" className="admin-link">
                    Manage Users
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 