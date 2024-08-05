import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Menu from "./components/Menu";
import Header from "./components/Header";
import OrderSubmitted from "./components/OrderSubmitted";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Header />}>
          <Route path="/" element={<Menu />} />
          <Route path="/order" element={<OrderSubmitted />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
