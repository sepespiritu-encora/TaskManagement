import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Tasks from './Tasks';
import Login from './Login';

function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUsername = localStorage.getItem('username');
        if (token && storedUsername) {
            setIsLoggedIn(true);
            setUsername(storedUsername);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setIsLoggedIn(false);
        setUsername('');
        navigate('/'); // Navigate to home page
    };

    return (
        <div>
            {/* <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} username={username} /> */}
            <div>
                {isLoggedIn ? (
                    <Tasks />
                ) : (
                    <Login setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} />
                )}
            </div>
        </div>
    );
}

export default Home;