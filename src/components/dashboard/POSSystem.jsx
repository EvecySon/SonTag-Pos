import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import POSInterface from '@/components/pos/POSInterface';
import OpenShiftRegister from '@/components/pos/OpenShiftRegister';

const POSSystem = ({ user, onBackToDashboard, theme, setTheme }) => {
  const [shiftRegister, setShiftRegister] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedRegister = localStorage.getItem('loungeShiftRegister');
    if (savedRegister) {
      const parsedRegister = JSON.parse(savedRegister);
      if (!parsedRegister.closedAt) {
        setShiftRegister(parsedRegister);
      }
    }
    setIsLoading(false);
  }, []);

  const handleShiftOpen = (newRegister) => {
    setShiftRegister(newRegister);
  };

  const handleShiftClose = () => {
    setShiftRegister(null);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-screen bg-pos-background">
          <p className="text-pos-text">Loading...</p>
        </div>
      );
    }

    if (shiftRegister) {
      return (
        <motion.div key="pos-interface" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <POSInterface 
            user={user} 
            toggleTheme={toggleTheme} 
            currentTheme={theme} 
            onBackToDashboard={onBackToDashboard}
            shiftRegister={shiftRegister}
            onShiftClose={handleShiftClose}
          />
        </motion.div>
      );
    }

    return (
      <motion.div key="open-shift" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <OpenShiftRegister onShiftOpen={handleShiftOpen} user={user} />
      </motion.div>
    );
  };

  return (
    <div className="w-full h-screen bg-pos-background text-pos-text overflow-hidden">
      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>
    </div>
  );
};

export default POSSystem;