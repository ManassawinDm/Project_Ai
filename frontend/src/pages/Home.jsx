import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../component/authContext";
import { ReactTyped } from "react-typed";
import TradingViewWidget from "../component/TradingViewWidget";
function Home() {
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (authToken) {
      navigate("/home");
    }
  }, [authToken, navigate]);

  const handleNavigate = (path) => () => {
    navigate(path);
  };

  return (
    <div className="text-white bg-[#000300]">
      <div className="max-w-[800px] mt-[-96px] w-full h-screen mx-auto text-center flex flex-col justify-center">
        <p className="text-[#00df9a] font-bold p-2">
          GROW WITH TRADING WITH TRADING ROBOTS
        </p>
        <h1 className="md:text-7xl sm:text-6xl text-4xl font-bold md:py-6">
          Grow with trading.
        </h1>
        <div className="flex justify-center items-center">
          <p className="md:text-4xl sm:text-4xl text-xl font-bold py-4">
            With multiple currency pairs
          </p>
          <ReactTyped
            className="md:text-4xl sm:text-4xl text-xl font-bold md:pl-4 pl-2 text-[#00df9a]"
            strings={[
              "EURUSD",
              "USDJPY",
              "GBPUSD",
              "AUDUSD",
              "USDCAD",
              "USDCHF",
              "NZDUSD",
              "EURGBP",
            ]}
            typeSpeed={120}
            backSpeed={140}
            loop
          />
        </div>
        <p className="md:text-2xl text-xl font-bold text-gray-500">
          Review your data analytics to increase your revenue.
        </p>
        <div className="hidden md:flex  mt-10 max-w-[1240px] ">
          <button
           onClick={handleNavigate("/register")}
           className="bg-[#00df9a] hover:bg-[#44967c] text-black w-[200px] rounded-md font-medium inline-flex items-center justify-center my-6 mx-auto py-3">
            <span>Get Started</span>
          </button>
          <button
            onClick={handleNavigate("/Q&A")}
            className="bg-transparent hover:bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-[#00df9a] hover:text-white border border-[#00df9a]"
          >
            How To Use
          </button>
        </div>
        <div className="flex flex-col mt-10 md:hidden">
          <button 
            onClick={handleNavigate("/register")}
            className="bg-[#00df9a] hover:bg-[#44967c] text-black w-[200px] rounded-md font-medium inline-flex items-center justify-center my-6 mx-auto py-3">
            <span>Get Started</span>
          </button>
          <button
            onClick={handleNavigate("/Q&A")}
            className="bg-transparent hover:bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-[#00df9a] hover:text-white border border-[#00df9a]"
          >
                How To Use
          </button>
        </div>
      </div>
      <div className="bg-[#000300]">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-[#00df9a] mb-12">Market Overview</h1>
          <TradingViewWidget />
        </div>
      </div>
    </div>
  );
}

export default Home;