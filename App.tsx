import React, { useState } from 'react';
import Layout from './components/layout';
import Dashboard from './Pages/Dashboard';
import Patients from './Pages/Patients';
import Appointments from './Pages/Appointments';
import Services from './Pages/Services';
import Doctors from './Pages/Doctors';

// Simple routing system
type Page = 'dashboard' | 'patients' | 'appointments' | 'services' | 'doctors';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'patients':
        return <Patients />;
      case 'appointments':
        return <Appointments />;
      case 'services':
        return <Services />;
      case 'doctors':
        return <Doctors />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}
