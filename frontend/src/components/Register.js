import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const checkUsernameExists = async (username) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/check-username`, {
        params: { username },
      });
      return response.data.message === 'Username is available';
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError('Username already exists. Please choose a different username.');
      } else {
        setError('Error checking username. Please try again.');
      }
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isUsernameAvailable = await checkUsernameExists(username);
    if (!isUsernameAvailable) {
      return;
    }
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/users`, { username, password });
      console.log(response.data);
      setError(''); // Clear any previous error
      navigate('/login'); // Redirect to login page on successful registration
    } catch (error) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Register</button>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </form>
  );
}

export default Register;