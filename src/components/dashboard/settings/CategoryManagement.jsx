import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { PlusCircle, MoreHorizontal, Edit, Trash2, Package } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const CategoryManagement = ({ user }) => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryCode, setCategoryCode] = useState('');

  useEffect(() => {
    const savedCategories = localStorage.getItem('loungeCategories');
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      const initialCategories = [
        { id: 1, name: 'Hot Drinks', code: 'HD001' },
        { id: 2, name: 'Cold Drinks', code: 'CD001' },
        { id: 3, name: 'Sandwiches', code: 'SN001' },
      ];
      setCategories(initialCategories);
      localStorage.setItem('loungeCategories', JSON.stringify(initialCategories));
    }
  }, []);

  const updateLocalStorage = (updatedCategories) => {
    localStorage.setItem('loungeCategories', JSON.stringify(updatedCategories));
  };

  const handleOpenModal = (category = null) => {
    setEditingCategory(category);
    setCategoryName(category ? category.name : '');
    setCategoryCode(category ? category.code : '');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setCategoryName('');
    setCategoryCode('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!categoryName || !categoryCode) {
      toast({ title: 'Error', description: 'Category Name and Code are required.', variant: 'destructive' });
      return;
    }

    if (editingCategory) {
      const updatedCategories = categories.map(c => c.id === editingCategory.id ? { ...c, name: categoryName, code: categoryCode } : c);
      setCategories(updatedCategories);
      updateLocalStorage(updatedCategories);
      toast({ title: 'Success', description: 'Category updated successfully.' });
    } else {
      const newCategory = {
        id: Date.now(),
        name: categoryName,
        code: categoryCode,
      };
      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      updateLocalStorage(updatedCategories);
      toast({ title: 'Success', description: 'Category added successfully.' });
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    const updatedCategories = categories.filter(c => c.id !== id);
    setCategories(updatedCategories);
    updateLocalStorage(updatedCategories);
    toast({ title: 'Success', description: 'Category deleted successfully.' });
  };

  return (
    <Card className="glass-effect border-2 border-white/30 dark:border-slate-700/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2"><Package />Category Management</CardTitle>
          <CardDescription>Manage product categories for your inventory.</CardDescription>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category Name</TableHead>
              <TableHead>Category Code</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map(category => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.code}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleOpenModal(category)}>
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
                              This action cannot be undone. This will permanently delete the category "{category.name}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(category.id)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
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
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} className="col-span-3" placeholder="e.g., Hot Drinks" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-right">Code</Label>
                <Input id="code" value={categoryCode} onChange={(e) => setCategoryCode(e.target.value)} className="col-span-3" placeholder="e.g., HD001" />
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

export default CategoryManagement;