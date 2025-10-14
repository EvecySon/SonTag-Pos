import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldPlus, Edit, Trash2, CheckSquare, Square, DollarSign, Book, KeyRound, Clock, Calendar, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const allPermissions = [
  { id: 'pos', name: 'Access POS' },
  { id: 'inventory', name: 'Manage Inventory' },
  { id: 'product_management', name: 'Manage Products' },
  { id: 'stock_transfer', name: 'Transfer Stock' },
  { id: 'stock_adjustment', name: 'Adjust Stock' },
  { id: 'reports', name: 'View Reports' },
  { id: 'users', name: 'Manage Users' },
  { id: 'settings', name: 'Access Settings' },
  { id: 'tables', name: 'Manage Tables' },
  { id: 'orders', name: 'Manage Orders' },
  { id: 'accept_payment', name: 'Accept Payment', icon: DollarSign },
  { id: 'accounting', name: 'Accounting', icon: Book },
  { id: 'manage_override_pin', name: 'Manage Override PIN', icon: KeyRound },
  { id: 'assign_shift', name: 'Assign Shift', icon: Clock },
  { id: 'leave', name: 'Leave Management', icon: Calendar },
  { id: 'draft_view_all', name: 'View/Edit All Drafts', icon: FileText },
  { id: 'draft_view_own', name: 'View/Edit Own Drafts', icon: FileText },
  { id: 'all', name: 'Full Admin Access' },
];

const initialRoles = [
  { id: 'manager', name: 'Manager', permissions: ['all'] },
  { id: 'cashier', name: 'Cashier', permissions: ['pos', 'orders', 'accept_payment', 'draft_view_own'] },
  { id: 'waiter', name: 'Waiter', permissions: ['pos', 'tables', 'draft_view_own'] },
];

const RolesAndPermissions = () => {
  const [roles, setRoles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  useEffect(() => {
    const savedRoles = localStorage.getItem('loungeRoles');
    if (savedRoles) {
      setRoles(JSON.parse(savedRoles));
    } else {
      setRoles(initialRoles);
      localStorage.setItem('loungeRoles', JSON.stringify(initialRoles));
    }
  }, []);

  const saveRoles = (updatedRoles) => {
    setRoles(updatedRoles);
    localStorage.setItem('loungeRoles', JSON.stringify(updatedRoles));
  };

  const handleAddRole = () => {
    setEditingRole(null);
    setIsModalOpen(true);
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    setIsModalOpen(true);
  };

  const handleDeleteRole = (roleId) => {
    const updatedRoles = roles.filter(r => r.id !== roleId);
    saveRoles(updatedRoles);
    toast({ title: 'Role Deleted', description: 'The role has been successfully removed.' });
  };

  const handleSaveRole = (roleData) => {
    if (editingRole) {
      const updatedRoles = roles.map(r => r.id === editingRole.id ? { ...r, ...roleData } : r);
      saveRoles(updatedRoles);
      toast({ title: 'Role Updated', description: 'Role details have been saved.' });
    } else {
      const newRole = { id: roleData.name.toLowerCase().replace(/\s/g, '-'), ...roleData };
      const updatedRoles = [...roles, newRole];
      saveRoles(updatedRoles);
      toast({ title: 'Role Added', description: 'A new role has been created.' });
    }
    setIsModalOpen(false);
  };
  
  const getRoleColor = (roleName) => {
    const colors = {
      'Manager': 'from-red-500 to-orange-500',
      'Cashier': 'from-green-500 to-emerald-500',
      'Barista': 'from-sky-500 to-cyan-500',
      'Waiter': 'from-lime-500 to-green-500',
      'Admin': 'from-violet-600 to-purple-600',
    };
    return colors[roleName] || 'from-slate-500 to-slate-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text mb-2">Roles & Permissions</h2>
          <p className="text-gray-600">Define access levels for your team members.</p>
        </div>
        <Button onClick={handleAddRole} className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 gap-2">
          <ShieldPlus className="w-4 h-4" />
          Add Role
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role, index) => (
          <motion.div
            key={role.id}
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="glass-effect border-2 border-white/30 flex flex-col h-full">
              <CardHeader>
                <div className="flex items-center gap-4">
                   <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${getRoleColor(role.name)} flex items-center justify-center shadow-lg`}>
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl">{role.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">Permissions:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {role.permissions.map(p => <span key={p} className="text-xs bg-orange-100 text-orange-800 font-semibold px-2 py-0.5 rounded-full">{allPermissions.find(ap => ap.id === p)?.name || p}</span>)}
                  </div>
                </div>
                <div className="flex gap-2 pt-4 mt-4">
                  <Button onClick={() => handleEditRole(role)} variant="outline" size="sm" className="flex-1"><Edit className="w-3 h-3 mr-1.5" />Edit</Button>
                  <Button onClick={() => handleDeleteRole(role.id)} variant="destructive" size="sm" className="flex-1"><Trash2 className="w-3 h-3 mr-1.5" />Delete</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <RoleFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveRole} role={editingRole} />
    </div>
  );
};

const RoleFormModal = ({ isOpen, onClose, onSave, role }) => {
  const [name, setName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    if (role) {
      setName(role.name);
      setSelectedPermissions(role.permissions);
    } else {
      setName('');
      setSelectedPermissions([]);
    }
  }, [role, isOpen]);
  
  const handlePermissionToggle = (permissionId) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId) 
      ? prev.filter(p => p !== permissionId)
      : [...prev, permissionId]
    );
  };

  const handleSubmit = () => {
    onSave({ name, permissions: selectedPermissions });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{role ? 'Edit Role' : 'Add New Role'}</DialogTitle>
          <DialogDescription>
            {role ? 'Update the name and permissions for this role.' : 'Define a new role and assign permissions.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Role Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Permissions</Label>
            <div className="grid grid-cols-2 gap-2 p-3 border rounded-md max-h-60 overflow-y-auto">
              {allPermissions.map(p => (
                <div key={p.id} className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-muted" onClick={() => handlePermissionToggle(p.id)}>
                  {selectedPermissions.includes(p.id) ? <CheckSquare className="w-5 h-5 text-primary" /> : <Square className="w-5 h-5 text-muted-foreground" />}
                  <span className="text-sm">{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Save Role</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RolesAndPermissions;