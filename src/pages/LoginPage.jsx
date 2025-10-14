import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, Coffee, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const LoginPage = ({ onLogin, onNavigateToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedBranches = localStorage.getItem('loungeBranches');
    if (savedBranches) {
      setBranches(JSON.parse(savedBranches));
    } else {
      const initialBranches = [
        { id: 1, name: 'Main Branch', location: '123 Main St, Downtown' },
        { id: 2, name: 'Downtown', location: '456 Oak Ave, City Center' },
        { id: 3, name: 'Westside', location: '789 Pine Rd, West District' },
      ];
      setBranches(initialBranches);
      localStorage.setItem('loungeBranches', JSON.stringify(initialBranches));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password || !selectedBranch) {
      toast({
        title: "Error",
        description: "Please fill in all fields, including selecting a branch.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      await onLogin({ username, password });
      const branchDetails = branches.find(b => b.id.toString() === selectedBranch);
      toast({
        title: "Welcome back! 🎉",
        description: `Logged into ${branchDetails ? branchDetails.name : 'Selected branch'} as ${username}`,
      });
    } catch (err) {
      toast({ title: "Login failed", description: String(err?.message || err), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-500/20 to-indigo-600/20" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-effect rounded-3xl p-8 shadow-2xl">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 mb-4 shadow-lg">
              <Coffee className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Lounge ERP</h1>
            <p className="text-gray-600">Sign In to Your Business</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="branch" className="text-gray-700 font-semibold">Branch</Label>
              <div className="relative">
                 <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                    <SelectTrigger className="h-12 border-2 focus:border-purple-500 transition-all pl-10">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <SelectValue placeholder="Select a branch to log into" />
                    </SelectTrigger>
                    <SelectContent>
                        {branches.map(branch => (
                            <SelectItem key={branch.id} value={branch.id.toString()}>{branch.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700 font-semibold">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 h-12 border-2 focus:border-purple-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-semibold">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 border-2 focus:border-purple-500 transition-all"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              {isLoading ? 'Logging in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Don't have an account? <span onClick={onNavigateToRegister} className="font-semibold text-purple-600 hover:underline cursor-pointer">Register here</span>.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;