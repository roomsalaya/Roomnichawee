// In App.tsx
import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

// Lazy load components
const Login = lazy(() => import('./Component/Login'));
const Home = lazy(() => import('./Component/Home'));
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
const SentInvoicesPage = lazy(() => import('./Component/SentInvoicesPage'));
const AdminInvoicesPage = lazy(() => import('./Component/AdminInvoicesPage'));
const PaymentPage = lazy(() => import('./Component/PaymentPage'));
const PaymentHistoryPage = lazy(() => import('./Component/PaymentHistoryPage'));
const AdminPaymentStatusPage = lazy(() => import('./Component/AdminPaymentStatusPage'));
const ChangePassword = lazy(() => import('./Component/ChangePassword'));

const App: React.FC = () => {

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
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
          <Route path="/SentInvoicesPage" element={<SentInvoicesPage />} />
          <Route path='/AdminInvoicesPage' element={<AdminInvoicesPage/>} />
          <Route path='/PaymentPage' element={<PaymentPage/>} />
          <Route path='/PaymentHistoryPage' element={<PaymentHistoryPage/>} />
          <Route path='/AdminPaymentStatusPage' element={<AdminPaymentStatusPage/>} />
          <Route path='/ChangePassword' element={<ChangePassword/>}/>
        </Routes>
      </Suspense>
    </Router>
  );
};

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> b469d96 (first commit)
