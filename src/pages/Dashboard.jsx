import React, { useState, useEffect } from 'react';
import API from '../services/api';

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuotes: 0,
    publicQuotes: 0,
    privateQuotes: 0,
  });
  const [loading, setLoading] = useState(false);

  // State to handle hover effects on stats cards
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch the dashboard data
      const response = await API.get('/admin/dashboard');
      const data = response.data; // This is the AdminDashboardResponse object

      // 2. Set the users from the new list in the DTO
      // We use data.allUsers because that's the list, not the whole 'data' object
      setUsers(data.allUsers || []);

      // 3. Set the stats from the DTO properties
      setStats({
        totalUsers: data.totalUsers,
        totalQuotes: data.totalQuotes,
        publicQuotes: data.publicQuotes,
        privateQuotes: data.privateQuotes,
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await API.delete(`/admin/users/${userId}`);
        fetchDashboardData();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    try {
      await API.put(`/admin/users/${userId}/role`, { role: newRole });
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role');
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading Dashboard...</div>;
  }

  // Helper to map stats to an array for easy rendering
  const statsItems = [
    { label: 'Total Users', value: stats.totalUsers },
    { label: 'Total Quotes', value: stats.totalQuotes },
    { label: 'Public Quotes', value: stats.publicQuotes },
    { label: 'Private Quotes', value: stats.privateQuotes },
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Admin Dashboard</h1>

      {/* Statistics Cards */}
      <div style={styles.statsGrid}>
        {statsItems.map((item, index) => (
          <div
            key={index}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              ...styles.statCard,
              ...(hoveredIndex === index ? styles.statCardHover : {}),
            }}
          >
            <h3 style={styles.statValue}>{item.value}</h3>
            <p style={styles.statLabel}>{item.label}</p>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>User Management</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Verified</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userId} style={styles.tr}>
                <td style={{ ...styles.td, color: '#666', fontSize: '0.85rem' }}>{user.id}</td>
                <td style={{ ...styles.td, fontWeight: '500' }}>{user.name}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>
                  <span style={user.role === 'ADMIN' ? styles.adminBadge : styles.userBadge}>
                    {user.role}
                  </span>
                </td>
                <td style={styles.td}>
                  {user.isVerified ? '✅' : '❌'}
                </td>
                <td style={styles.td}>
                  <button
                    onClick={() => handleToggleRole(user.id, user.role)}
                    style={styles.roleButton}
                  >
                    Toggle Role
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2.5rem 1rem',
    fontFamily: 'Roboto, Helvetica Neue, Arial, sans-serif',
    color: '#333',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '1.2rem',
    color: '#666'
  },
  header: {
    fontSize: '1.8rem',
    marginBottom: '2rem',
    fontWeight: '700',
    color: '#2c3e50',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    textAlign: 'center',
    border: '1px solid #edf2f7',
    transition: 'all 0.2s ease-in-out',
  },
  statCardHover: {
    transform: 'translateY(-4px)',
    boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
    borderColor: '#3182ce',
  },
  statValue: {
    fontSize: '2rem',
    margin: '0 0 0.5rem 0',
    color: '#2b6cb0',
  },
  statLabel: {
    margin: 0,
    color: '#718096',
    fontWeight: '600',
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  section: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    border: '1px solid #edf2f7',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    marginBottom: '1.5rem',
    color: '#2d3748',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '1rem',
    borderBottom: '2px solid #edf2f7',
    color: '#718096',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  tr: {
    borderBottom: '1px solid #f7fafc',
    transition: 'background-color 0.2s',
  },
  td: {
    padding: '1rem',
    fontSize: '0.95rem',
  },
  adminBadge: {
    backgroundColor: '#fed7d7',
    color: '#9b2c2c',
    padding: '0.25rem 0.6rem',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
  },
  userBadge: {
    backgroundColor: '#c6f6d5',
    color: '#22543d',
    padding: '0.25rem 0.6rem',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
  },
  roleButton: {
    padding: '0.4rem 0.8rem',
    backgroundColor: '#ebf8ff',
    color: '#2b6cb0',
    border: '1px solid #bee3f8',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '0.6rem',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
  deleteButton: {
    padding: '0.4rem 0.8rem',
    backgroundColor: '#fff5f5',
    color: '#c53030',
    border: '1px solid #feb2b2',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
};

export default Dashboard;