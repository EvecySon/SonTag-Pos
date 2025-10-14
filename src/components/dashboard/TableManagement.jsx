import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Utensils, Circle, CheckCircle, Clock, Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const TableManagement = ({ user }) => {
  const [tables, setTables] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTable, setCurrentTable] = useState(null);
  const [tableName, setTableName] = useState('');
  const [tableCapacity, setTableCapacity] = useState('');
  const [tableSection, setTableSection] = useState('');
  const [branchSections, setBranchSections] = useState([]);

  useEffect(() => {
    const savedTables = localStorage.getItem('loungeTables');
    if (savedTables) {
      setTables(JSON.parse(savedTables));
    } else {
      const initialTables = [
        { id: 1, name: 'T1', status: 'available', capacity: 4, section: 'Main Bar' },
        { id: 2, name: 'T2', status: 'occupied', capacity: 4, order: '#1234', total: 45.50, section: 'Main Bar' },
        { id: 3, name: 'T3', status: 'available', capacity: 2, section: 'Lounge Bar' },
        { id: 4, name: 'T4', status: 'available', capacity: 6, section: 'Club Section' },
        { id: 5, name: 'T5', status: 'reserved', capacity: 4, section: 'Rooftop Bar' },
      ];
      setTables(initialTables);
      localStorage.setItem('loungeTables', JSON.stringify(initialTables));
    }

    const savedBranches = localStorage.getItem('loungeBranches');
    if (savedBranches && user.branchId) {
      const allBranches = JSON.parse(savedBranches);
      const currentBranch = allBranches.find(b => b.id.toString() === user.branchId.toString());
      if (currentBranch && currentBranch.sections) {
        setBranchSections(currentBranch.sections);
      }
    }
  }, [user.branchId]);

  const saveTablesToLocal = (updatedTables) => {
    setTables(updatedTables);
    localStorage.setItem('loungeTables', JSON.stringify(updatedTables));
  };

  const handleAddTable = () => {
    setCurrentTable(null);
    setTableName('');
    setTableCapacity('');
    setTableSection('');
    setIsDialogOpen(true);
  };

  const handleEditTable = (table) => {
    setCurrentTable(table);
    setTableName(table.name);
    setTableCapacity(table.capacity.toString());
    setTableSection(table.section);
    setIsDialogOpen(true);
  };

  const handleDeleteTable = (tableId) => {
    const updatedTables = tables.filter(t => t.id !== tableId);
    saveTablesToLocal(updatedTables);
    toast({ title: "Table Deleted", description: "The table has been successfully removed." });
  };

  const handleSaveTable = () => {
    if (!tableName || !tableCapacity || !tableSection) {
      toast({ variant: "destructive", title: "Missing Information", description: "Please fill out all fields." });
      return;
    }

    if (currentTable) {
      const updatedTables = tables.map(t => 
        t.id === currentTable.id ? { ...t, name: tableName, capacity: parseInt(tableCapacity), section: tableSection } : t
      );
      saveTablesToLocal(updatedTables);
      toast({ title: "Table Updated", description: "The table has been successfully updated." });
    } else {
      const newTable = {
        id: tables.length > 0 ? Math.max(...tables.map(t => t.id)) + 1 : 1,
        name: tableName,
        capacity: parseInt(tableCapacity),
        status: 'available',
        section: tableSection,
      };
      saveTablesToLocal([...tables, newTable]);
      toast({ title: "Table Added", description: "The new table has been successfully added." });
    }
    setIsDialogOpen(false);
  };

  const getStatusVisuals = (status) => {
    switch (status) {
      case 'available':
        return { icon: CheckCircle, color: 'text-green-500', bgColor: 'from-green-500/10 to-green-500/0', borderColor: 'border-green-300' };
      case 'occupied':
        return { icon: Utensils, color: 'text-orange-500', bgColor: 'from-orange-500/10 to-orange-500/0', borderColor: 'border-orange-300' };
      case 'reserved':
        return { icon: Clock, color: 'text-blue-500', bgColor: 'from-blue-500/10 to-blue-500/0', borderColor: 'border-blue-300' };
      default:
        return { icon: Circle, color: 'text-gray-500', bgColor: 'from-gray-500/10 to-gray-500/0', borderColor: 'border-gray-300' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold gradient-text mb-2">Table Management</h2>
          <p className="text-gray-600">Manage seating, reservations, and table status for your branch.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddTable}><Plus className="mr-2 h-4 w-4" /> Add Table</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{currentTable ? 'Edit Table' : 'Add New Table'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" value={tableName} onChange={(e) => setTableName(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="capacity" className="text-right">Capacity</Label>
                <Input id="capacity" type="number" value={tableCapacity} onChange={(e) => setTableCapacity(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="section" className="text-right">Section</Label>
                 <Select value={tableSection} onValueChange={setTableSection}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a section" />
                    </SelectTrigger>
                    <SelectContent>
                      {branchSections.length > 0 ? branchSections.map((section) => (
                        <SelectItem key={section.id} value={section.name}>{section.name}</SelectItem>
                      )) : <SelectItem value="disabled" disabled>No sections found. Add sections in Branch Management.</SelectItem>}
                    </SelectContent>
                  </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
              <Button onClick={handleSaveTable}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {tables.map((table) => {
          const { icon: Icon, color, bgColor, borderColor } = getStatusVisuals(table.status);
          return (
            <motion.div
              key={table.id}
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: table.id * 0.05 }}
            >
              <Card className={`glass-effect border-2 ${borderColor} bg-gradient-to-br ${bgColor} h-full flex flex-col justify-between`}>
                <div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl font-bold">{table.name}</CardTitle>
                      <div className={`flex items-center gap-1.5 ${color}`}>
                        <Icon className="w-5 h-5" />
                        <span className="font-semibold capitalize text-sm">{table.status}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{table.capacity} Guests</span>
                      <span className="font-medium text-gray-400">{table.section}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {table.status === 'occupied' && (
                      <div className="text-center">
                        <p className="text-xs text-gray-600">Order {table.order}</p>
                        <p className="text-lg font-bold gradient-text">${(table.total || 0).toFixed(2)}</p>
                      </div>
                    )}
                  </CardContent>
                </div>
                <CardContent className="flex flex-col gap-2 pt-2">
                   <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" })}
                  >
                     {table.status === 'available' ? 'Create Order' : 'View Details'}
                   </Button>
                   <div className="flex gap-2">
                     <Button variant="outline" size="sm" className="w-full" onClick={() => handleEditTable(table)}><Edit className="h-4 w-4" /></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="destructive" size="sm" className="w-full" disabled={table.status !== 'available'}><Trash2 className="h-4 w-4" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the table and its data. You can only delete available tables.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteTable(table.id)}>Continue</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                   </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TableManagement;