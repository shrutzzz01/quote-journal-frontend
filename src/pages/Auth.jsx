import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/authService';

function Auth(){
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
            });
        };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            if(isLogin) {
                await login(formData.email, formData.password);
                navigate('/quotes');
            } else {
                const response = await register(formData.name, formData.email, formData.password);
                setSuccess(response);
                setFormData({ name: '', email: '', password: '' });
                setTimeout(() => setIsLogin(true), 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
            }
        };
    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2>{isLogin ? 'Login' : 'Register'}</h2>
                {error && <div style={styles.error}>{error}</div>}
                {success && <div style={styles.success}>{success}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    {!isLogin && (
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleChange}
                            style={styles.input}
                            required
                         />
                    )}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                    <button type="submit" style={styles.button}>
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>
                <p style={styles.toggle}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <span
                        onClick ={() => setIsLogin(!isLogin)}
                        style={styles.link}
                    >
                        {isLogin ? 'Register' : 'Login'}
                    </span>
                </p>
            </div>
        </div>
        );
    }

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        backgroundColor: '#f5f5f5',
        },
    card: {
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '400px',
        },
    form: {
        display: 'flex',
        flexDirection: 'column',
        },
    input: {
        padding: '0.75rem',
        marginBottom: '1rem',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '1rem',
        },
    button: {
        padding: '0.75rem',
        backgroundColor: '#333',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '1rem',
        cursor: 'pointer',
        },
    toggle: {
        textAlign: 'center',
        marginTop: '1rem',
        },
    link: {
        color: '#007bff',
        cursor: 'pointer',
        textDecoration: 'underline',
        },
    error: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '0.75rem',
        borderRadius: '4px',
        marginBottom: '1rem',
        },
    success: {
        backgroundColor: '#d4edda',
        color: '#155724',
        padding: '0.75rem',
        borderRadius: '4px',
        marginBottom: '1rem',
        },
    };

export default Auth;