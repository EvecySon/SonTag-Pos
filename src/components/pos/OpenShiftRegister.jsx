import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, PlayCircle, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const OpenShiftRegister = ({ onShiftOpen, user }) => {
  const [openingCash, setOpeningCash] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [branchSections, setBranchSections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedBranches = localStorage.getItem('loungeBranches');
    if (savedBranches && user.branchId) {
      const allBranches = JSON.parse(savedBranches);
      const currentBranch = allBranches.find(b => b.id.toString() === user.branchId.toString());
      if (currentBranch && currentBranch.sections) {
        setBranchSections(currentBranch.sections);
      }
    }
  }, [user.branchId]);

  const handleOpenRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const cashAmount = parseFloat(openingCash);
    if (isNaN(cashAmount) || cashAmount < 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid opening cash amount.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!selectedSectionId) {
      toast({
        title: "Section Not Selected",
        description: "Please select a section to open the register.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    const selectedSection = branchSections.find(s => s.id === selectedSectionId);

    const newRegister = {
      id: `reg-${Date.now()}`,
      openedBy: user.username,
      openedAt: new Date().toISOString(),
      openingCash: cashAmount,
      sectionId: selectedSection.id,
      sectionName: selectedSection.name,
      transactions: [],
      cashSales: 0,
      cardSales: 0,
      expectedCash: cashAmount,
      closedAt: null,
      closingCash: null,
      difference: null,
    };

    await new Promise(resolve => setTimeout(resolve, 500));

    localStorage.setItem('loungeShiftRegister', JSON.stringify(newRegister));
    
    toast({
      title: "Shift Register Opened!",
      description: `Shift started for ${selectedSection.name} with $${cashAmount.toFixed(2)}.`,
    });

    setIsLoading(false);
    onShiftOpen(newRegister);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-indigo-100 dark:from-slate-900 dark:to-indigo-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Card className="w-full max-w-md mx-auto glass-effect shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center mb-4">
              <PlayCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold gradient-text">Open Shift Register</CardTitle>
            <CardDescription>Select a section and enter the starting cash to begin.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleOpenRegister} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="section" className="text-sm">Select Section</Label>
                <Select onValueChange={setSelectedSectionId} value={selectedSectionId} disabled={isLoading}>
                  <SelectTrigger id="section" className="h-12">
                     <Building2 className="mr-2 h-5 w-5 text-muted-foreground" />
                    <SelectValue placeholder="Choose a section..." />
                  </SelectTrigger>
                  <SelectContent>
                    {branchSections.length > 0 ? (
                      branchSections.map(section => (
                        <SelectItem key={section.id} value={section.id}>{section.name}</SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-sections" disabled>No sections available. Please add one in Branch Management.</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="opening-cash" className="text-sm">Opening Cash Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="opening-cash"
                    type="number"
                    step="0.01"
                    value={openingCash}
                    onChange={(e) => setOpeningCash(e.target.value)}
                    placeholder="e.g., 300.00"
                    className="pl-10 h-12 text-lg"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" disabled={isLoading || branchSections.length === 0}>
                {isLoading ? 'Starting Shift...' : 'Start Shift'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default OpenShiftRegister;