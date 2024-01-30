import React, { useState } from 'react';

const Home = () => {
  const [isOnline, setIsOnline] = useState(null);

  const checkSystemStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/systemSettings/getDashboardLogo');
      if (response.ok) {
        setIsOnline(true);
      } else {
        setIsOnline(false);
      }
    } catch (error) {
      console.error('Error checking system status:', error);
      setIsOnline(false);
    }
  };

  return (
    <div>
      <h1>Home</h1>
      <button onClick={checkSystemStatus}>Check System Status</button>
      {isOnline === true && <p>The system is online.</p>}
      {isOnline === false && <p>The system is offline.</p>}
      {isOnline === null && <p>Click the button to check system status.</p>}
    </div>
  );
};

export default Home;
