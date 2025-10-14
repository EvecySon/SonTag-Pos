import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { X } from 'lucide-react';

const OrderDetailsModal = ({ order, isOpen, onClose }) => {
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg glass-effect">
        <DialogHeader>
          <DialogTitle className="gradient-text text-2xl">Order Details: {order.id}</DialogTitle>
          <DialogDescription>
            {new Date(order.timestamp).toLocaleString()} by {order.staff}
          </DialogDescription>
        </DialogHeader>
        <div className="my-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold">Status</p>
              <p>{order.status}</p>
            </div>
            <div>
              <p className="font-semibold">Payment Method</p>
              <p>{order.paymentMethod}</p>
            </div>
          </div>
        </div>
        <div className="max-h-64 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="text-center">Qty</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="text-center">{item.quantity || 0}</TableCell>
                  <TableCell className="text-right">${(item.price || 0).toFixed(2)}</TableCell>
                  <TableCell className="text-right">${((item.quantity || 0) * (item.price || 0)).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex justify-end items-center text-lg font-bold">
            <span className="text-muted-foreground mr-4">Total:</span>
            <span className="gradient-text">${(order.total || 0).toFixed(2)}</span>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            <X className="mr-2 h-4 w-4" /> Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;