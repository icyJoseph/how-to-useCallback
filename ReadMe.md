# useMemo - useCallback

In this repository, the `useCallback` hook is used to prevent unnecessary rendering of a children component.

The hook, `useMemo` is also used to show how React help us prevent unnecessary calculations inside a component.

### Counter

```jsx
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
```

This function component simply takes a count and shows it. It also give the user two buttons to increase or decrease the count. Mind that this component does not hold a count state itself!

### Expensive

```jsx
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
```

This so called Expensive component receives two props, `total` and `totalCb`. The latter is called when the user clicks the calculate total button.

Notice that we export Expensive wrapped by `React.memo`.

### App

```jsx
function App() {
  const [time, tickTime] = useState(0);
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);

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
        totalCb={totalCb}
        newInTheBeginning={alwaysTheSame}
        // willBeNewEverytime={curry(alwaysTheSame)}
        // newEveryTime={newEveryTime}
      />
    </div>
  );
}
```

This component has a very special behavior. It increases a timer by one every 1000 ms and displays that update to the DOM.

When this update happens, Counter and Expensive render again. However, Expensive is memoized as a component and furthermore, it takes fully memoized props, and therefore it does not perform an unnecessary render.

That's because:

- we call useCallback to generate `totalCb`.
- `total` does not change unless the user increases it or decreases it inside Counter.

You notice, there's a `newInTheBeginning` prop. This is pointing to a function defined for the whole module, so it is the same function every tick of the timer.

Unfortunately, if we remove the comment from the last two props, `willBeNewEverytime` and `newEveryTime`, then each tick, will make a new reference to these and hence trigger a render run, in spite of `React.memo` wrapping Expensive.

That's how useCallback helps us, it saves the reference to a function for further rendering operations. Since the reference is the same, children which consume it do not render again.

A new reference is made only if the dependencies to the callback change. In this case, that would be `arrMemo`. Which in turn, changes when `count` is modified.

Additionally we create a memoized value, by calling `useMemo` we can define a value derived from the `count` state, if we didn't `useMemo`, every tick would trigger a derivation!
