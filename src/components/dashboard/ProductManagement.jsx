import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, PlusCircle, Edit, Trash2, Repeat, ArrowRight, Package, Box, Warehouse, Calendar, Plus, SlidersHorizontal, ArrowUp, ArrowDown, FileText, Award, Eye, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from '@/components/ui/switch';


const initialProducts = [
  { id: 1, name: 'Espresso', category: 'Hot Drinks', brand: 'Lavazza', station: 'bar', is_kitchen_item: false, is_bar_item: true },
  { id: 2, name: 'Club Sandwich', category: 'Sandwiches', brand: 'Generic', station: 'kitchen', is_kitchen_item: true, is_bar_item: false },
  { id: 3, name: 'Mojito', category: 'Cold Drinks', brand: 'Generic', station: 'bar', is_kitchen_item: false, is_bar_item: true },
  { id: 4, name: 'French Fries', category: 'Snacks', brand: 'Generic', station: 'kitchen', is_kitchen_item: true, is_bar_item: false },
];

const initialStockLevels = {
  1: { 'Main Store': 100, 'Bar Store': 20 },
  2: { 'Main Kitchen': 50 },
  3: { 'Main Store': 75 },
  4: { 'Main Kitchen': 200 },
};

const initialSectionPrices = {
    1: { 'Main Bar': 2.50, 'Rooftop Bar': 3.00 },
    2: { 'Main Bar': 8.00, 'Lounge Bar': 9.50 },
    3: { 'Main Bar': 7.00, 'Rooftop Bar': 9.00, 'Club Section': 10.00 },
    4: { 'Main Bar': 4.50, 'Lounge Bar': 5.00 },
};

const ProductManagement = ({ user }) => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [stockLevels, setStockLevels] = useState({});
  const [adjustments, setAdjustments] = useState([]);
  const [sectionPrices, setSectionPrices] = useState({});
  const [allowOverselling, setAllowOverselling] = useState(false);

  useEffect(() => {
    const savedProducts = localStorage.getItem('loungeProducts');
    const savedStockLevels = localStorage.getItem('loungeStockLevels');
    const savedAdjustments = localStorage.getItem('loungeStockAdjustments');
    const savedSectionPrices = localStorage.getItem('loungeSectionPrices');
    const savedOverselling = localStorage.getItem('loungeAllowOverselling');

    const initialProd = savedProducts ? JSON.parse(savedProducts) : initialProducts;
    const initialStock = savedStockLevels ? JSON.parse(savedStockLevels) : initialStockLevels;
    const initialAdjustments = savedAdjustments ? JSON.parse(savedAdjustments) : [];
    const initialPrices = savedSectionPrices ? JSON.parse(savedSectionPrices) : initialSectionPrices;

    setProducts(initialProd);
    setStockLevels(initialStock);
    setAdjustments(initialAdjustments);
    setSectionPrices(initialPrices);
    setAllowOverselling(savedOverselling === 'true');

    if (!savedProducts) localStorage.setItem('loungeProducts', JSON.stringify(initialProducts));
    if (!savedStockLevels) localStorage.setItem('loungeStockLevels', JSON.stringify(initialStockLevels));
    if (!savedAdjustments) localStorage.setItem('loungeStockAdjustments', JSON.stringify([]));
    if (!savedSectionPrices) localStorage.setItem('loungeSectionPrices', JSON.stringify(initialSectionPrices));
    if (!savedOverselling) localStorage.setItem('loungeAllowOverselling', 'false');
  }, []);

  const updateProducts = (newProducts) => {
    setProducts(newProducts);
    localStorage.setItem('loungeProducts', JSON.stringify(newProducts));
  };

  const updateStockLevels = (newStockLevels) => {
    setStockLevels(newStockLevels);
    localStorage.setItem('loungeStockLevels', JSON.stringify(newStockLevels));
  };

  const updateSectionPrices = (newPrices) => {
    setSectionPrices(newPrices);
    localStorage.setItem('loungeSectionPrices', JSON.stringify(newPrices));
  };

  const addAdjustment = (newAdjustment) => {
    const currentAdjustments = JSON.parse(localStorage.getItem('loungeStockAdjustments')) || [];
    const updatedAdjustments = [newAdjustment, ...currentAdjustments];
    setAdjustments(updatedAdjustments);
    localStorage.setItem('loungeStockAdjustments', JSON.stringify(updatedAdjustments));
  };
  
  const handleToggleOverselling = (value) => {
    const isAllowed = value === 'true';
    setAllowOverselling(isAllowed);
    localStorage.setItem('loungeAllowOverselling', isAllowed ? 'true' : 'false');
    toast({
        title: `Overselling ${isAllowed ? 'Enabled' : 'Disabled'}`,
        description: `You can now ${isAllowed ? '' : 'no longer '}sell products that are out of stock.`,
    });
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-start">
            <div>
                <h2 className="text-3xl font-bold gradient-text mb-2">Product & Stock</h2>
                <p className="text-muted-foreground">Manage all your products and stock movements.</p>
            </div>
            <Card className="p-3 glass-effect flex items-center gap-4">
                <Label htmlFor="overselling-toggle" className="font-semibold">Allow Overselling</Label>
                <RadioGroup 
                  defaultValue={allowOverselling ? 'true' : 'false'} 
                  value={allowOverselling ? 'true' : 'false'} 
                  onValueChange={handleToggleOverselling} 
                  className="flex"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="overselling-yes" />
                    <Label htmlFor="overselling-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="overselling-no" />
                    <Label htmlFor="overselling-no">No</Label>
                  </div>
                </RadioGroup>
            </Card>
        </div>


      <div className="flex space-x-2 border-b">
        <TabButton icon={ShoppingBag} label="Products" isActive={activeTab === 'products'} onClick={() => setActiveTab('products')} />
        <TabButton icon={DollarSign} label="Section Pricing" isActive={activeTab === 'pricing'} onClick={() => setActiveTab('pricing')} />
        <TabButton icon={Repeat} label="Stock Transfer" isActive={activeTab === 'transfer'} onClick={() => setActiveTab('transfer')} />
        <TabButton icon={SlidersHorizontal} label="Stock Adjustment" isActive={activeTab === 'adjustment'} onClick={() => setActiveTab('adjustment')} />
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'products' && <ProductList products={products} setProducts={updateProducts} stockLevels={stockLevels} setStockLevels={updateStockLevels} user={user} addAdjustment={addAdjustment} sectionPrices={sectionPrices} />}
        {activeTab === 'pricing' && <SectionPricing products={products} sectionPrices={sectionPrices} updateSectionPrices={updateSectionPrices} user={user} />}
        {activeTab === 'transfer' && <StockTransfer user={user} products={products} stockLevels={stockLevels} updateStockLevels={updateStockLevels} />}
        {activeTab === 'adjustment' && <StockAdjustment products={products} stockLevels={stockLevels} updateStockLevels={updateStockLevels} adjustments={adjustments} addAdjustment={addAdjustment} />}
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


const ProductList = ({ products, setProducts, stockLevels, setStockLevels, user, addAdjustment, sectionPrices }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddStockModalOpen, setIsAddStockModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [stockingProduct, setStockingProduct] = useState(null);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsAddModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsAddModalOpen(true);
  };

  const handleViewProduct = (product) => {
    setViewingProduct(product);
    setIsViewModalOpen(true);
  };

  const handleAddStock = (product) => {
    setStockingProduct(product);
    setIsAddStockModalOpen(true);
  };

  const handleDeleteProduct = (productId) => {
    const updatedProducts = products.filter(p => p.id !== productId);
    setProducts(updatedProducts);
    
    const newStockLevels = { ...stockLevels };
    delete newStockLevels[productId];
    setStockLevels(newStockLevels);

    toast({ title: 'Product Deleted', description: 'The product and its stock have been removed.' });
  };

  const handleSaveProduct = (productData, initialStock, branchSection) => {
    if (editingProduct) {
      const updatedProducts = products.map(p => p.id === editingProduct.id ? { ...p, ...productData } : p);
      setProducts(updatedProducts);
      toast({ title: 'Product Updated', description: 'Product details have been saved.' });
    } else {
      const newId = Date.now();
      const newProduct = { id: newId, ...productData };
      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);

      const newStockLevels = { ...stockLevels, [newId]: { [branchSection]: initialStock } };
      setStockLevels(newStockLevels);

      toast({ title: 'Product Added', description: 'A new product has been created.' });
    }
    setIsAddModalOpen(false);
  };

  const getStationColor = (station) => {
    const colors = {
      'bar': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
      'kitchen': 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
      'neutral': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };
    return colors[station] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  const getTotalStock = (productId) => {
    const productStock = stockLevels[productId] || {};
    return Object.values(productStock).reduce((sum, qty) => sum + qty, 0);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Product List</h3>
          <Button onClick={handleAddProduct} className="gap-2">
            <PlusCircle className="w-4 h-4" />
            Add Product
          </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="glass-effect border-2 border-white/30 dark:border-slate-700/50 flex flex-col h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${getStationColor(product.station)}`}>
                    {product.station?.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                    <p className="flex items-center gap-1.5"><Package className="w-3.5 h-3.5" /> {product.category}</p>
                    <p className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5" /> {product.brand}</p>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-center text-gray-800 dark:text-gray-200">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                    <Warehouse className="w-4 h-4" /> Total Stock
                  </span>
                  <span className="text-lg font-bold">{getTotalStock(product.id)}</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-4 mt-4">
                  <Button onClick={() => handleViewProduct(product)} variant="outline" size="sm" className="flex-1"><Eye className="w-3 h-3 mr-1.5" />View</Button>
                  <Button onClick={() => handleAddStock(product)} variant="outline" size="sm" className="flex-1"><Plus className="w-3 h-3 mr-1.5" />Add Stock</Button>
                  <Button onClick={() => handleEditProduct(product)} variant="outline" size="sm" className="flex-1"><Edit className="w-3 h-3 mr-1.5" />Edit</Button>
                  <Button onClick={() => handleDeleteProduct(product.id)} variant="destructive" size="sm" className="flex-1"><Trash2 className="w-3 h-3 mr-1.5" />Delete</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <ProductFormModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleSaveProduct} product={editingProduct} user={user} />
      <ProductViewModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} product={viewingProduct} stockLevels={stockLevels} sectionPrices={sectionPrices} />
      <AddStockModal isOpen={isAddStockModalOpen} onClose={() => setIsAddStockModalOpen(false)} product={stockingProduct} stockLevels={stockLevels} updateStockLevels={setStockLevels} addAdjustment={addAdjustment} user={user} />
    </>
  );
};

const ProductFormModal = ({ isOpen, onClose, onSave, product, user }) => {
  const [formData, setFormData] = useState({ name: '', category: '', brand: '', stock: '', station: '', branchSection: '' });
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [allBranchSections, setAllBranchSections] = useState([]);
  const [availableSections, setAvailableSections] = useState([]);

  useEffect(() => {
    if (isOpen && user && user.branchId) {
      const savedCategories = JSON.parse(localStorage.getItem('loungeCategories')) || [];
      const savedBrands = JSON.parse(localStorage.getItem('loungeBrands')) || [];
      const allBranches = JSON.parse(localStorage.getItem('loungeBranches')) || [];
      
      const currentBranch = allBranches.find(b => b.id.toString() === user.branchId.toString());
      const sections = currentBranch ? currentBranch.sections || [] : [];
      setAllBranchSections(sections);

      setCategories(savedCategories);
      setBrands(savedBrands);

      if (product) {
        setFormData({ 
          name: product.name || '', 
          category: product.category || '', 
          brand: product.brand || '', 
          stock: '', // Not editable here
          station: product.station || '',
          branchSection: '' // Not editable here
        });
      } else {
        setFormData({ name: '', category: '', brand: '', stock: '', station: '', branchSection: '' });
      }
    }
  }, [product, isOpen, user]);

  useEffect(() => {
    let filteredSections = [];
    if (formData.station === 'bar') {
      filteredSections = allBranchSections.filter(sec => sec.name.toLowerCase().includes('store'));
    } else if (formData.station === 'kitchen') {
      filteredSections = allBranchSections.filter(sec => sec.name.toLowerCase().includes('kitchen'));
    } else if (formData.station === 'neutral') {
      filteredSections = allBranchSections;
    }
    setAvailableSections(filteredSections);

    if (formData.branchSection && !filteredSections.find(s => s.name === formData.branchSection)) {
        handleSelectChange('branchSection', '');
    }
  }, [formData.station, allBranchSections]);


  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleStationChange = (station) => {
    setFormData(prev => ({ ...prev, station, branchSection: '' }));
  };

  const handleSubmit = () => {
    const { stock, branchSection, ...productData } = formData;
    
    if (!product) { // Only for new products
        if (!formData.station) {
            toast({ title: "Station Required", description: "Please select a station (Bar, Kitchen, or Neutral).", variant: "destructive" });
            return;
        }
        if (!branchSection) {
          toast({
            title: "Branch Section Required",
            description: `Please select a section for the product.`,
            variant: "destructive",
          });
          return;
        }
    }

    const processedData = {
        ...productData,
        is_kitchen_item: formData.station === 'kitchen',
        is_bar_item: formData.station === 'bar',
    };
    onSave(processedData, parseInt(stock, 10) || 0, branchSection);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            {product ? 'Update the details for this product.' : 'Fill in the details for the new product.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" value={formData.name} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Category</Label>
            <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                    {categories.map(cat => <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>)}
                </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="brand" className="text-right">Brand</Label>
            <Select value={formData.brand} onValueChange={(value) => handleSelectChange('brand', value)}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a brand" />
                </SelectTrigger>
                <SelectContent>
                    {brands.map(br => <SelectItem key={br.id} value={br.name}>{br.name}</SelectItem>)}
                </SelectContent>
            </Select>
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="station" className="text-right">Station</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="col-span-3 justify-start capitalize" disabled={!!product}>
                  {formData.station ? formData.station : 'Select station'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[--radix-dropdown-menu-trigger-width]">
                {['bar', 'kitchen', 'neutral'].map(station => (
                   <DropdownMenuItem key={station} onSelect={() => handleStationChange(station)} className="capitalize">
                     {station}
                   </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {!product && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="branchSection" className="text-right">Branch Section</Label>
                <Select value={formData.branchSection} onValueChange={(value) => handleSelectChange('branchSection', value)} disabled={!formData.station}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a section" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableSections.map(sec => <SelectItem key={sec.id} value={sec.name}>{sec.name}</SelectItem>)}
                    </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stock" className="text-right">Initial Stock</Label>
                <Input id="stock" type="number" value={formData.stock} onChange={handleChange} className="col-span-3" />
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Save Product</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ProductViewModal = ({ isOpen, onClose, product, stockLevels, sectionPrices }) => {
  if (!product) return null;

  const productStock = stockLevels[product.id] || {};
  const totalStock = Object.values(productStock).reduce((sum, qty) => sum + qty, 0);
  const prices = sectionPrices[product.id] || {};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>
            Category: {product.category} | Brand: {product.brand}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 grid grid-cols-1 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Stock Distribution</h3>
            <div className="space-y-2 rounded-lg border p-4">
              {Object.keys(productStock).length > 0 ? (
                Object.entries(productStock).map(([section, qty]) => (
                  <div key={section} className="flex justify-between items-center">
                    <span className="text-sm font-medium flex items-center gap-2"><Warehouse className="w-4 h-4 text-muted-foreground" /> {section}</span>
                    <span className="font-bold">{qty}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center">No stock available in any section.</p>
              )}
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t font-bold">
              <span>Total Stock</span>
              <span>{totalStock}</span>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Section Prices</h3>
            <div className="space-y-2 rounded-lg border p-4">
              {Object.keys(prices).length > 0 ? (
                Object.entries(prices).map(([section, price]) => (
                  <div key={section} className="flex justify-between items-center">
                    <span className="text-sm font-medium flex items-center gap-2"><DollarSign className="w-4 h-4 text-muted-foreground" /> {section}</span>
                    <span className="font-bold">${price.toFixed(2)}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center">No prices set for any section.</p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const AddStockModal = ({ isOpen, onClose, product, stockLevels, updateStockLevels, addAdjustment, user }) => {
  const [section, setSection] = useState('');
  const [quantity, setQuantity] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
  const [branchSections, setBranchSections] = useState([]);

  useEffect(() => {
    if (isOpen && user && user.branchId) {
      const allBranches = JSON.parse(localStorage.getItem('loungeBranches')) || [];
      const currentBranch = allBranches.find(b => b.id.toString() === user.branchId.toString());
      setBranchSections(currentBranch ? currentBranch.sections || [] : []);
    }
    if (!isOpen) {
      setSection('');
      setQuantity('');
      setDate(new Date().toISOString().split('T')[0]);
      setTime(new Date().toTimeString().slice(0, 5));
    }
  }, [isOpen, user]);

  if (!product) return null;

  const handleSubmit = () => {
    const qty = Number(quantity);
    if (!section || !qty || qty <= 0) {
      toast({ title: 'Invalid Input', description: 'Please select a section and enter a valid quantity.', variant: 'destructive' });
      return;
    }

    const newStockLevels = JSON.parse(JSON.stringify(stockLevels));
    const currentStock = newStockLevels[product.id]?.[section] || 0;
    const newStock = currentStock + qty;

    if (!newStockLevels[product.id]) newStockLevels[product.id] = {};
    newStockLevels[product.id][section] = newStock;
    updateStockLevels(newStockLevels);

    const newAdjustment = {
      id: `SA-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      section,
      type: 'add',
      quantity: qty,
      reason: 'Stock Purchase/Receiving',
      date: `${date}T${time}:00`,
      previousStock: currentStock,
      newStock,
    };

    addAdjustment(newAdjustment);
    toast({ title: 'Stock Added!', description: `${qty} units of ${product.name} added to ${section}.` });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Stock to {product.name}</DialogTitle>
          <DialogDescription>Increase the stock quantity for this product in a specific section.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Section</Label>
            <Select value={section} onValueChange={setSection}>
              <SelectTrigger><Warehouse className="w-4 h-4 mr-2" /><SelectValue placeholder="Select a section" /></SelectTrigger>
              <SelectContent>{branchSections.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity to Add</Label>
            <Input id="quantity" type="number" placeholder="e.g., 50" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input id="time" type="time" value={time} onChange={e => setTime(e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Add Stock</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const SectionPricing = ({ products, sectionPrices, updateSectionPrices, user }) => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [prices, setPrices] = useState({});
    const [sellingSections, setSellingSections] = useState([]);

    useEffect(() => {
        if (user && user.branchId) {
            const allBranches = JSON.parse(localStorage.getItem('loungeBranches')) || [];
            const currentBranch = allBranches.find(b => b.id.toString() === user.branchId.toString());
            if (currentBranch && currentBranch.sections) {
                const sections = currentBranch.sections.filter(s => {
                    const nameLower = s.name.toLowerCase();
                    return !nameLower.includes('store') && !nameLower.includes('kitchen');
                });
                setSellingSections(sections);
            }
        }
    }, [user]);

    useEffect(() => {
        if (selectedProduct) {
            const productPrices = sectionPrices[selectedProduct.id] || {};
            const initialPrices = {};
            sellingSections.forEach(section => {
                initialPrices[section.name] = productPrices[section.name] || '';
            });
            setPrices(initialPrices);
        } else {
            setPrices({});
        }
    }, [selectedProduct, sectionPrices, sellingSections]);

    const handlePriceChange = (sectionName, value) => {
        setPrices(prev => ({ ...prev, [sectionName]: value }));
    };

    const handleSavePrices = () => {
        if (!selectedProduct) return;

        const newSectionPrices = { ...sectionPrices };
        if (!newSectionPrices[selectedProduct.id]) {
            newSectionPrices[selectedProduct.id] = {};
        }

        Object.entries(prices).forEach(([sectionName, price]) => {
            const priceValue = parseFloat(price);
            if (!isNaN(priceValue) && priceValue >= 0) {
                newSectionPrices[selectedProduct.id][sectionName] = priceValue;
            } else {
                delete newSectionPrices[selectedProduct.id][sectionName];
            }
        });

        updateSectionPrices(newSectionPrices);
        toast({ title: 'Prices Updated', description: `Prices for ${selectedProduct.name} have been saved.` });
    };

    return (
        <Card className="glass-effect">
            <CardHeader>
                <CardTitle>Section-Based Product Pricing</CardTitle>
                <CardDescription>Set different prices for products in each selling section.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                    <Label className="w-24">Product</Label>
                    <Select onValueChange={value => setSelectedProduct(products.find(p => p.id.toString() === value))}>
                        <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select a product to set prices" />
                        </SelectTrigger>
                        <SelectContent>
                            {products.map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                {selectedProduct && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 pt-4 border-t">
                        <h4 className="font-semibold">Set prices for "{selectedProduct.name}"</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {sellingSections.map(section => (
                                <div key={section.id} className="flex items-center gap-2">
                                    <Label htmlFor={`price-${section.id}`} className="w-32 truncate">{section.name}</Label>
                                    <div className="relative flex-1">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id={`price-${section.id}`}
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            placeholder="e.g., 12.50"
                                            value={prices[section.name] || ''}
                                            onChange={e => handlePriceChange(section.name, e.target.value)}
                                            className="pl-8"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={handleSavePrices}>Save Prices</Button>
                        </div>
                    </motion.div>
                )}
            </CardContent>
        </Card>
    );
};

const StockTransfer = ({ user, products, stockLevels, updateStockLevels }) => {
    const [transfers, setTransfers] = useState([]);
    
    useEffect(() => {
        const storedTransfers = JSON.parse(localStorage.getItem('loungeStockTransfers')) || [];
        setTransfers(storedTransfers.reverse());
    }, []);

    const addTransfer = (newTransfer) => {
        const currentTransfers = JSON.parse(localStorage.getItem('loungeStockTransfers')) || [];
        const updatedTransfers = [newTransfer, ...currentTransfers];
        setTransfers(updatedTransfers.reverse());
        localStorage.setItem('loungeStockTransfers', JSON.stringify(updatedTransfers));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
                <CreateStockTransferForm onTransferCreated={addTransfer} user={user} products={products} stockLevels={stockLevels} updateStockLevels={updateStockLevels} />
            </div>
            <div className="lg:col-span-2">
                <TransferHistory transfers={transfers} />
            </div>
        </div>
    );
};

const CreateStockTransferForm = ({ onTransferCreated, user, products, stockLevels, updateStockLevels }) => {
    const [branchSections, setBranchSections] = useState([]);
    const [items, setItems] = useState([{ productId: '', quantity: '' }]);
    const [fromSection, setFromSection] = useState('');
    const [toSection, setToSection] = useState('');

    useEffect(() => {
        if (user && user.branchId) {
            const allBranches = JSON.parse(localStorage.getItem('loungeBranches')) || [];
            const currentBranch = allBranches.find(b => b.id.toString() === user.branchId.toString());
            const sections = currentBranch ? currentBranch.sections || [] : [];
            setBranchSections(sections);
        }
    }, [user]);

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const addItem = () => setItems([...items, { productId: '', quantity: '' }]);
    const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!fromSection || !toSection || fromSection === toSection) {
            toast({ title: 'Invalid Sections', description: 'Please select valid and different from/to sections.', variant: 'destructive' });
            return;
        }

        const validItems = items.filter(item => item.productId && Number(item.quantity) > 0);
        if (validItems.length === 0) {
            toast({ title: 'No Items', description: 'Please add at least one valid item to transfer.', variant: 'destructive' });
            return;
        }

        const newStockLevels = JSON.parse(JSON.stringify(stockLevels));
        let isTransferValid = true;

        validItems.forEach(item => {
            const { productId, quantity } = item;
            const qty = Number(quantity);
            const currentStock = newStockLevels[productId]?.[fromSection] || 0;

            if (currentStock < qty) {
                const productName = products.find(p => p.id.toString() === productId)?.name || 'Product';
                toast({ title: 'Insufficient Stock', description: `Not enough ${productName} in ${fromSection}. Available: ${currentStock}, Tried to transfer: ${qty}`, variant: 'destructive' });
                isTransferValid = false;
            }
        });

        if (!isTransferValid) return;

        validItems.forEach(item => {
            const { productId, quantity } = item;
            const qty = Number(quantity);
            
            newStockLevels[productId][fromSection] -= qty;
            if (newStockLevels[productId][fromSection] === 0) {
                delete newStockLevels[productId][fromSection];
            }

            newStockLevels[productId][toSection] = (newStockLevels[productId][toSection] || 0) + qty;
        });

        updateStockLevels(newStockLevels);
        
        const newTransfer = {
            id: `ST-${Date.now()}`,
            from: fromSection,
            to: toSection,
            date: new Date().toISOString(),
            items: validItems.map(item => ({...item, name: products.find(p => p.id.toString() === item.productId)?.name})),
            status: 'Completed'
        };

        onTransferCreated(newTransfer);
        toast({ title: 'Stock Transfer Successful!', description: 'Stock levels have been updated.' });
        setItems([{ productId: '', quantity: '' }]);
        setFromSection('');
        setToSection('');
    };

    const getAvailableToSections = () => {
        if (!fromSection) return [];
        
        const fromSectionLower = fromSection.toLowerCase();
        const isStore = (name) => name.toLowerCase().includes('store');
        const isProduction = (name) => name.toLowerCase().includes('kitchen') || name.toLowerCase().includes('bar');
        const isSalesSection = (name) => !isStore(name) && !isProduction(name);

        if (isStore(fromSection) && !fromSectionLower.includes('bar')) {
            // "From" is a main store
            return branchSections.filter(s => isProduction(s.name) && s.name !== fromSection);
        }
        
        if (isProduction(fromSection)) {
             // "From" is a production section (bar or kitchen)
            return branchSections.filter(s => isSalesSection(s.name) && s.name !== fromSection);
        }
        
        if(isSalesSection(fromSection)) {
            // "From" is another sales section
            return branchSections.filter(s => isSalesSection(s.name) && s.name !== fromSection);
        }

        return branchSections.filter(s => s.name !== fromSection);
    };

    const availableToSections = getAvailableToSections();
    const productsInFromSection = fromSection ? products.filter(p => stockLevels[p.id]?.[fromSection] > 0) : [];

    return (
        <Card className="glass-effect">
            <CardHeader>
                <CardTitle>Create Stock Transfer</CardTitle>
                <CardDescription>Move stock between sections in your branch.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex items-center gap-2">
                        <Select value={fromSection} onValueChange={val => { setFromSection(val); setToSection(''); }}>
                            <SelectTrigger><Warehouse className="w-4 h-4 mr-2" /> From</SelectTrigger>
                            <SelectContent>{branchSections.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}</SelectContent>
                        </Select>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        <Select value={toSection} onValueChange={setToSection} disabled={!fromSection}>
                            <SelectTrigger><Box className="w-4 h-4 mr-2" /> To</SelectTrigger>
                            <SelectContent>{availableToSections.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-4">
                        <Label>Items to Transfer</Label>
                        {items.map((item, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 rounded-md border">
                                <Select value={item.productId} onValueChange={value => handleItemChange(index, 'productId', value)} disabled={!fromSection}>
                                    <SelectTrigger className="flex-1"><Package className="w-4 h-4 mr-2" /><SelectValue placeholder="Product" /></SelectTrigger>
                                    <SelectContent>{productsInFromSection.map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.name} (Av: {stockLevels[p.id]?.[fromSection]})</SelectItem>)}</SelectContent>
                                </Select>
                                <Input type="number" placeholder="Qty" min="1" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} className="w-24" required />
                                <Button type="button" variant="destructive" size="icon" onClick={() => removeItem(index)}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" onClick={addItem} disabled={!fromSection}><Plus className="w-4 h-4 mr-2" /> Add Item</Button>
                    </div>

                    <Button type="submit" className="w-full">
                        <Repeat className="w-4 h-4 mr-2" /> Confirm Transfer
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

const TransferHistory = ({ transfers }) => (
    <Card className="glass-effect">
        <CardHeader>
            <CardTitle>Transfer History</CardTitle>
            <CardDescription>Log of all stock movements.</CardDescription>
        </CardHeader>
        <CardContent>
             <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {transfers.length > 0 ? transfers.map(t => (
                    <div key={t.id} className="p-4 rounded-lg border bg-background">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold text-primary">{t.id}</p>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>{t.from}</span>
                                    <ArrowRight className="w-4 h-4" />
                                    <span>{t.to}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    <Calendar className="w-3 h-3 mr-1.5 inline" />
                                    {new Date(t.date).toLocaleString()}
                                </p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full bg-green-200 text-green-800`}>{t.status}</span>
                        </div>
                        <div className="mt-4 pt-2 border-t">
                            <p className="text-sm font-semibold mb-2">Transferred Items:</p>
                            <ul className="list-disc list-inside text-sm space-y-1">
                                {t.items.map((item, index) => (
                                    <li key={index}>{item.quantity} x {item.name || 'Unknown Product'}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )) : (
                    <p className="text-center text-muted-foreground py-8">No stock transfers recorded yet.</p>
                )}
            </div>
        </CardContent>
    </Card>
);

const StockAdjustment = ({ products, stockLevels, updateStockLevels, adjustments, addAdjustment }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
                <CreateStockAdjustmentForm products={products} stockLevels={stockLevels} updateStockLevels={updateStockLevels} onAdjustmentCreated={addAdjustment} />
            </div>
            <div className="lg:col-span-2">
                <AdjustmentHistory adjustments={adjustments} />
            </div>
        </div>
    );
};

const CreateStockAdjustmentForm = ({ products, stockLevels, updateStockLevels, onAdjustmentCreated }) => {
    const [productId, setProductId] = useState('');
    const [section, setSection] = useState('');
    const [type, setType] = useState('add');
    const [quantity, setQuantity] = useState('');
    const [reason, setReason] = useState('');

    const availableSections = productId ? Object.keys(stockLevels[productId] || {}) : [];

    const handleSubmit = (e) => {
        e.preventDefault();
        const qty = Number(quantity);
        if (!productId || !section || !qty || qty <= 0 || !reason) {
            toast({ title: 'Invalid Input', description: 'Please fill all fields correctly.', variant: 'destructive' });
            return;
        }

        const product = products.find(p => p.id.toString() === productId);
        if (!product) {
            toast({ title: 'Product not found', variant: 'destructive' });
            return;
        }
        
        const newStockLevels = JSON.parse(JSON.stringify(stockLevels));
        const currentStock = newStockLevels[productId]?.[section] || 0;
        const newStock = type === 'add' ? currentStock + qty : currentStock - qty;

        if (newStock < 0) {
            toast({ title: 'Insufficient Stock', description: `Cannot remove ${qty}. Only ${currentStock} available in ${section}.`, variant: 'destructive' });
            return;
        }

        if (!newStockLevels[productId]) newStockLevels[productId] = {};
        newStockLevels[productId][section] = newStock;
        updateStockLevels(newStockLevels);

        const newAdjustment = {
            id: `SA-${Date.now()}`,
            productId,
            productName: product.name,
            section,
            type,
            quantity: qty,
            reason,
            date: new Date().toISOString(),
            previousStock: currentStock,
            newStock,
        };

        onAdjustmentCreated(newAdjustment);
        toast({ title: 'Stock Adjusted!', description: `${product.name} stock in ${section} updated to ${newStock}.` });
        setProductId('');
        setSection('');
        setType('add');
        setQuantity('');
        setReason('');
    };

    return (
        <Card className="glass-effect">
            <CardHeader>
                <CardTitle>Add Stock Adjustment</CardTitle>
                <CardDescription>Manually adjust stock levels for a section.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label>Product</Label>
                        <Select value={productId} onValueChange={val => { setProductId(val); setSection(''); }}>
                            <SelectTrigger><Package className="w-4 h-4 mr-2" /><SelectValue placeholder="Select a product" /></SelectTrigger>
                            <SelectContent>{products.map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    
                    <div className="space-y-2">
                        <Label>Section</Label>
                        <Select value={section} onValueChange={setSection} disabled={!productId}>
                            <SelectTrigger><Warehouse className="w-4 h-4 mr-2" /><SelectValue placeholder="Select a section" /></SelectTrigger>
                            <SelectContent>{availableSections.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Adjustment Type</Label>
                        <RadioGroup defaultValue="add" value={type} onValueChange={setType} className="flex gap-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="add" id="add" />
                                <Label htmlFor="add" className="flex items-center gap-2"><ArrowUp className="w-4 h-4 text-green-500" /> Add Stock</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="remove" id="remove" />
                                <Label htmlFor="remove" className="flex items-center gap-2"><ArrowDown className="w-4 h-4 text-red-500" /> Remove Stock</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input id="quantity" type="number" placeholder="e.g., 10" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} required />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="reason">Reason</Label>
                        <Input id="reason" placeholder="e.g., Damaged goods, Stock count correction" value={reason} onChange={e => setReason(e.target.value)} required />
                    </div>

                    <Button type="submit" className="w-full">
                        <SlidersHorizontal className="w-4 h-4 mr-2" /> Submit Adjustment
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

const AdjustmentHistory = ({ adjustments }) => {
    const [displayAdjustments, setDisplayAdjustments] = useState([]);
    useEffect(() => {
        const sorted = [...adjustments].sort((a, b) => new Date(b.date) - new Date(a.date));
        setDisplayAdjustments(sorted);
    }, [adjustments]);

    return (
        <Card className="glass-effect">
            <CardHeader>
                <CardTitle>Adjustment History</CardTitle>
                <CardDescription>Log of all manual stock adjustments.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {displayAdjustments.length > 0 ? displayAdjustments.map(adj => (
                        <div key={adj.id} className="p-4 rounded-lg border bg-background">
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <p className={`font-bold ${adj.type === 'add' ? 'text-green-600' : 'text-red-600'}`}>{adj.productName} <span className="text-sm text-muted-foreground">in {adj.section}</span></p>
                                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                                        <FileText className="w-4 h-4" /> {adj.reason}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        <Calendar className="w-3 h-3 mr-1.5 inline" />
                                        {new Date(adj.date).toLocaleString()}
                                    </p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className={`text-xl font-bold flex items-center gap-1 justify-end ${adj.type === 'add' ? 'text-green-600' : 'text-red-600'}`}>
                                        {adj.type === 'add' ? <Plus className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                                        {adj.quantity}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {adj.previousStock} &rarr; {adj.newStock}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <p className="text-center text-muted-foreground py-8">No stock adjustments recorded yet.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default ProductManagement;