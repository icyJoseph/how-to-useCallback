import React, { useCallback, useMemo, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Counter from "./Counter";
import Expensive from "./Expensive";

import "./styles.css";

// a few helpers
// add up all elements of an array
const totalCalc = arr => arr.reduce((prev, curr) => prev + curr, 0);
// case all elements of an array to 1 and then add them up
const lenCalc = arr => totalCalc(arr.map(() => 1));

// make an array of length Math.abs(val)
function makeArr(val) {
  return Array.from({ length: Math.abs(val) }, (_, i) => i);
}

// a function available to the whole module
const alwaysTheSame = () => {
  console.log("inside unmemo calcLen");
};

// a high order operation
const curry = f => (...a) => (...b) => f(...a, ...b);

// the component
function App() {
  const [time, tickTime] = useState(0);
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [len, setLen] = useState(0);

  // "ticks" to re-render the whole App
  useEffect(() => {
    const timer = setInterval(() => tickTime(time + 1), 1000);
    return () => clearInterval(timer);
  });

  // setters
  const inc = () => setCount(count + 1);
  const dec = () => setCount(count - 1);

  // memoize an array
  const arrMemo = useMemo(() => {
    console.log("Create a new array only when count changes:", count);
    return makeArr(count);
  }, [count]);

  // same instance callback
  const totalCb = useCallback(() => {
    console.log("inside callback totalCb", arrMemo);
    setTotal(totalCalc(arrMemo));
  }, [arrMemo]);

  // same instance callback
  const lengthCb = useCallback(() => {
    console.log("inside callback lengthCb", arrMemo);
    setLen(lenCalc(arrMemo));
  }, [arrMemo]);

  // every tick triggers a new instance
  const newEveryTime = () => {
    console.log(
      "This callback is dirty, and will force Expensive to re-render"
    );
  };

  return (
    <div className="App">
      <h1>Hello CodeSandbox {time}</h1>
      <h2>Start editing to see some magic happen!</h2>
      <Counter count={count} inc={inc} dec={dec} />
      <Expensive
        total={total}
        length={len}
        totalCb={totalCb}
        lengthCb={lengthCb}
        newInTheBeginning={alwaysTheSame}
        // willBeNewEverytime={curry(alwaysTheSame)}
        // newEveryTime={newEveryTime}
      />
    </div>
  );
}

const rootElement = document.getElementById("root");

ReactDOM.render(<App />, rootElement);
