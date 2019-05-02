import React from "react";

export function Expensive({ total, totalCb }) {
  const handleClick = () => {
    totalCb();
  };

  console.log("Expensive re-renders, with: ", total);

  return (
    <>
      <div>
        <p>total: {total}</p>
      </div>
      <div>
        <button onClick={handleClick}>Calc Total</button>
      </div>
    </>
  );
}

export default React.memo(Expensive);
