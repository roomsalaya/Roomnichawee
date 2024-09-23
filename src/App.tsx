import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Component/Home'; // Ensure the correct path to Home component
import './App.css';
import Login from './Component/Login';
import Profile from './Component/Profile';
import Parcel from './Component/Parcel';
import AdminDashboard from './Component/AdminDashboard';
import AdminParcelPage from './Component/AdminParcelPage';
import AdminUser from './Component/AdminUser';
import MaintenanceReport from './Component/MaintenanceReport';
import MaintenanceList from './Component/MaintenanceList';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path='/Profile' element={<Profile/>}/>
              <Route path='/parcel' element={<Parcel/>}/>
              <Route path='/adminDashboard' element={<AdminDashboard/>}/>
              <Route path="/adminparcels" element={<AdminParcelPage />} />
              <Route path='/adminusers' element={<AdminUser/>} />
              <Route path='/MaintenanceReport' element={<MaintenanceReport/>}/>
              <Route path='/MaintenanceList' element={<MaintenanceList/>} />
      </Routes>
    </Router>
  );
};

export default App;
