
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import LoginPage from '@/pages/LoginPage';
import Dashboard from '@/pages/Dashboard';
import { Toaster } from '@/components/ui/toaster';
import LandingPage from '@/pages/LandingPage';
import RegisterPage from '@/pages/RegisterPage';
import { api, setToken } from '@/lib/api';

export default function App() {
  const [view, setView] = useState('landing'); // 'landing', 'login', 'register', 'dashboard'
  const [currentUser, setCurrentUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [draftToLoad, setDraftToLoad] = useState(null);

  useEffect(() => {
    // Theme setup
    const savedTheme = localStorage.getItem('loungeErpTheme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    document.body.classList.add('new-dashboard-style');

    // Session setup from existing token
    const existingToken = localStorage.getItem('authToken');
    if (existingToken) {
      setToken(existingToken);
      api.me()
        .then((user) => {
          setCurrentUser(user);
          setView('dashboard');
        })
        .catch(() => {
          setToken(null);
        });
    }
  }, []);

  const handleSetTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('loungeErpTheme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleLogin = async ({ username, password }) => {
    const { token, user } = await api.login({ username, password });
    setToken(token);
    setCurrentUser(user);
    setView('dashboard');
  };
  
  const handleRegister = async (businessData, ownerData) => {
    const { token, user } = await api.register({
      username: ownerData.username,
      email: ownerData.email,
      password: ownerData.password,
      branchName: businessData.businessName,
      branchLocation: `${businessData.city}, ${businessData.state}`,
    });
    setToken(token);
    setCurrentUser(user);
    setView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('landing');
    setToken(null);
    localStorage.removeItem('loungeShiftRegister');
  };

  const handleSetDraftToLoad = (draft) => {
    setDraftToLoad(draft);
  };
  
  const handleClearDraftToLoad = () => {
    setDraftToLoad(null);
  };

  const renderContent = () => {
    switch (view) {
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigateToRegister={() => setView('register')} />;
      case 'register':
        return <RegisterPage onRegister={handleRegister} onNavigateToLogin={() => setView('login')} />;
      case 'dashboard':
        return (
          <Dashboard 
            user={currentUser} 
            onLogout={handleLogout} 
            theme={theme} 
            setTheme={handleSetTheme}
            draftToLoad={draftToLoad}
            onSetDraftToLoad={handleSetDraftToLoad}
            onClearDraftToLoad={handleClearDraftToLoad}
          />
        );
      case 'landing':
      default:
        return <LandingPage onSignInClick={() => setView('login')} onRegisterClick={() => setView('register')} />;
    }
  };

  return (
    <>
      <Helmet>
        <title>SonTag POS/ERP software</title>
        <meta name="description" content="SonTag POS/ERP software: Comprehensive ERP system for lounge management with POS, inventory, staff management, and multi-branch capabilities" />
      </Helmet>
      
      {renderContent()}
      
      <Toaster />
    </>
  );
}
