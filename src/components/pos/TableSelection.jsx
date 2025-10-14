import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Utensils, CheckCircle, Lock, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const TableSelection = ({ session, setSession, user }) => {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('loungeTables');
    if (saved) {
      setTables(JSON.parse(saved));
    } else {
      const initial = [
        { id: 1, name: 'T1', status: 'available', capacity: 4, locked_by: null },
        { id: 2, name: 'T2', status: 'occupied', capacity: 4, locked_by: 'Jane Smith' },
        { id: 3, name: 'T3', status: 'available', capacity: 2, locked_by: null },
        { id: 4, name: 'T4', status: 'available', capacity: 6, locked_by: null },
        { id: 5, name: 'T5', status: 'reserved', capacity: 4, locked_by: null },
        { id: 6, name: 'B1', status: 'occupied', capacity: 8, locked_by: 'John Doe' },
      ];
      setTables(initial);
      localStorage.setItem('loungeTables', JSON.stringify(initial));
    }
  }, []);

  const handleSelectTable = (table) => {
    if (table.status !== 'available') {
      toast({ title: 'Table Not Available', description: `This table is currently ${table.status}.`, variant: 'destructive' });
      return;
    }
    
    const updatedTables = tables.map(t => 
      t.id === table.id ? { ...t, status: 'occupied', locked_by: user.username } : t
    );
    setTables(updatedTables);
    localStorage.setItem('loungeTables', JSON.stringify(updatedTables));
    
    setSession({ ...session, table: { ...table, status: 'occupied', locked_by: user.username } });
    toast({ title: `Table ${table.name} Selected`, description: `Locked by ${user.username}` });
  };

  const getStatusVisuals = (table) => {
    if (table.locked_by && table.locked_by !== user.username) {
      return { icon: Lock, color: 'text-red-500', bgColor: 'from-red-500/10', borderColor: 'border-red-300' };
    }
    switch (table.status) {
      case 'available':
        return { icon: CheckCircle, color: 'text-green-500', bgColor: 'from-green-500/10', borderColor: 'border-green-300' };
      case 'occupied':
        return { icon: Utensils, color: 'text-orange-500', bgColor: 'from-orange-500/10', borderColor: 'border-orange-300' };
      case 'reserved':
        return { icon: User, color: 'text-blue-500', bgColor: 'from-blue-500/10', borderColor: 'border-blue-300' };
      default:
        return { icon: Utensils, color: 'text-gray-500', bgColor: 'from-gray-500/10', borderColor: 'border-gray-300' };
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold gradient-text mb-2">Select a Table</h2>
        <p className="text-gray-600">Choose a table to start an order</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {tables.map((table) => {
          const { icon: Icon, color, bgColor, borderColor } = getStatusVisuals(table);
          const isLockedByOther = table.locked_by && table.locked_by !== user.username;
          return (
            <motion.div
              key={table.id}
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: table.id * 0.05 }}
            >
              <Card
                onClick={() => handleSelectTable(table)}
                className={`glass-effect border-2 ${borderColor} bg-gradient-to-br ${bgColor} h-full flex flex-col cursor-pointer hover:shadow-xl transition-all ${isLockedByOther ? 'cursor-not-allowed opacity-60' : ''}`}
              >
                <CardHeader className="pb-2 text-center">
                  <CardTitle className="text-4xl font-bold">{table.name}</CardTitle>
                  <div className={`flex items-center justify-center gap-1.5 ${color}`}>
                    <Icon className="w-4 h-4" />
                    <span className="font-semibold capitalize text-sm">{isLockedByOther ? 'Locked' : table.status}</span>
                  </div>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-xs text-gray-500">{table.capacity} Guests</p>
                  {table.locked_by && <p className="text-xs text-gray-500 mt-1">By: {table.locked_by}</p>}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TableSelection;