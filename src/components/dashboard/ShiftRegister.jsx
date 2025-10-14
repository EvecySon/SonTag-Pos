import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Waypoints, DollarSign, PlusCircle, MinusCircle, Eye, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';

const ShiftRegister = ({ user }) => {
  const [activeRegister, setActiveRegister] = useState(null);
  const [openingCash, setOpeningCash] = useState('');
  const [closingCash, setClosingCash] = useState('');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCloseFormOpen, setIsCloseFormOpen] = useState(false);

  useEffect(() => {
    const savedRegisters = JSON.parse(localStorage.getItem('loungeShiftRegisters') || '[]');
    const openRegister = savedRegisters.find(r => !r.closedAt);
    setActiveRegister(openRegister);
  }, []);

  const handleOpenRegister = (e) => {
    e.preventDefault();
    const cashAmount = parseFloat(openingCash);
    if (isNaN(cashAmount) || cashAmount < 0) {
      toast({ title: "Invalid Amount", description: "Please enter a valid opening cash amount.", variant: "destructive" });
      return;
    }
    const newRegister = {
      id: `reg-${Date.now()}`,
      openedBy: user.username,
      openedAt: new Date().toISOString(),
      openingCash: cashAmount,
      transactions: [],
      cashSales: 3250.50, // Mock data
      cardSales: 5120.00, // Mock data
      creditSales: 450.00, // Mock data
      refunds: 120.00, // Mock data
      expenses: 200.00, // Mock data
      expectedCash: cashAmount + 3250.50, // Mock data
      closedAt: null,
      closingCash: null,
      difference: null,
      userDetails: {
        username: user.username,
        email: user.email,
        branch: user.branch,
        section: 'Main Bar' // Mock data
      },
      soldProducts: [ // Mock data
        { id: 'p1', name: 'Classic Mojito', brand: 'Bacardi', quantity: 20, total: 240.00 },
        { id: 'p2', name: 'Cheeseburger', brand: 'In-house', quantity: 15, total: 225.00 },
        { id: 'p3', name: 'Heineken', brand: 'Heineken', quantity: 50, total: 350.00 },
      ]
    };
    
    const savedRegisters = JSON.parse(localStorage.getItem('loungeShiftRegisters') || '[]');
    savedRegisters.push(newRegister);
    localStorage.setItem('loungeShiftRegisters', JSON.stringify(savedRegisters));
    
    setActiveRegister(newRegister);
    toast({ title: "Register Opened!", description: `Shift started with $${cashAmount.toFixed(2)}.` });
    setOpeningCash('');
  };

  const handleCloseRegister = (e) => {
    e.preventDefault();
    const cashAmount = parseFloat(closingCash);
     if (isNaN(cashAmount) || cashAmount < 0) {
      toast({ title: "Invalid Amount", description: "Please enter a valid closing cash amount.", variant: "destructive" });
      return;
    }
    const updatedRegister = {
      ...activeRegister,
      closedAt: new Date().toISOString(),
      closingCash: cashAmount,
      difference: cashAmount - activeRegister.expectedCash,
    };
    
    const savedRegisters = JSON.parse(localStorage.getItem('loungeShiftRegisters') || '[]');
    const updatedRegisters = savedRegisters.map(r => r.id === activeRegister.id ? updatedRegister : r);
    localStorage.setItem('loungeShiftRegisters', JSON.stringify(updatedRegisters));

    setActiveRegister(updatedRegister);
    toast({ title: "Register Closed!", description: `Shift ended.` });
    setIsCloseFormOpen(false);
  };
  
  const handleStartNewShift = () => {
    setActiveRegister(null);
    setClosingCash('');
    toast({ title: "Ready for new shift!" });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (activeRegister && activeRegister.closedAt) {
     return (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight gradient-text">Shift Register Closed</h2>
            <p className="text-muted-foreground">This shift has ended. Review the summary below.</p>
          </div>
          <motion.div initial="hidden" animate="visible" variants={cardVariants}>
              <Card className="glass-effect">
                  <CardHeader>
                      <CardTitle>Shift Summary</CardTitle>
                      <CardDescription>Register ID: {activeRegister.id}</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                      <InfoItem label="Opened By" value={activeRegister.openedBy} />
                      <InfoItem label="Opened At" value={new Date(activeRegister.openedAt).toLocaleString()} />
                      <InfoItem label="Opening Cash" value={`$${activeRegister.openingCash.toFixed(2)}`} />
                      <InfoItem label="Cash Sales" value={`$${activeRegister.cashSales.toFixed(2)}`} />
                      <InfoItem label="Expected Cash in Drawer" value={`$${activeRegister.expectedCash.toFixed(2)}`} />
                      <InfoItem label="Closed By" value={user.username} />
                      <InfoItem label="Closed At" value={new Date(activeRegister.closedAt).toLocaleString()} />
                      <InfoItem label="Counted Cash" value={`$${activeRegister.closingCash.toFixed(2)}`} />
                      <InfoItem label="Difference" value={`$${activeRegister.difference.toFixed(2)}`} className={activeRegister.difference < 0 ? 'text-destructive' : 'text-green-500'} />
                  </CardContent>
                  <CardContent>
                    <Button onClick={handleStartNewShift} className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        Start New Shift
                    </Button>
                  </CardContent>
              </Card>
          </motion.div>
      </div>
    );
  }

  if (activeRegister) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight gradient-text">Shift in Progress</h2>
          <p className="text-muted-foreground">Register opened by {activeRegister.openedBy} at {new Date(activeRegister.openedAt).toLocaleTimeString()}.</p>
        </div>

        <motion.div initial="hidden" animate="visible" variants={cardVariants}>
            <Card className="glass-effect">
                <CardHeader>
                    <CardTitle>Current Register Status</CardTitle>
                    <CardDescription>Real-time overview of the active shift.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatusItem icon={DollarSign} label="Opening Cash" value={`$${activeRegister.openingCash.toFixed(2)}`} />
                    <StatusItem icon={DollarSign} label="Cash Sales" value={`$${activeRegister.cashSales.toFixed(2)}`} color="text-green-500"/>
                    <StatusItem icon={DollarSign} label="Card Sales" value={`$${activeRegister.cardSales.toFixed(2)}`} color="text-blue-500"/>
                    <StatusItem icon={DollarSign} label="Expected in Drawer" value={`$${activeRegister.expectedCash.toFixed(2)}`} color="text-primary"/>
                </CardContent>
                 <CardContent className="flex gap-4">
                     <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-full"><Eye className="w-4 h-4 mr-2"/> View Details</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Shift Details</DialogTitle>
                                <DialogDescription>Detailed breakdown for the current shift.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4 text-sm">
                                <InfoItem label="Register ID" value={activeRegister.id} />
                                <InfoItem label="Opened By" value={activeRegister.openedBy} />
                                <InfoItem label="Opened At" value={new Date(activeRegister.openedAt).toLocaleString()} />
                                <hr/>
                                <InfoItem label="Opening Cash" value={`$${activeRegister.openingCash.toFixed(2)}`} />
                                <InfoItem label="Cash Sales" value={`$${activeRegister.cashSales.toFixed(2)}`} />
                                <InfoItem label="Card Sales" value={`$${activeRegister.cardSales.toFixed(2)}`} />
                                <hr/>
                                <InfoItem label="Expected Cash in Drawer" value={`$${activeRegister.expectedCash.toFixed(2)}`} className="font-bold"/>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Dialog open={isCloseFormOpen} onOpenChange={setIsCloseFormOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"><MinusCircle className="w-4 h-4 mr-2" /> Close Register</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Close Shift Register</DialogTitle>
                                <DialogDescription>Count the cash in the drawer and enter the final amount.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCloseRegister} className="space-y-4 pt-4">
                                <p className="text-sm text-muted-foreground">Expected amount: <span className="font-bold text-foreground">${activeRegister.expectedCash.toFixed(2)}</span></p>
                                <div className="space-y-2">
                                    <Label htmlFor="closing-cash">Counted Cash Amount</Label>
                                    <Input id="closing-cash" type="number" step="0.01" value={closingCash} onChange={(e) => setClosingCash(e.target.value)} placeholder="e.g., 4100.50" />
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="ghost" onClick={() => setIsCloseFormOpen(false)}>Cancel</Button>
                                    <Button type="submit">Confirm & Close Shift</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                 </CardContent>
            </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight gradient-text">Shift Register</h2>
        <p className="text-muted-foreground">Open a new shift register to begin sales operations.</p>
      </div>
       <motion.div initial="hidden" animate="visible" variants={cardVariants}>
        <Card className="max-w-md mx-auto glass-effect">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><PlusCircle className="w-6 h-6 text-primary"/> Open New Shift</CardTitle>
                <CardDescription>Enter the starting cash amount in the drawer.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleOpenRegister} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="opening-cash">Opening Cash Amount</Label>
                        <div className="relative">
                             <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="opening-cash" type="number" step="0.01" value={openingCash} onChange={(e) => setOpeningCash(e.target.value)} placeholder="e.g., 300.00" className="pl-8"/>
                        </div>
                    </div>
                    <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">Start Shift</Button>
                </form>
            </CardContent>
        </Card>
       </motion.div>
    </div>
  );
};

const StatusItem = ({ icon: Icon, label, value, color = 'text-foreground' }) => (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-background/50 dark:bg-slate-800/50">
        <div className="p-3 rounded-full bg-primary/10">
            <Icon className={`w-6 h-6 text-primary`} />
        </div>
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
    </div>
);

const InfoItem = ({ label, value, className }) => (
  <div className="flex justify-between items-center py-2 border-b border-border/50">
    <p className="text-muted-foreground">{label}</p>
    <p className={`font-semibold ${className}`}>{value}</p>
  </div>
);

export default ShiftRegister;