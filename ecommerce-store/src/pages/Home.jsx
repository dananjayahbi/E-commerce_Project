import React, { useEffect, useState } from "react";

const Home = () => {
  const [searchedProducts, setSearchedProducts] = useState([]);

  useEffect(() => {
    const handleStorageChange = () => {
      setSearchedProducts(JSON.parse(localStorage.getItem("searchedProducts")));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <>
      <h1>Home</h1>
      <p>Welcome to our store</p>
      <p>Our products:</p>
      {searchedProducts && (
        <ul>
          {searchedProducts.map((product) => (
            <li key={product._id}>{product.productName}</li>
          ))}
        </ul>
      )}
    </>
  )
}

export default Home