import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import ClientDetails from './pages/ClientDetails';
import ContractDetails from './pages/ContractDetails';
import Lists from './pages/Lists';
import Financial from './pages/Financial';
import Settings from './pages/Settings';
import SocialProof from './pages/SocialProof';
import Login from './pages/Login';

// Componente para rotas protegidas que consome o contexto
const MainRoutes = () => {
  const { isAuthenticated } = useApp();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />

      <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" replace />}>
        <Route index element={<Dashboard />} />
        <Route path="clients" element={<Clients />} />
        <Route path="clients/:clientId" element={<ClientDetails />} />
        <Route path="contracts/:contractId" element={<ContractDetails />} />
        <Route path="lists" element={<Lists />} />
        <Route path="financial" element={<Financial />} />
        <Route path="social-proof" element={<SocialProof />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <MainRoutes />
      </Router>
    </AppProvider>
  );
}

export default App;