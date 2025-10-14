import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, List, PlusCircle, FileText, RotateCcw, Percent, Search, Calendar, User, MoreVertical, Eye, Printer, Trash2, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import PrintView from '@/components/pos/PrintView';

const Sell = ({ setActiveTab, onSetDraftToLoad }) => {
    const [printData, setPrintData] = useState(null);
    const printRef = useRef();

    useEffect(() => {
        if (printData) {
            const timer = setTimeout(() => {
                window.print();
                setPrintData(null);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [printData]);

    const handlePrint = (type, data) => {
        setPrintData({ type, data });
    };

    return (
        <>
            <div className="space-y-8 print:hidden">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-bold gradient-text mb-2">Sell Management</h2>
                        <p className="text-muted-foreground">Track all sales, drafts, returns, and discounts.</p>
                    </div>
                    <Button onClick={() => setActiveTab('pos')} className="gap-2">
                        <PlusCircle className="w-4 h-4" />
                        Go to POS
                    </Button>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, staggerChildren: 0.1 }}
                    className="space-y-8"
                >
                    <SalesList onPrint={handlePrint} />
                    <DraftList setActiveTab={setActiveTab} onSetDraftToLoad={onSetDraftToLoad} />
                    <SellReturnList />
                    <DiscountList setActiveTab={setActiveTab} />
                </motion.div>
            </div>
            {printData && <PrintView ref={printRef} type={printData.type} data={printData.data} />}
        </>
    );
};

const SalesList = ({ onPrint }) => {
    const [sales, setSales] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSale, setSelectedSale] = useState(null);
    const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);

    useEffect(() => {
        const storedSales = JSON.parse(localStorage.getItem('loungeRecentSales')) || [];
        setSales(storedSales);
    }, []);

    const filteredSales = sales.filter(sale => 
        (sale.id?.toString().toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (sale.cashier?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
    
    const handleViewDetails = (sale) => {
        setSelectedSale(sale);
        setIsDetailViewOpen(true);
    };

    const handlePrintReceipt = (sale) => {
        onPrint('final-receipt', { ...sale, isReceipt: true });
    };

    return (
        <>
            <Card className="glass-effect">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><List className="w-6 h-6 text-primary" /> Sales List</CardTitle>
                    <CardDescription>A detailed list of all completed sales.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative mb-4">
                        <Input 
                            placeholder="Search by Receipt ID or Cashier..." 
                            className="pl-10" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                        {filteredSales.length > 0 ? filteredSales.map(sale => (
                            <div key={sale.id} className="p-4 rounded-lg border bg-background/50 flex justify-between items-center">
                                <div className="flex-1">
                                    <p className="font-bold text-primary">#{sale.id}</p>
                                    <p className="text-sm text-muted-foreground flex items-center gap-2"><User className="w-3 h-3" />{sale.cashier}</p>
                                    <p className="text-xs text-muted-foreground mt-1"><Calendar className="w-3 h-3 mr-1.5 inline" />{new Date(sale.id).toLocaleString()}</p>
                                </div>
                                <div className="text-right mr-4">
                                    <p className="font-bold text-lg">${sale.total.toFixed(2)}</p>
                                    <span className="px-2 py-1 text-xs rounded-full bg-green-200 text-green-800">Completed</span>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon"><MoreVertical className="w-5 h-5"/></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleViewDetails(sale)}><Eye className="mr-2 h-4 w-4" />View Details</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handlePrintReceipt(sale)}><Printer className="mr-2 h-4 w-4" />Print Receipt</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )) : (
                            <p className="text-center text-muted-foreground py-8">No sales found.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
            <SaleDetailModal isOpen={isDetailViewOpen} onClose={() => setIsDetailViewOpen(false)} sale={selectedSale} onPrint={onPrint} />
        </>
    );
};

const SaleDetailModal = ({ isOpen, onClose, sale, onPrint }) => {
    if (!sale) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Sale Details - #{sale.id}</DialogTitle>
                    <DialogDescription>{new Date(sale.id).toLocaleString()}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2 text-sm max-h-[60vh] overflow-y-auto">
                    <InfoItem label="Cashier" value={sale.cashier} />
                    <InfoItem label="Waiter" value={sale.waiter} />
                    <InfoItem label="Branch" value={sale.branch?.name} />
                    <InfoItem label="Section" value={sale.section} />
                    <InfoItem label="Service Type" value={sale.serviceType} />
                    {sale.table && <InfoItem label="Table" value={sale.table} />}

                    <h3 className="font-bold pt-4 border-t mt-4">Items ({sale.items.length})</h3>
                    <div className="space-y-2">
                        {sale.items.map(item => (
                            <div key={item.id} className="flex justify-between items-center">
                                <span>{item.name} x {item.qty}</span>
                                <span className="font-mono">${(item.price * item.qty).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <h3 className="font-bold pt-4 border-t mt-4">Totals</h3>
                    <InfoItem label="Subtotal" value={`$${sale.subtotal.toFixed(2)}`} />
                    <InfoItem label="Tax" value={`$${sale.tax.toFixed(2)}`} />
                    {sale.discount > 0 && <InfoItem label="Discount" value={`-$${sale.discount.toFixed(2)}`} className="text-destructive" />}
                    <InfoItem label="Total Amount" value={`$${sale.total.toFixed(2)}`} className="font-extrabold text-base"/>

                    <h3 className="font-bold pt-4 border-t mt-4">Payment</h3>
                    <InfoItem label="Method" value={sale.paymentDetails.method.toUpperCase()} />
                    {sale.paymentDetails.method === 'cash' && (
                        <>
                            <InfoItem label="Cash Received" value={`$${sale.paymentDetails.received.toFixed(2)}`} />
                            <InfoItem label="Change" value={`$${sale.paymentDetails.change.toFixed(2)}`} />
                        </>
                    )}
                     {sale.paymentDetails.method === 'multiple' && (
                        <>
                           {sale.paymentDetails.details.cash > 0 && <InfoItem label="- Cash" value={`$${sale.paymentDetails.details.cash.toFixed(2)}`} />}
                           {sale.paymentDetails.details.card > 0 && <InfoItem label="- Card" value={`$${sale.paymentDetails.details.card.toFixed(2)}`} />}
                           {sale.paymentDetails.details.bank > 0 && <InfoItem label="- Bank Transfer" value={`$${sale.paymentDetails.details.bank.toFixed(2)}`} />}
                        </>
                    )}
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={onClose}>Close</Button>
                    <Button onClick={() => onPrint('final-receipt', { ...sale, isReceipt: true })}><Printer className="mr-2 h-4 w-4"/>Print</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

const InfoItem = ({ label, value, className }) => (
  <div className="flex justify-between items-center">
    <p className="text-muted-foreground">{label}</p>
    <p className={`font-semibold ${className}`}>{value || '-'}</p>
  </div>
);


const DraftList = ({ setActiveTab, onSetDraftToLoad }) => {
    const [drafts, setDrafts] = useState([]);

    useEffect(() => {
        const storedDrafts = JSON.parse(localStorage.getItem('loungeDrafts')) || [];
        setDrafts(storedDrafts);
    }, []);

    const handleDeleteDraft = (draftId) => {
        const draftToDelete = drafts.find(d => d.id === draftId);
        if (!draftToDelete) return;

        // Restore stock levels
        const stockLevels = JSON.parse(localStorage.getItem('loungeStockLevels') || '{}');
        const branches = JSON.parse(localStorage.getItem('loungeBranches') || '[]');
        const currentBranch = branches.find(b => b.sections.some(s => s.id === draftToDelete.sectionId));
        if (currentBranch) {
            const sectionName = currentBranch.sections.find(s => s.id === draftToDelete.sectionId)?.name;
            if (sectionName) {
                draftToDelete.cart.forEach(item => {
                    if (stockLevels[item.id] && stockLevels[item.id][sectionName] !== undefined) {
                        stockLevels[item.id][sectionName] += item.qty;
                    }
                });
                localStorage.setItem('loungeStockLevels', JSON.stringify(stockLevels));
            }
        }
        
        if (draftToDelete.table) {
            const tables = JSON.parse(localStorage.getItem('loungeTables') || '[]');
            const updatedTables = tables.map(t => t.id === draftToDelete.table.id ? { ...t, status: 'available' } : t);
            localStorage.setItem('loungeTables', JSON.stringify(updatedTables));
        }

        const updatedDrafts = drafts.filter(d => d.id !== draftId);
        setDrafts(updatedDrafts);
        localStorage.setItem('loungeDrafts', JSON.stringify(updatedDrafts));
        toast({ title: "Draft Deleted", description: "The saved order has been removed and stock restored." });
    };

    const handleLoadDraft = (draft) => {
        onSetDraftToLoad(draft);
        setActiveTab('pos');
        toast({ title: "Draft Loaded", description: `Draft "${draft.name}" is ready in the POS.` });
    };

    return (
        <Card className="glass-effect">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText className="w-6 h-6 text-primary" /> Saved Drafts & Suspended</CardTitle>
                <CardDescription>Manage your saved, in-progress, or credit orders.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {drafts.length > 0 ? drafts.map(draft => (
                        <div key={draft.id} className={`p-4 rounded-lg border ${draft.isSuspended ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' : 'bg-background/50' } flex justify-between items-center`}>
                            <div>
                                <p className="font-bold">{draft.name}</p>
                                <p className="text-sm text-muted-foreground">
                                    {draft.cart.length} items - {draft.service}
                                    {draft.table && ` - Table: ${draft.table.name}`}
                                    {draft.isSuspended && ` - Total: $${draft.total.toFixed(2)}`}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1"><Calendar className="w-3 h-3 mr-1.5 inline" />{new Date(draft.updatedAt).toLocaleString()}</p>
                            </div>
                            <AlertDialog>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon"><MoreVertical className="w-5 h-5"/></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleLoadDraft(draft)}><ShoppingCart className="mr-2 h-4 w-4" />Load & Edit</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <AlertDialogTrigger asChild>
                                            <DropdownMenuItem className="text-red-500 focus:text-red-500"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                                        </AlertDialogTrigger>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete "{draft.name}".
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteDraft(draft.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    )) : (
                        <p className="text-center text-muted-foreground py-8">No saved drafts or suspended bills.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

const SellReturnList = () => {
    const handleAction = (action) => {
        toast({
            title: `Action: ${action}`,
            description: `This feature is not yet implemented.`,
        });
    };

    return (
        <Card className="glass-effect">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><RotateCcw className="w-6 h-6 text-primary" /> Sales Returns</CardTitle>
                <CardDescription>Track all returned items and refunds.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center text-muted-foreground py-8">
                    <p>No sales returns found.</p>
                    <Button variant="link" onClick={() => handleAction('Create Return')}>Create a new return</Button>
                </div>
            </CardContent>
        </Card>
    );
};

const DiscountList = ({ setActiveTab }) => {
    const [appliedDiscounts, setAppliedDiscounts] = useState([]);

    useEffect(() => {
        const storedSales = JSON.parse(localStorage.getItem('loungeRecentSales')) || [];
        const discounts = storedSales
            .filter(sale => sale.discountInfo && sale.discountInfo.amount > 0)
            .map(sale => ({
                saleId: sale.id,
                cashier: sale.cashier,
                discountName: sale.discountInfo.name,
                discountAmount: sale.discountInfo.amount,
                date: sale.id,
            }));
        setAppliedDiscounts(discounts);
    }, []);

    return (
        <Card className="glass-effect">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Percent className="w-6 h-6 text-primary" /> Applied Discounts</CardTitle>
                <CardDescription>A log of all discounts applied to sales.</CardDescription>
            </CardHeader>
            <CardContent>
                {appliedDiscounts.length > 0 ? (
                    <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                        {appliedDiscounts.map((discount, index) => (
                            <div key={index} className="p-3 rounded-lg border bg-background/50 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{discount.discountName}</p>
                                    <p className="text-sm text-muted-foreground">Sale #{discount.saleId} by {discount.cashier}</p>
                                    <p className="text-xs text-muted-foreground mt-1"><Calendar className="w-3 h-3 mr-1.5 inline" />{new Date(discount.date).toLocaleString()}</p>
                                </div>
                                <p className="font-bold text-lg text-destructive">-${discount.discountAmount.toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground py-8">
                        <p>No discounts have been applied to sales yet.</p>
                    </div>
                )}
                <div className="flex justify-center mt-4">
                    <Button variant="link" onClick={() => setActiveTab('discount-settings')}>View & Manage Discounts</Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default Sell;
