import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const notyf = new Notyf();

    try {
        const response = await fetch('https://fitnessapp-api-ln8u.onrender.com/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.access) {
            localStorage.setItem('token', data.access);
            setEmail('');
            setPassword('');
            notyf.success('Successful Login');
            navigate('/dashboard'); // Redirect to a protected route or dashboard
        } else {
            notyf.error(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login failed:', error);
        notyf.error('An error occurred. Please try again.');
    }
};
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default Login;