import { useState } from "react";

import "./App.css";
import Container from "./layouts/container";
import Home from "./Pages/Home";

function App() {
  return (
    <div className="App">
      <Container>
        <Home />
      </Container>
    </div>
  );
}

export default App;
