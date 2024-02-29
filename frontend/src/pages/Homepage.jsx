import React from 'react';

function Homepage() {
  return (
    <div className="bg-white text-gray-600">
      <div className="container mx-auto px-4">
        <section className="text-center py-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">About Bot</h1>
          <p className="max-w-xl mx-auto mb-8">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry...
          </p>
        </section>

        <section className="flex justify-center gap-8 mb-12">
          {/* Assuming these are steps, we create a component for each */}
          <div className="text-center">
            <div className="mb-4">[Icon]</div>
            <p>Download Bot</p>
          </div>
          <div className="text-center">
            <div className="mb-4">[Icon]</div>
            <p>Apply bot to MT4</p>
          </div>
          <div className="text-center">
            <div className="mb-4">[Icon]</div>
            <p>Start bot and Enjoy trading</p>
          </div>
        </section>
        <section className="bg-green-100 text-center py-6 rounded-xl mb-8">
          <p>Backtest Winrate 63%</p>
        </section>

        <section className="text-center">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
            DOWNLOAD BOT
          </button>
        </section>
      </div>
    </div>
  );
}

export default Homepage;