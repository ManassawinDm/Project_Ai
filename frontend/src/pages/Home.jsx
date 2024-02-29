import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { AuthContext } from '../component/authContext';

function Home() {
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate(); 

  useEffect(() => {
    if (authToken) {
      navigate('/home'); 
    }
  }, [authToken, navigate]); 

  const handleNavigate = (path) => () => {
    navigate(path);
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 to-teal-500 h-screen flex flex-col justify-center items-center text-white">
      <h1 className="text-4xl font-bold mb-4">Welcome To Trading Bot Website</h1>
      <div className="flex gap-4">
        <button className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded">
          Download Bot Demo
        </button>
        <button onClick={handleNavigate("/register")} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Home;
