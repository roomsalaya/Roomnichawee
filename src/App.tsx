import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Component/Home'; // Ensure the correct path to Home component
import './App.css';
import Login from './Component/Login';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/login' element={<Login/>} />
      </Routes>
    </Router>
  );
};

export default App;
