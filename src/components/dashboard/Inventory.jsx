import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, Edit, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';

const Inventory = ({ user }) => {
  const [inventory, setInventory] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', quantity: '', minStock: '', unit: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user?.branchId) return;
      setLoading(true);
      try {
        const res = await api.inventory.list({ branchId: user.branchId });
        // Map API shape -> UI shape
        const mapped = res.map((row) => ({
          id: row.productId,
          name: row.product?.name || 'Product',
          quantity: row.qtyOnHand,
          minStock: row.minLevel ?? 0,
          unit: 'unit',
        }));
        setInventory(mapped);
      } catch (err) {
        toast({ title: 'Failed to load inventory', description: String(err?.message || err), variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.branchId]);

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.quantity) {
      toast({ title: 'Please provide at least a name and quantity', variant: 'destructive' });
      return;
    }
    if (!user?.branchId) {
      toast({ title: 'Missing branch', description: 'User branch is not set', variant: 'destructive' });
      return;
    }
    try {
      setLoading(true);
      // Create product with zero pricing for now; can be edited later
      const sku = `${newItem.name}-${Date.now()}`.replace(/\s+/g, '-').toUpperCase();
      const product = await api.products.create({
        name: newItem.name,
        sku,
        category: newItem.unit || undefined,
        price: '0.00',
        taxRate: '0.00',
        branchId: user.branchId,
      });
      // Seed stock by delta
      const qty = parseInt(newItem.quantity, 10) || 0;
      if (qty > 0) {
        await api.inventory.adjust(product.id, user.branchId, qty);
      }
      // Reload
      const res = await api.inventory.list({ branchId: user.branchId });
      const mapped = res.map((row) => ({
        id: row.productId,
        name: row.product?.name || 'Product',
        quantity: row.qtyOnHand,
        minStock: row.minLevel ?? 0,
        unit: 'unit',
      }));
      setInventory(mapped);
      setNewItem({ name: '', quantity: '', minStock: '', unit: '' });
      setShowAddForm(false);
      toast({ title: 'Item added successfully! ✅' });
    } catch (err) {
      toast({ title: 'Failed to add item', description: String(err?.message || err), variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (id, delta) => {
    if (!user?.branchId) return;
    try {
      await api.inventory.adjust(id, user.branchId, delta);
      setInventory(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item));
    } catch (err) {
      toast({ title: 'Stock update failed', description: String(err?.message || err), variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text mb-2">Inventory Management</h2>
          <p className="text-gray-600">Track and manage your stock levels</p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </Button>
      </div>

      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glass-effect border-2 border-white/30">
            <CardHeader>
              <CardTitle className="gradient-text">Add New Item</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Item name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Minimum stock"
                  value={newItem.minStock}
                  onChange={(e) => setNewItem({ ...newItem, minStock: e.target.value })}
                />
                <Input
                  placeholder="Unit (kg, liters, etc.)"
                  value={newItem.unit}
                  onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                />
              </div>
              <div className="flex gap-3 mt-4">
                <Button onClick={handleAddItem} className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600">
                  Add Item
                </Button>
                <Button onClick={() => setShowAddForm(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {loading && <p>Loading...</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inventory.map((item) => {
          const isLowStock = item.quantity <= item.minStock;
          
          return (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Card className={`glass-effect border-2 ${isLowStock ? 'border-red-300' : 'border-white/30'}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${isLowStock ? 'from-red-500 to-orange-600' : 'from-purple-500 to-pink-600'} flex items-center justify-center shadow-lg`}>
                        <Package className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <p className="text-xs text-gray-500">{item.unit}</p>
                      </div>
                    </div>
                    {isLowStock && (
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Current Stock</p>
                      <p className="text-2xl font-bold gradient-text">{item.quantity} {item.unit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Min Stock: {item.minStock} {item.unit}</p>
                      {isLowStock && (
                        <p className="text-xs text-red-600 font-semibold mt-1">⚠️ Low stock alert!</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => updateStock(item.id, -1)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        -1
                      </Button>
                      <Button
                        onClick={() => updateStock(item.id, 1)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        +1
                      </Button>
                      <Button
                        onClick={() => toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" })}
                        variant="outline"
                        size="sm"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
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

export default Inventory;