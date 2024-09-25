import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Component/Home';
import './App.css';
import Login from './Component/Login';
import Profile from './Component/Profile';
import Parcel from './Component/Parcel';
import AdminDashboard from './Component/AdminDashboard';
import AdminParcelPage from './Component/AdminParcelPage';
import AdminUser from './Component/AdminUser';
import MaintenanceReport from './Component/MaintenanceReport';
import MaintenanceList from './Component/MaintenanceList';
import MaintenanceListView from './Component/MaintenanceListView';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />  {/* Changed to lowercase */}
        <Route path="/parcel" element={<Parcel />} />
        <Route path='/adminparcelpage' element={<AdminParcelPage/>} />
        <Route path="/admindashboard" element={<AdminDashboard />} /> {/* Changed to lowercase */}
        <Route path="/adminparcels" element={<AdminParcelPage />} />
        <Route path="/adminusers" element={<AdminUser />} />
        <Route path="/maintenancereport" element={<MaintenanceReport />} /> {/* Changed to lowercase */}
        <Route path="/maintenancelist" element={<MaintenanceList />} />  {/* Changed to lowercase */}
        <Route path='/maintenancelistview' element={<MaintenanceListView/>} /> 
      </Routes>
    </Router>
  );
};

export default App;
