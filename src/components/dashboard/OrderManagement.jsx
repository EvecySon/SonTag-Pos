import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ListOrdered, Clock, CheckCircle, RefreshCw, XCircle, MoreVertical, Eye, Printer, Coins as HandCoins, Undo2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import OrderDetailsModal from '@/components/dashboard/orders/OrderDetailsModal';
import RefundModal from '@/components/dashboard/orders/RefundModal';
import PrintView from '@/components/pos/PrintView';
import Receipt from '@/components/dashboard/orders/Receipt';

const OrderManagement = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [refundingOrder, setRefundingOrder] = useState(null);
  const [printingOrder, setPrintingOrder] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('loungeOrders');
    if (saved) {
      setOrders(JSON.parse(saved));
    } else {
        const initial = [
            { id: '#1234', items: [{name: 'Espresso', quantity: 2, price: 4.50}], total: 9.00, timestamp: new Date().toISOString(), staff: 'Jane Smith', status: 'Paid', paymentMethod: 'Card' },
            { id: '#1233', items: [{name: 'Club Sandwich', quantity: 1, price: 12.00}], total: 12.00, timestamp: new Date(Date.now() - 3600000).toISOString(), staff: 'John Doe', status: 'Paid', paymentMethod: 'Cash' },
            { id: '#1232', items: [{name: 'Latte', quantity: 1, price: 4.25}, {name: 'Croissant', quantity: 1, price: 4.25}], total: 8.50, timestamp: new Date(Date.now() - 7200000).toISOString(), staff: 'Jane Smith', status: 'Paid', paymentMethod: 'Card' },
        ];
        setOrders(initial);
        localStorage.setItem('loungeOrders', JSON.stringify(initial));
    }
  }, []);

  const updateOrders = (newOrders) => {
    setOrders(newOrders);
    localStorage.setItem('loungeOrders', JSON.stringify(newOrders));
  };

  const handleConfirmRefund = (orderId, reason) => {
    const orderToRefund = orders.find(order => order.id === orderId);
    if (!orderToRefund) return;

    // Update inventory
    const savedInventory = localStorage.getItem('loungeInventory');
    if (savedInventory) {
      let inventory = JSON.parse(savedInventory);
      orderToRefund.items.forEach(refundedItem => {
        inventory = inventory.map(inventoryItem => {
          if (inventoryItem.name.toLowerCase() === refundedItem.name.toLowerCase()) {
            return { ...inventoryItem, quantity: inventoryItem.quantity + refundedItem.quantity };
          }
          return inventoryItem;
        });
      });
      localStorage.setItem('loungeInventory', JSON.stringify(inventory));
    }

    // Update order status
    const newOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: 'Refunded', refundReason: reason } : order
    );
    updateOrders(newOrders);
    setRefundingOrder(null);
    toast({
      title: 'Refund Processed',
      description: `Order ${orderId} refunded and stock updated.`,
    });
  };

  const handlePrintReceipt = (order) => {
    setPrintingOrder(order);
    setTimeout(() => {
      window.print();
      setPrintingOrder(null);
    }, 100);
  };

  const getStatusVisuals = (status) => {
    switch (status) {
      case 'Paid':
        return { icon: CheckCircle, color: 'text-green-500', bgColor: 'bg-green-100 dark:bg-green-900/50' };
      case 'Pending':
        return { icon: Clock, color: 'text-orange-500', bgColor: 'bg-orange-100 dark:bg-orange-900/50' };
      case 'Cancelled':
        return { icon: XCircle, color: 'text-red-500', bgColor: 'bg-red-100 dark:bg-red-900/50' };
      case 'Refunded':
        return { icon: Undo2, color: 'text-amber-600', bgColor: 'bg-amber-100 dark:bg-amber-900/50' };
      default:
        return { icon: RefreshCw, color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/50' };
    }
  };

  return (
    <>
      {printingOrder && (
        <PrintView>
          <Receipt order={printingOrder} />
        </PrintView>
      )}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold gradient-text mb-2">Order Management</h2>
            <p className="text-gray-600 dark:text-gray-400">View and manage all customer orders</p>
          </div>
        </div>
        
        <Card className="glass-effect border-2 border-white/30 dark:border-slate-700/50">
          <CardHeader>
            <CardTitle className="gradient-text">All Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.map((order, index) => {
                const { icon: Icon, color, bgColor } = getStatusVisuals(order.status);
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-xl bg-white/60 dark:bg-slate-800/30 border border-white/30 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-800/60 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg ${bgColor} flex items-center justify-center`}>
                          <ListOrdered className={`w-6 h-6 ${color}`} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 dark:text-gray-200 text-lg">{order.id}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(order.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                         <p className="font-bold gradient-text text-xl">${(order.total || 0).toFixed(2)}</p>
                         <div className="flex items-center justify-end gap-2 mt-1">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${bgColor} ${color}`}>{order.status}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">by {order.staff}</span>
                         </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-5 h-5"/>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setViewingOrder(order)}>
                                <Eye className="mr-2 h-4 w-4" />
                                <span>View Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handlePrintReceipt(order)}>
                                <Printer className="mr-2 h-4 w-4" />
                                <span>Print Receipt</span>
                            </DropdownMenuItem>
                            {order.status === 'Paid' && (
                              <DropdownMenuItem onClick={() => setRefundingOrder(order)} className="text-amber-600 focus:text-amber-600">
                                  <HandCoins className="mr-2 h-4 w-4" />
                                  <span>Process Refund</span>
                              </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {viewingOrder && (
          <OrderDetailsModal
            order={viewingOrder}
            isOpen={!!viewingOrder}
            onClose={() => setViewingOrder(null)}
          />
        )}

        {refundingOrder && (
          <RefundModal
            order={refundingOrder}
            isOpen={!!refundingOrder}
            onClose={() => setRefundingOrder(null)}
            onConfirm={handleConfirmRefund}
          />
        )}
      </div>
    </>
  );
};

export default OrderManagement;