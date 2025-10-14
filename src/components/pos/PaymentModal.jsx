import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { DollarSign, CreditCard, Landmark, Layers, FileText, User, Phone } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, totalAmount, onPaymentSuccess, initialTab = 'cash' }) => {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [cashReceived, setCashReceived] = useState('');
    const [multiPay, setMultiPay] = useState({ cash: '', card: '', bank: '' });
    const [creditCustomer, setCreditCustomer] = useState({ name: '', phone: '' });

    useEffect(() => {
        if (isOpen) {
            setCashReceived('');
            setMultiPay({ cash: '', card: '', bank: '' });
            setCreditCustomer({ name: '', phone: '' });
            setActiveTab(initialTab);
        }
    }, [isOpen, initialTab]);

    const change = cashReceived ? parseFloat(cashReceived) - totalAmount : -totalAmount;
    
    const handleCashPayment = () => {
        if (change < 0) {
            toast({ title: "Insufficient Amount", description: "Cash received is less than the total amount.", variant: "destructive" });
            return;
        }
        onPaymentSuccess({
            method: 'cash',
            total: totalAmount,
            received: parseFloat(cashReceived),
            change: change
        });
    };

    const handleCardPayment = () => {
        toast({ title: "Processing...", description: "Connecting to card terminal..." });
        setTimeout(() => {
            onPaymentSuccess({
                method: 'card',
                total: totalAmount
            });
        }, 1500);
    };
    
    const handleBankTransferPayment = () => {
        onPaymentSuccess({
            method: 'bank transfer',
            total: totalAmount
        });
    };

    const handleCreditSale = () => {
        if (!creditCustomer.name || !creditCustomer.phone) {
            toast({ title: "Customer Details Required", description: "Please enter customer name and phone number.", variant: "destructive" });
            return;
        }
        onPaymentSuccess({
            method: 'credit sale',
            total: totalAmount,
            customer: creditCustomer
        });
    };

    const handleMultiPay = () => {
        const cashPart = parseFloat(multiPay.cash || 0);
        const cardPart = parseFloat(multiPay.card || 0);
        const bankPart = parseFloat(multiPay.bank || 0);
        const paidAmount = cashPart + cardPart + bankPart;

        if (paidAmount.toFixed(2) !== totalAmount.toFixed(2)) {
            toast({ title: "Incorrect Amount", description: `The amounts must sum up to $${totalAmount.toFixed(2)}.`, variant: "destructive"});
            return;
        }

        onPaymentSuccess({
            method: 'multiple',
            total: totalAmount,
            details: { cash: cashPart, card: cardPart, bank: bankPart }
        });
    };

    const remainingForMultiPay = totalAmount - parseFloat(multiPay.cash || 0) - parseFloat(multiPay.card || 0) - parseFloat(multiPay.bank || 0);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Payment</DialogTitle>
                    <DialogDescription>Total Amount: <span className="font-bold text-primary">${totalAmount.toFixed(2)}</span></DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="cash"><DollarSign className="w-4 h-4 mr-2"/>Cash</TabsTrigger>
                        <TabsTrigger value="card"><CreditCard className="w-4 h-4 mr-2"/>Card</TabsTrigger>
                        <TabsTrigger value="credit"><FileText className="w-4 h-4 mr-2"/>Credit</TabsTrigger>
                        <TabsTrigger value="bank"><Landmark className="w-4 h-4 mr-2"/>Bank</TabsTrigger>
                        <TabsTrigger value="multiple"><Layers className="w-4 h-4 mr-2"/>Multiple</TabsTrigger>
                    </TabsList>

                    <TabsContent value="cash" className="py-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="cash-received">Cash Received</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="cash-received" type="number" value={cashReceived} onChange={(e) => setCashReceived(e.target.value)} placeholder="e.g. 100.00" className="pl-8 text-lg"/>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {[totalAmount, Math.ceil(totalAmount / 5) * 5, Math.ceil(totalAmount / 10) * 10, (Math.ceil(totalAmount / 10) * 10) + 10].map(val => val > totalAmount ? val : null).filter(Boolean).map(val => (
                                <Button key={val} variant="outline" onClick={() => setCashReceived(val.toFixed(2))}>${val.toFixed(2)}</Button>
                            ))}
                        </div>
                        <div className={`p-4 rounded-md text-center font-bold text-xl ${change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                           {change >= 0 ? `Change: $${change.toFixed(2)}` : `Remaining: $${(-change).toFixed(2)}`}
                        </div>
                        <Button className="w-full" onClick={handleCashPayment} disabled={change < 0}>Confirm Cash Payment</Button>
                    </TabsContent>

                    <TabsContent value="card" className="py-4 text-center space-y-4">
                        <p>Follow instructions on the card terminal.</p>
                        <CreditCard className="w-24 h-24 mx-auto text-muted-foreground"/>
                        <Button className="w-full" onClick={handleCardPayment}>Process Card Payment</Button>
                    </TabsContent>

                    <TabsContent value="credit" className="py-4 space-y-4">
                        <p className="text-sm text-center text-muted-foreground">This will suspend the bill to be paid later. Customer details are required.</p>
                        <div className="space-y-2">
                            <Label htmlFor="customer-name">Customer Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="customer-name" value={creditCustomer.name} onChange={(e) => setCreditCustomer({...creditCustomer, name: e.target.value})} placeholder="Enter customer's full name" className="pl-8"/>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="customer-phone">Phone Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="customer-phone" type="tel" value={creditCustomer.phone} onChange={(e) => setCreditCustomer({...creditCustomer, phone: e.target.value})} placeholder="Enter customer's phone number" className="pl-8"/>
                            </div>
                        </div>
                        <Button className="w-full" onClick={handleCreditSale}>Confirm Credit Sale</Button>
                    </TabsContent>

                    <TabsContent value="bank" className="py-4 space-y-4">
                         <div className="p-4 bg-muted rounded-md text-sm">
                            <p className="font-semibold">Bank: Awesome Bank Inc.</p>
                            <p>Account Name: Lounge ERP</p>
                            <p>Account Number: 1234567890</p>
                            <p>Reference: Order #{Math.floor(Date.now() / 1000)}</p>
                        </div>
                        <Button className="w-full" onClick={handleBankTransferPayment}>Confirm Payment Received</Button>
                    </TabsContent>

                    <TabsContent value="multiple" className="py-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           <div className="space-y-2">
                                <Label htmlFor="multi-cash">Cash Amount</Label>
                                <Input id="multi-cash" type="number" placeholder="0.00" value={multiPay.cash} onChange={(e) => setMultiPay({...multiPay, cash: e.target.value})} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="multi-card">Card Amount</Label>
                                <Input id="multi-card" type="number" placeholder="0.00" value={multiPay.card} onChange={(e) => setMultiPay({...multiPay, card: e.target.value})}/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="multi-bank">Bank Transfer</Label>
                                <Input id="multi-bank" type="number" placeholder="0.00" value={multiPay.bank} onChange={(e) => setMultiPay({...multiPay, bank: e.target.value})}/>
                            </div>
                        </div>
                        <div className={`p-3 rounded-md text-center font-semibold ${remainingForMultiPay.toFixed(2) == 0.00 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                           Remaining: ${remainingForMultiPay.toFixed(2)}
                        </div>
                        <Button className="w-full" onClick={handleMultiPay} disabled={remainingForMultiPay.toFixed(2) != 0.00}>Confirm Split Payment</Button>
                    </TabsContent>
                </Tabs>
                <DialogFooter>
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PaymentModal;