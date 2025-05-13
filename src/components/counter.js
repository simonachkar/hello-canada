import React, { useState } from 'react';

function Counter() {
  // Declare a state variable called 'count' and a function to update it called 'setCount'
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  return (
    <div>
      <h2>Simple Counter</h2>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
}

export default Counter;

/**
 * Here are some related topics you might find interesting:
 * - useState Hook -> https://react.dev/reference/react/useState
 * - Functional Components -> https://react.dev/learn/your-first-component#functional-components
 * - Event Handling in React -> https://react.dev/learn/responding-to-events
 * - JSX (JavaScript XML) -> https://react.dev/learn/writing-markup-with-jsx
 * - Props (Properties) -> https://react.dev/learn/passing-props-to-a-component
 */
