import React, { useState, useEffect } from 'react';
import { fetchDashboardLogo } from '../utils/globalExports';

const Home = () => {
  const [dashboardLogo, setDashboardLogo] = useState(null);

  useEffect(() => {
    const getDashboardLogo = async () => {
      const imageUrl = await fetchDashboardLogo();
      setDashboardLogo(imageUrl);
    };

    getDashboardLogo();
  }, []); // Empty dependency array ensures the effect runs only once after the initial render

  return (
    <>
      <div>Home</div>
      {dashboardLogo && <img src={dashboardLogo} alt="Dashboard Logo" />}
    </>
  );
};

export default Home;
