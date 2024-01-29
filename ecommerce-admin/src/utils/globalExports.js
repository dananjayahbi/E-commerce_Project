// This file contains functions and data that are used in multiple components

// Fetch the 'dashboardLogo' image from the backend
const fetchDashboardLogo = async () => {
  try {
    // Fetch the 'dashboardLogo' image from the backend
    const response = await fetch(
      "http://localhost:5000/systemSettings/getDashboardLogo"
    );
    if (response.ok) {
      return URL.createObjectURL(await response.blob());
    }
  } catch (error) {
    console.error("Error fetching dashboardLogo image", error);
  }
};

export { fetchDashboardLogo};
