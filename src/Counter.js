import React from "react";

export function Counter({ inc, dec, count }) {
  return (
    <>
      <div>
        <p>{count}</p>
      </div>
      <button onClick={inc}>INC</button>
      <button onClick={dec}>DEC</button>
    </>
  );
}

export default Counter;
