import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

// Lazy load components
const Home = lazy(() => import('./Component/Home'));
const Login = lazy(() => import('./Component/Login'));
const Profile = lazy(() => import('./Component/Profile'));
const Parcel = lazy(() => import('./Component/Parcel'));
const AdminDashboard = lazy(() => import('./Component/AdminDashboard'));
const AdminParcelPage = lazy(() => import('./Component/AdminParcelPage'));
const AdminUser = lazy(() => import('./Component/AdminUser'));
const MaintenanceReport = lazy(() => import('./Component/MaintenanceReport'));
const MaintenanceList = lazy(() => import('./Component/MaintenanceList'));
const MaintenanceListView = lazy(() => import('./Component/MaintenanceListView'));
const ElectricityRate = lazy(() => import('./Component/ElectricityRate'));
const ShowElectricity = lazy(() => import('./Component/Showelectricity'));
const InvoiceForm = lazy(() => import('./Component/InvoiceForm'));
const InvoicesTable = lazy(() => import('./Component/InvoicesTable'));

const App: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/parcel" element={<Parcel />} />
          <Route path="/adminparcelpage" element={<AdminParcelPage />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/adminparcels" element={<AdminParcelPage />} />
          <Route path="/adminusers" element={<AdminUser />} />
          <Route path="/maintenancereport" element={<MaintenanceReport />} />
          <Route path="/maintenancelist" element={<MaintenanceList />} />
          <Route path="/maintenancelistview" element={<MaintenanceListView />} />
          <Route path="/ElectricityRate" element={<ElectricityRate />} />
          <Route path="/Showelectricity" element={<ShowElectricity />} />
          <Route path="/InvoiceForm" element={<InvoiceForm />} />
          <Route path="/InvoicesTable" element={<InvoicesTable />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
