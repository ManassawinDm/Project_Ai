import React from 'react';

function QA() {
    return (
      <div className='text-white bg-[#000300]'>
<div className="flex flex-wrap md:flex-nowrap h-screen">
  {/* Background image on the side of the page */}
  <div className="md:w-1/4 w-full h-64 md:h-auto bg-stupidgraph bg-cover bg-center bg-no-repeat ">
    {/* Content for the left side, if any, goes here */}
  </div>

  {/* Main content area */}
  <div className="md:w-3/4 w-full text-white bg-[#000300] p-8 flex flex-col my-28">
    {/* Centered headings */}
    <div className="text-center mb-4">
      <h1 className="text-5xl font-bold mb-6 mb-16 text-[#00df9a]">Q&A</h1>
      <h2 className="text-3xl mb-10 text-[#00df9a] font-bold mb-4">What is a trading bot?</h2>
     
    </div>

    {/* Left-aligned text */}
    <div className="list-disc text-lg md:text-2xl pl-5">
      <p className="text-lg md:text-2xl mb-4">
        A trading bot is a software application that automatically buys and sells assets, such as stocks, currencies, or commodities. Trading bots are often used by traders to automate their trading strategies and to take advantage of market movements.
      </p>
      <div className="text-center mb-4 mt-16">
      <h2 className="text-3xl mb-10 text-[#00df9a] font-bold">How do trading bots work?</h2>
      </div>
      <div className="list-disc text-lg md:text-2xl pl-5 mt-16">
        <p>Trend following: Trading bots can be programmed to identify and follow trends in the market.</p>
        <p>Mean reversion: Trading bots can be programmed to buy assets when they are oversold and sell them when they are overbought.</p>
        <p>Scalping: Trading bots can be programmed to make small profits by taking advantage of short-term price movements.</p>
      </div>
    </div>
  </div>
</div>
</div>
    );
}

export default QA;
