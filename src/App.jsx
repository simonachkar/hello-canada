import React, { useEffect, useState } from "react";
import List from "./components/list";
import Counter from "./components/counter";
import "./App.css";

const API_URL =
  "https://my-json-server.typicode.com/simonachkar/demo-canada-api-server";

function App() {
  const [dataType, setDataType] = useState("provinces");
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${API_URL}/${dataType}`);
      const jsonData = await response.json();
      setData(jsonData);
    };

    fetchData();
  }, [dataType]);

  return (
    <div className="App">
      <h1>Hello Canada (A demo React App)</h1>
      <img
        alt="Canada's Flag"
        width={125}
        src="https://upload.wikimedia.org/wikipedia/commons/d/d9/Flag_of_Canada_%28Pantone%29.svg"
      />

      <Counter />
      <div className="menu">
        <p className="menu-item" onClick={() => setDataType("provinces")}>
          Provinces
        </p>
        <p className="menu-item" onClick={() => setDataType("territories")}>
          Territories
        </p>
      </div>

      <List data={data} />
    </div>
  );
}

export default App;
