import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { PlusCircle, MoreHorizontal, Edit, Trash2, Award } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const BrandManagement = ({ user }) => {
  const [brands, setBrands] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [brandName, setBrandName] = useState('');

  useEffect(() => {
    const savedBrands = localStorage.getItem('loungeBrands');
    if (savedBrands) {
      setBrands(JSON.parse(savedBrands));
    } else {
      const initialBrands = [
        { id: 1, name: 'Lavazza' },
        { id: 2, name: 'Coca-Cola' },
        { id: 3, name: 'Generic' },
      ];
      setBrands(initialBrands);
      localStorage.setItem('loungeBrands', JSON.stringify(initialBrands));
    }
  }, []);

  const updateLocalStorage = (updatedBrands) => {
    localStorage.setItem('loungeBrands', JSON.stringify(updatedBrands));
  };

  const handleOpenModal = (brand = null) => {
    setEditingBrand(brand);
    setBrandName(brand ? brand.name : '');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBrand(null);
    setBrandName('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!brandName) {
      toast({ title: 'Error', description: 'Brand Name is required.', variant: 'destructive' });
      return;
    }

    if (editingBrand) {
      const updatedBrands = brands.map(b => b.id === editingBrand.id ? { ...b, name: brandName } : b);
      setBrands(updatedBrands);
      updateLocalStorage(updatedBrands);
      toast({ title: 'Success', description: 'Brand updated successfully.' });
    } else {
      const newBrand = {
        id: Date.now(),
        name: brandName,
      };
      const updatedBrands = [...brands, newBrand];
      setBrands(updatedBrands);
      updateLocalStorage(updatedBrands);
      toast({ title: 'Success', description: 'Brand added successfully.' });
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    const updatedBrands = brands.filter(b => b.id !== id);
    setBrands(updatedBrands);
    updateLocalStorage(updatedBrands);
    toast({ title: 'Success', description: 'Brand deleted successfully.' });
  };

  return (
    <Card className="glass-effect border-2 border-white/30 dark:border-slate-700/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2"><Award />Brand Management</CardTitle>
          <CardDescription>Manage product brands for your inventory.</CardDescription>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Brand
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Brand Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.map(brand => (
              <TableRow key={brand.id}>
                <TableCell className="font-medium">{brand.name}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleOpenModal(brand)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Trash2 className="mr-2 h-4 w-4 text-red-500" /> <span className="text-red-500">Delete</span>
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the brand "{brand.name}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(brand.id)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] glass-effect">
          <DialogHeader>
            <DialogTitle>{editingBrand ? 'Edit Brand' : 'Add New Brand'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" value={brandName} onChange={(e) => setBrandName(e.target.value)} className="col-span-3" placeholder="e.g., Lavazza" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseModal}>Cancel</Button>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default BrandManagement;