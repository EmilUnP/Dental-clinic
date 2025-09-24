import React, { useState } from 'react';
import Layout from './components/layout';
import Landing from './Pages/Landing';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';
import Patients from './Pages/Patients';
import Appointments from './Pages/Appointments';
import Services from './Pages/Services';
import Doctors from './Pages/Doctors';
import Workspace from './Pages/Workspace';

// Authentication and routing system
type AppPage = 'landing' | 'login' | 'register' | 'dashboard' | 'patients' | 'appointments' | 'services' | 'doctors' | 'workspace';
type AuthState = 'unauthenticated' | 'authenticated';

export default function App() {
  const [authState, setAuthState] = useState<AuthState>('unauthenticated');
  const [currentPage, setCurrentPage] = useState<AppPage>('landing');
  const [user, setUser] = useState<any>(null);

  const handleLogin = (email: string, password: string) => {
    // Simulate successful login
    setUser({ email, name: 'Dr. Smith' });
    setAuthState('authenticated');
    setCurrentPage('dashboard');
  };

  const handleRegister = (userData: any) => {
    // Simulate successful registration
    setUser({ email: userData.email, name: `${userData.firstName} ${userData.lastName}` });
    setAuthState('authenticated');
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setAuthState('unauthenticated');
    setCurrentPage('landing');
  };

  const handlePageChange = (page: string) => {
    console.log('Page change requested:', page, 'Current auth state:', authState);
    const appPage = page as AppPage;
    if (authState === 'unauthenticated' && appPage !== 'landing' && appPage !== 'login' && appPage !== 'register') {
      console.log('Redirecting to login');
      setCurrentPage('login');
    } else {
      console.log('Setting page to:', appPage);
      setCurrentPage(appPage);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <Landing onNavigate={(page) => setCurrentPage(page as AppPage)} />;
      case 'login':
        return <Login onLogin={handleLogin} onSwitchToRegister={() => setCurrentPage('register')} />;
      case 'register':
        return <Register onRegister={handleRegister} onSwitchToLogin={() => setCurrentPage('login')} />;
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
      case 'workspace':
        return <Workspace />;
      default:
        return <Dashboard />;
    }
  };

  // Show landing page or auth pages if not authenticated
  if (authState === 'unauthenticated') {
    return (
      <div>
        {/* Debug panel - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed top-0 right-0 bg-black text-white p-2 text-xs z-50">
            <div>Current Page: {currentPage}</div>
            <div>Auth State: {authState}</div>
            <div>User: {user?.name || 'None'}</div>
          </div>
        )}
        {renderPage()}
      </div>
    );
  }

  // Show main app with layout if authenticated
  return (
    <div>
      {/* Debug panel - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-0 right-0 bg-black text-white p-2 text-xs z-50">
          <div>Current Page: {currentPage}</div>
          <div>Auth State: {authState}</div>
          <div>User: {user?.name || 'None'}</div>
        </div>
      )}
      <Layout 
        currentPage={currentPage} 
        onPageChange={handlePageChange}
        onLogout={handleLogout}
        user={user}
      >
        {renderPage()}
      </Layout>
    </div>
  );
}
