import { useState, useEffect } from 'react';
import './counter.css'; 

const LOCAL_STORAGE_KEY = 'counterValue';

function Counter() {
  const [count, setCount] = useState(() => {
    const storedCount = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedCount ? parseInt(storedCount, 10) : 0;
  });

  // New state to manage visibility
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, count.toString());
  }, [count]);

  const increment = () => {
    setCount(count + 1);
  };

  const reset = () => {
    setCount(0);
  };

  const toggleVisibility = () => {
    setIsVisible(prevIsVisible => !prevIsVisible);
  };

  return (
    <div className="counter-wrapper">
      <button onClick={toggleVisibility} className="show-counter-btn">
        {isVisible ? 'Hide Counter' : 'Show Counter'}
      </button>

      {/* Conditionally render the counter content based on isVisible state */}
      {isVisible && (
        <div className="counter-container minimal">
          <p className="counter-display">{count}</p>
          <div className="counter-buttons-minimal">
            <button onClick={increment}>+</button> {/* Simpler increment button */}
            <button onClick={reset}>Reset</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Counter;