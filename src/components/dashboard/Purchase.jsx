import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, FilePlus, History, Plus, MoreVertical, Edit, Trash2, Search, Package, Calendar, Hash, User, Mail, Phone, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Purchase = () => {
    const [activeTab, setActiveTab] = useState('suppliers');

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold gradient-text mb-2">Purchase Management</h2>
                <p className="text-muted-foreground">Manage suppliers, create purchase orders, and track your purchase history.</p>
            </div>

            <div className="flex space-x-2 border-b">
                <TabButton icon={Truck} label="Manage Suppliers" isActive={activeTab === 'suppliers'} onClick={() => setActiveTab('suppliers')} />
                <TabButton icon={FilePlus} label="Create PO" isActive={activeTab === 'create-po'} onClick={() => setActiveTab('create-po')} />
                <TabButton icon={History} label="Purchase History" isActive={activeTab === 'history'} onClick={() => setActiveTab('history')} />
            </div>

            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {activeTab === 'suppliers' && <ManageSuppliers />}
                {activeTab === 'create-po' && <CreatePO />}
                {activeTab === 'history' && <PurchaseHistory />}
            </motion.div>
        </div>
    );
};

const TabButton = ({ icon: Icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            isActive 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:bg-muted'
        }`}
    >
        <Icon className="w-4 h-4" />
        {label}
    </button>
);

const ManageSuppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);

    useEffect(() => {
        const storedSuppliers = JSON.parse(localStorage.getItem('loungeSuppliers')) || [];
        setSuppliers(storedSuppliers);
    }, []);

    const handleSaveSupplier = (supplierData) => {
        let updatedSuppliers;
        if (editingSupplier) {
            updatedSuppliers = suppliers.map(s => s.id === editingSupplier.id ? { ...s, ...supplierData } : s);
        } else {
            updatedSuppliers = [...suppliers, { id: Date.now().toString(), ...supplierData }];
        }
        setSuppliers(updatedSuppliers);
        localStorage.setItem('loungeSuppliers', JSON.stringify(updatedSuppliers));
        toast({ title: `Supplier ${editingSupplier ? 'updated' : 'saved'} successfully!` });
        setIsFormOpen(false);
        setEditingSupplier(null);
    };

    const handleDeleteSupplier = (id) => {
        const updatedSuppliers = suppliers.filter(s => s.id !== id);
        setSuppliers(updatedSuppliers);
        localStorage.setItem('loungeSuppliers', JSON.stringify(updatedSuppliers));
        toast({ title: 'Supplier deleted.', variant: 'destructive' });
    };

    return (
        <Card className="glass-effect">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Suppliers</CardTitle>
                    <CardDescription>Add, edit, or remove your product suppliers.</CardDescription>
                </div>
                <Button onClick={() => { setEditingSupplier(null); setIsFormOpen(true); }}>
                    <Plus className="w-4 h-4 mr-2" /> Add Supplier
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {suppliers.length > 0 ? suppliers.map(supplier => (
                        <div key={supplier.id} className="flex items-center justify-between p-3 rounded-lg bg-background hover:bg-muted">
                            <div>
                                <p className="font-semibold">{supplier.name}</p>
                                <p className="text-sm text-muted-foreground">{supplier.email}</p>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onSelect={() => { setEditingSupplier(supplier); setIsFormOpen(true); }}>
                                        <Edit className="w-4 h-4 mr-2" /> Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => handleDeleteSupplier(supplier.id)} className="text-destructive">
                                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )) : (
                        <p className="text-center text-muted-foreground py-8">No suppliers added yet.</p>
                    )}
                </div>
            </CardContent>
            <SupplierForm 
                isOpen={isFormOpen} 
                onOpenChange={setIsFormOpen} 
                onSave={handleSaveSupplier} 
                supplier={editingSupplier} 
            />
        </Card>
    );
};

const SupplierForm = ({ isOpen, onOpenChange, onSave, supplier }) => {
    const [formData, setFormData] = useState({ name: '', contact: '', email: '', phone: '', address: '' });

    useEffect(() => {
        if (supplier) {
            setFormData(supplier);
        } else {
            setFormData({ name: '', contact: '', email: '', phone: '', address: '' });
        }
    }, [supplier, isOpen]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{supplier ? 'Edit' : 'Add'} Supplier</DialogTitle>
                    <DialogDescription>Fill in the details for the supplier.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <FormInput id="name" label="Supplier Name" value={formData.name} onChange={handleChange} icon={Truck} required />
                    <FormInput id="contact" label="Contact Person" value={formData.contact} onChange={handleChange} icon={User} />
                    <FormInput id="email" label="Email" type="email" value={formData.email} onChange={handleChange} icon={Mail} required />
                    <FormInput id="phone" label="Phone" type="tel" value={formData.phone} onChange={handleChange} icon={Phone} />
                    <FormInput id="address" label="Address" value={formData.address} onChange={handleChange} icon={MapPin} />
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit">Save Supplier</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const FormInput = ({ id, label, icon: Icon, ...props }) => (
    <div className="space-y-2">
        <Label htmlFor={id}>{label}</Label>
        <div className="relative">
            {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />}
            <Input id={id} className={Icon ? "pl-9" : ""} {...props} />
        </div>
    </div>
);

const CreatePO = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [items, setItems] = useState([{ name: '', quantity: 1, price: 0 }]);

    useEffect(() => {
        const storedSuppliers = JSON.parse(localStorage.getItem('loungeSuppliers')) || [];
        setSuppliers(storedSuppliers);
    }, []);

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const addItem = () => setItems([...items, { name: '', quantity: 1, price: 0 }]);
    const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

    const total = items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.price)), 0);

    const handleCreatePO = (e) => {
        e.preventDefault();
        const poData = {
            id: `PO-${Date.now()}`,
            supplier: e.target.supplier.value,
            orderDate: new Date().toISOString(),
            items,
            total,
            status: 'Pending'
        };
        const existingPOs = JSON.parse(localStorage.getItem('loungePOs')) || [];
        localStorage.setItem('loungePOs', JSON.stringify([...existingPOs, poData]));
        toast({ title: 'Purchase Order Created!', description: `PO #${poData.id} has been saved.` });
        e.target.reset();
        setItems([{ name: '', quantity: 1, price: 0 }]);
    };

    return (
        <Card className="glass-effect">
            <CardHeader>
                <CardTitle>Create Purchase Order</CardTitle>
                <CardDescription>Fill out the form to create a new PO.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleCreatePO} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="supplier">Supplier</Label>
                            <Select name="supplier" required>
                                <SelectTrigger id="supplier">
                                    <SelectValue placeholder="Select a supplier" />
                                </SelectTrigger>
                                <SelectContent>
                                    {suppliers.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <FormInput id="orderDate" label="Order Date" value={new Date().toLocaleDateString()} icon={Calendar} readOnly />
                    </div>
                    
                    <div className="space-y-4">
                        <Label>Items</Label>
                        {items.map((item, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 rounded-md border">
                                <Input placeholder="Item Name" value={item.name} onChange={e => handleItemChange(index, 'name', e.target.value)} required />
                                <Input type="number" placeholder="Qty" min="1" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} className="w-24" required />
                                <Input type="number" placeholder="Price" min="0" step="0.01" value={item.price} onChange={e => handleItemChange(index, 'price', e.target.value)} className="w-28" required />
                                <Button type="button" variant="destructive" size="icon" onClick={() => removeItem(index)}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" onClick={addItem}><Plus className="w-4 h-4 mr-2" /> Add Item</Button>
                    </div>

                    <div className="text-right">
                        <p className="text-lg font-bold">Total: ${total.toFixed(2)}</p>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit">Create PO</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

const PurchaseHistory = () => {
    const [purchaseOrders, setPurchaseOrders] = useState([]);

    useEffect(() => {
        const storedPOs = JSON.parse(localStorage.getItem('loungePOs')) || [];
        setPurchaseOrders(storedPOs.reverse());
    }, []);

    return (
        <Card className="glass-effect">
            <CardHeader>
                <CardTitle>Purchase History</CardTitle>
                <CardDescription>View all past purchase orders.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {purchaseOrders.length > 0 ? purchaseOrders.map(po => (
                        <div key={po.id} className="p-4 rounded-lg border bg-background">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-primary">{po.id}</p>
                                    <p className="text-sm text-muted-foreground">Supplier: {po.supplier}</p>
                                    <p className="text-xs text-muted-foreground">Date: {new Date(po.orderDate).toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">${po.total.toFixed(2)}</p>
                                    <span className={`px-2 py-1 text-xs rounded-full ${po.status === 'Pending' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>{po.status}</span>
                                </div>
                            </div>
                            <div className="mt-4 pt-2 border-t">
                                <p className="text-sm font-semibold mb-2">Items:</p>
                                <ul className="list-disc list-inside text-sm space-y-1">
                                    {po.items.map((item, index) => (
                                        <li key={index}>{item.quantity} x {item.name} @ ${Number(item.price).toFixed(2)} each</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )) : (
                        <p className="text-center text-muted-foreground py-8">No purchase orders found.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default Purchase;