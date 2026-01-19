import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, getUserRole, logout } from '../services/authService';

function Navbar(){
    const navigate = useNavigate();
    const isLoggedIn = isAuthenticated();
    const role = getUserRole();

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };
    return (
        <nav style={styles.nav}>
            <h2>Quote Journal</h2>
            <div>
                {isLoggedIn ? (
                    <>
                     {role ==='ADMIN' && (
                         <Link to="/admin/dashboard" style={styles.link}>Dashboard</Link>
                      )}
                  <Link to="/quotes" style={styles.link}>Quotes</Link>

                      <button onClick={handleLogout} style={styles.button}>Logout</button>
                  </>
                ) : (
                    <Link to="/auth" style={styles.link}>Login</Link>
              )}
            </div>
        </nav>
    );
}

const styles= {
    nav: {
        fontFamily: 'Roboto, Helvetica Neue, Arial, sans-serif',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: '#333',
        color: 'white'
        },
    link: {
        color: 'white',
        marginRight: '1rem',
        textDecoration: 'none',
        },
    button: {
        padding: '0.5rem 1rem',
        cursor: 'pointer',
        },
    };

export default Navbar;