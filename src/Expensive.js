import React from "react";

export function Expensive({ total, length, totalCb, lengthCb }) {
  const handleClick = () => {
    totalCb();
    lengthCb();
  };

  console.log("Expensive re-renders, with: ", total, length);

  return (
    <>
      <div>
        <p>total: {total}</p>
      </div>
      <div>
        <p>length: {length}</p>
      </div>
      <div>
        <button onClick={handleClick}>Update</button>
      </div>
    </>
  );
}

export default React.memo(Expensive);
