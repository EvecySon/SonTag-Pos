import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Edit, Trash2, Box } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const sectionFunctions = [
  { id: 'store', name: 'Store', description: 'Purchase storage and inventory' },
  { id: 'production_bar', name: 'Production (Bar)', description: 'Production & distribution of bar items' },
  { id: 'production_kitchen', name: 'Production (Kitchen)', description: 'Production & distribution of kitchen items' },
  { id: 'sales', name: 'Sales Operation', description: 'Direct sales to customers' },
];

const SectionForm = ({ section, onSave, onCancel }) => {
  const [name, setName] = useState(section ? section.name : '');
  const [description, setDescription] = useState(section ? section.description : '');
  const [func, setFunc] = useState(section ? section.function : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !func) {
      toast({
        title: "Validation Error",
        description: "Section name and function are required.",
        variant: "destructive",
      });
      return;
    }
    onSave({
      id: section ? section.id : Date.now(),
      name,
      description,
      function: func,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="section-name">Section Name</Label>
        <Input
          id="section-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Rooftop Bar"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="section-function">Section Function</Label>
        <Select value={func} onValueChange={setFunc}>
          <SelectTrigger id="section-function">
            <SelectValue placeholder="Select a function" />
          </SelectTrigger>
          <SelectContent>
            {sectionFunctions.map((f) => (
              <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="section-description">Description</Label>
        <Input
          id="section-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description"
        />
      </div>
      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{section ? 'Save Changes' : 'Create Section'}</Button>
      </DialogFooter>
    </form>
  );
};

const SectionManagement = ({ branch, onBack }) => {
  const [sections, setSections] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);

  useEffect(() => {
    const allBranches = JSON.parse(localStorage.getItem('loungeBranches')) || [];
    const currentBranch = allBranches.find(b => b.id === branch.id);
    if (currentBranch) {
      setSections(currentBranch.sections || []);
    }
  }, [branch.id]);

  const updateBranchSections = (updatedSections) => {
    const allBranches = JSON.parse(localStorage.getItem('loungeBranches')) || [];
    const updatedBranches = allBranches.map(b => 
      b.id === branch.id ? { ...b, sections: updatedSections } : b
    );
    localStorage.setItem('loungeBranches', JSON.stringify(updatedBranches));
    setSections(updatedSections);
  };

  const handleSaveSection = (sectionData) => {
    let updatedSections;
    if (editingSection) {
      updatedSections = sections.map((s) => (s.id === sectionData.id ? sectionData : s));
      toast({ title: "Section Updated!", description: `The "${sectionData.name}" section has been updated.` });
    } else {
      updatedSections = [...sections, { ...sectionData, id: sectionData.name.toLowerCase().replace(/\s+/g, '-') + Date.now() }];
      toast({ title: "Section Created!", description: `The "${sectionData.name}" section has been added.` });
    }
    updateBranchSections(updatedSections);
    setIsFormOpen(false);
    setEditingSection(null);
  };

  const handleDeleteSection = (sectionId) => {
    const sectionToDelete = sections.find(s => s.id === sectionId);
    const updatedSections = sections.filter((s) => s.id !== sectionId);
    updateBranchSections(updatedSections);
    toast({ title: "Section Deleted!", description: `The "${sectionToDelete.name}" section has been removed.` });
  };

  const openAddForm = () => {
    setEditingSection(null);
    setIsFormOpen(true);
  };

  const openEditForm = (section) => {
    setEditingSection(section);
    setIsFormOpen(true);
  };

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Button variant="ghost" onClick={onBack} className="mb-2 -ml-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Branches
            </Button>
            <h2 className="text-3xl font-bold tracking-tight gradient-text">Manage Sections</h2>
            <p className="text-muted-foreground">Operational areas for the "{branch.name}" branch.</p>
          </div>
          <DialogTrigger asChild>
            <Button onClick={openAddForm} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2">
              <Plus className="w-4 h-4" /> Add Section
            </Button>
          </DialogTrigger>
        </div>

        <Card className="glass-effect border-2 border-white/30 dark:border-white/10">
          <CardHeader>
            <CardTitle>Section List</CardTitle>
            <CardDescription>All sections currently configured for this branch.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sections.length > 0 ? (
                sections.map((section) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-background/50 dark:bg-slate-800/50"
                  >
                    <div className="flex items-center gap-4">
                      <Box className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold">{section.name}</p>
                        <p className="text-sm text-muted-foreground">{sectionFunctions.find(f => f.id === section.function)?.name || 'No function'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditForm(section)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the "{section.name}" section.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteSection(section.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No sections found. Add one to get started!</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingSection ? 'Edit Section' : 'Add New Section'}</DialogTitle>
          <DialogDescription>
            {editingSection ? `Update the details for your section in ${branch.name}.` : `Create a new section for the ${branch.name} branch.`}
          </DialogDescription>
        </DialogHeader>
        <SectionForm section={editingSection} onSave={handleSaveSection} onCancel={() => setIsFormOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default SectionManagement;