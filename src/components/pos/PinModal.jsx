import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const PinModal = ({ isOpen, onClose, onSuccess, user }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [overridePin, setOverridePin] = useState('');
  const [graceWindow, setGraceWindow] = useState(0);
  const [gracePeriodActive, setGracePeriodActive] = useState(false);
  const [graceTimer, setGraceTimer] = useState(null);

  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('loungeSettings'));
    if (savedSettings) {
      setOverridePin(savedSettings.overridePin || '');
      setGraceWindow(savedSettings.graceWindow || 0);
    }
  }, []);

  useEffect(() => {
    if (gracePeriodActive) {
      const timer = setTimeout(() => {
        setGracePeriodActive(false);
        toast({ title: "Grace Period Expired", description: "PIN required for next action." });
      }, graceWindow * 1000);
      setGraceTimer(timer);
    } else {
      if (graceTimer) clearTimeout(graceTimer);
    }
    return () => {
      if (graceTimer) clearTimeout(graceTimer);
    };
  }, [gracePeriodActive, graceWindow]);

  const handlePinChange = (value) => {
    if (pin.length < 4) {
      setPin(pin + value);
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const handleVerify = () => {
    if (gracePeriodActive) {
      onSuccess();
      return;
    }

    const userPin = user.role === 'admin' ? '1234' : '0000'; // Fallback/user pin
    if (pin === userPin || (overridePin && pin === overridePin)) {
      toast({ title: 'PIN Accepted!', variant: 'default' });
      if (overridePin && pin === overridePin && graceWindow > 0) {
        setGracePeriodActive(true);
      }
      onSuccess();
      closeModal();
    } else {
      setError('Invalid PIN. Please try again.');
      setPin('');
      toast({ title: 'Invalid PIN', variant: 'destructive' });
    }
  };

  const closeModal = () => {
    setPin('');
    setError('');
    onClose();
  };

  useEffect(() => {
    if (isOpen && gracePeriodActive) {
      onSuccess();
      closeModal();
    }
  }, [isOpen, gracePeriodActive]);

  if (isOpen && gracePeriodActive) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground text-2xl">Manager Approval Required</DialogTitle>
          <DialogDescription>
            Please enter your PIN to authorize this action.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="flex space-x-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`w-12 h-14 border-2 rounded-md flex items-center justify-center text-2xl font-bold ${
                  pin.length > i ? 'border-primary' : 'border-border'
                }`}
              >
                {pin[i] ? '•' : ''}
              </div>
            ))}
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <Button key={num} variant="outline" className="h-14 text-xl" onClick={() => handlePinChange(num.toString())}>
                {num}
              </Button>
            ))}
            <Button variant="outline" className="h-14 text-xl" onClick={handleBackspace}>
              ⌫
            </Button>
            <Button variant="outline" className="h-14 text-xl" onClick={() => handlePinChange('0')}>
              0
            </Button>
            <Button className="h-14 text-xl bg-accent hover:bg-accent/90" onClick={handleVerify}>
              OK
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PinModal;