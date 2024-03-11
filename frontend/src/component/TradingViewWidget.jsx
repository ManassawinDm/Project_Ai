import React from "react";

function TradingViewWidget() {
  return (
    <div className="tradingview-widget-container">
      <iframe
        src="https://www.tradingview.com/widgetembed/?frameElementId=tradingview_12345&symbol=FX_IDC:EURUSD&interval=D&hidetoptoolbar=1&hidelegend=1&saveimage=0&toolbarbg=f1f3f6&studies=%5B%5D&theme=dark&style=1&timezone=exchange"
        width="100%"
        height="500"
        frameBorder="0"
        allowTransparency="true"
        scrolling="no"
        allowFullScreen
      ></iframe>
    </div>
  );
}

export default TradingViewWidget;
