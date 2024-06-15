import logo from "./logo.svg";
import "./App.css";
import "./component/ztools/pokedex.css";

//Component
import Tictactoe from "./component/zgames/tictactoe.js";
import Pokedex from "./component/ztools/pokedex.js"
import React from "react";

function App() {
  
  return (
    <div className="App">
      <div>
          {/* <Tictactoe></Tictactoe> */}
          <Pokedex></Pokedex>
      </div>
    </div>
  );
}

export default App;
