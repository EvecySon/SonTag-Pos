import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Shield, Edit, Trash2, Check, X as XIcon } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';

const initialStaff = [
    { id: 1, firstName: 'John', surname: 'Doe', username: 'johndoe', email: 'john.d@example.com', phone: '123-456-7890', role: 'manager', branch: 'Main Branch', isServiceStaff: false, password: 'password123' },
    { id: 2, firstName: 'Jane', surname: 'Smith', username: 'janesmith', email: 'jane.s@example.com', phone: '123-456-7891', role: 'barista', branch: 'Main Branch', isServiceStaff: true, password: 'password123' },
    { id: 3, firstName: 'Mike', surname: 'Johnson', username: 'mikej', email: 'mike.j@example.com', phone: '123-456-7892', role: 'waiter', branch: 'Main Branch', isServiceStaff: true, password: 'password123' },
];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    const savedUsers = localStorage.getItem('loungeUsers');
    setUsers(savedUsers ? JSON.parse(savedUsers) : initialStaff);

    const savedRoles = localStorage.getItem('loungeRoles');
    setRoles(savedRoles ? JSON.parse(savedRoles) : []);
  }, []);

  const saveUsers = (updatedUsers) => {
    setUsers(updatedUsers);
    localStorage.setItem('loungeUsers', JSON.stringify(updatedUsers));
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };
  
  const handleDeleteUser = (userId) => {
    const updatedUsers = users.filter(u => u.id !== userId);
    saveUsers(updatedUsers);
    toast({ title: 'User Deleted', description: 'The user has been successfully removed.' });
  };

  const handleSaveUser = (userData) => {
    if (editingUser) {
      const updatedUsers = users.map(u => u.id === editingUser.id ? { ...u, ...userData } : u);
      saveUsers(updatedUsers);
      toast({ title: 'User Updated', description: 'User details have been saved.' });
    } else {
      const newUser = { id: Date.now(), ...userData };
      const updatedUsers = [...users, newUser];
      saveUsers(updatedUsers);
      toast({ title: 'User Added', description: 'A new user has been created.' });
    }
    setIsModalOpen(false);
  };

  const getRoleInfo = (roleId) => {
    return roles.find(r => r.id === roleId) || { name: 'Unknown', permissions: [] };
  };

  const getRoleColor = (roleName) => {
    const colors = {
      'Manager': 'from-purple-500 to-pink-600',
      'Barista': 'from-blue-500 to-cyan-600',
      'Waiter': 'from-green-500 to-emerald-600',
    };
    return colors[roleName] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text mb-2">User Management</h2>
          <p className="text-gray-600">Manage your team, roles, and access levels</p>
        </div>
        <Button onClick={handleAddUser} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2">
          <UserPlus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user, index) => {
            const roleInfo = getRoleInfo(user.role);
            return (
          <motion.div
            key={user.id}
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="glass-effect border-2 border-white/30 flex flex-col h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${getRoleColor(roleInfo.name)} flex items-center justify-center shadow-lg`}>
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{user.firstName} {user.surname}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Shield className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-500">{roleInfo.name}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Username:</span>
                    <span className="font-semibold">{user.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Branch:</span>
                    <span className="font-semibold">{user.branch}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Staff:</span>
                    <span className="font-semibold">{user.isServiceStaff ? <Check className="w-4 h-4 text-green-500"/> : <XIcon className="w-4 h-4 text-red-500"/>}</span>
                  </div>
                </div>
                <div className="flex gap-2 pt-4 mt-2">
                  <Button onClick={() => handleEditUser(user)} variant="outline" size="sm" className="flex-1"><Edit className="w-3 h-3 mr-1.5" />Edit</Button>
                  <Button onClick={() => handleDeleteUser(user.id)} variant="destructive" size="sm" className="flex-1"><Trash2 className="w-3 h-3 mr-1.5" />Delete</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )})}
      </div>
      <UserFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveUser} user={editingUser} roles={roles} />
    </div>
  );
};

const UserFormModal = ({ isOpen, onClose, onSave, user, roles }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    role: '',
    branch: '',
    isServiceStaff: false,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        surname: user.surname || '',
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        password: user.password || '',
        role: user.role || '',
        branch: user.branch || '',
        isServiceStaff: user.isServiceStaff || false,
      });
    } else {
      setFormData({
        firstName: '',
        surname: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        role: roles.length > 0 ? roles[0].id : '',
        branch: '',
        isServiceStaff: false,
      });
    }
  }, [user, isOpen, roles]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleRoleChange = (roleId) => {
    setFormData(prev => ({ ...prev, role: roleId }));
  };

  const handleSwitchChange = (checked) => {
    setFormData(prev => ({ ...prev, isServiceStaff: checked }));
  };
  
  const handleSubmit = () => {
    onSave(formData);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{user ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogDescription>
            {user ? 'Update the details for this user.' : 'Fill in the details for the new user.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="firstName" className="text-right">First Name</Label>
            <Input id="firstName" value={formData.firstName} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="surname" className="text-right">Surname</Label>
            <Input id="surname" value={formData.surname} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">Username</Label>
            <Input id="username" value={formData.username} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email</Label>
            <Input id="email" type="email" value={formData.email} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">Phone</Label>
            <Input id="phone" type="tel" value={formData.phone} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">Password</Label>
            <Input id="password" type="password" value={formData.password} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">Role</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="col-span-3 justify-start">
                  {roles.find(r => r.id === formData.role)?.name || 'Select a role'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[--radix-dropdown-menu-trigger-width]">
                {roles.map(role => (
                   <DropdownMenuItem key={role.id} onSelect={() => handleRoleChange(role.id)}>
                     {role.name}
                   </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="branch" className="text-right">Branch</Label>
            <Input id="branch" value={formData.branch} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isServiceStaff" className="text-right">Service Staff</Label>
            <Switch id="isServiceStaff" checked={formData.isServiceStaff} onCheckedChange={handleSwitchChange} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserManagement;