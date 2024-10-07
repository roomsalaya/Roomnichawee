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
import ElectricityRate from './Component/ElectricityRate';
import Showelectricity from './Component/Showelectricity';
import InvoiceForm from './Component/InvoiceForm';
import React from 'react';
import SentInvoiceForm from './Component/SentInvoiceForm';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />  {/* Changed to lowercase */}
        <Route path="/parcel" element={<Parcel />} />
        <Route path='/adminparcelpage' element={<AdminParcelPage />} />
        <Route path="/admindashboard" element={<AdminDashboard />} /> {/* Changed to lowercase */}
        <Route path="/adminparcels" element={<AdminParcelPage />} />
        <Route path="/adminusers" element={<AdminUser />} />
        <Route path="/maintenancereport" element={<MaintenanceReport />} /> {/* Changed to lowercase */}
        <Route path="/maintenancelist" element={<MaintenanceList />} />  {/* Changed to lowercase */}
        <Route path='/maintenancelistview' element={<MaintenanceListView />} />
        <Route path='/ElectricityRate' element={<ElectricityRate />} />
        <Route path='/Showelectricity' element={<Showelectricity />} />
        <Route path='/InvoiceForm' element={<InvoiceForm/>} />
        <Route path='/SentInvoiceForm' element={<SentInvoiceForm/>} />
      </Routes>
    </Router>
  );
};

export default App;
