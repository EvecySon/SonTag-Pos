
    import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Minus, X, Wifi, WifiOff, Sun, Moon, Bell, Coffee, Wallet, Trash2, ChevronDown, ArrowLeft, Eye, DollarSign, Info, FileText, FolderOpen, CreditCard, Landmark, Layers, Printer, User as UserIcon, ChefHat, Beer, LogOut, Download, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import PinModal from '@/components/pos/PinModal';
import PaymentModal from '@/components/pos/PaymentModal';
import CashDrawerModal from '@/components/pos/CashDrawerModal';
import CardTerminalModal from '@/components/pos/CardTerminalModal';
import PrintView from '@/components/pos/PrintView';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { api } from '@/lib/api';


const serviceTypes = ['Dine-in', 'Takeaway', 'Delivery', 'Pickup'];
const customerTypes = ['Walk-in', 'Member', 'VIP', 'Corporate'];

const categories = ['All', 'Bar', 'Kitchen', 'Neutral'];

const defaultTables = [
    { id: 't1', name: 'T1', section: 'Main Bar', status: 'available' },
    { id: 't2', name: 'T2', section: 'Main Bar', status: 'occupied' },
    { id: 't3', name: 'T3', section: 'Lounge Bar', status: 'available' },
    { id: 'c1', name: 'C1', section: 'Club Section', status: 'available' },
    { id: 'r1', name: 'R1', section: 'Rooftop Bar', status: 'available' },
];


const POSInterface = ({ user, toggleTheme, currentTheme, onBackToDashboard, onLogout, shiftRegister, onShiftClose, draftToLoad, onClearDraftToLoad }) => {
  const [time, setTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cart, setCart] = useState([]);
  const [currentSection, setCurrentSection] = useState('');
  const [branchSections, setBranchSections] = useState([]);
  const [currentService, setCurrentService] = useState(serviceTypes[0]);
  const [currentCustomer, setCurrentCustomer] = useState(customerTypes[0]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [isPinModalOpen, setPinModalOpen] = useState(false);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState('cash');
  const [isCashDrawerModalOpen, setCashDrawerModalOpen] = useState(false);
  const [isCardTerminalModalOpen, setCardTerminalModalOpen] = useState(false);
  const [pinAction, setPinAction] = useState(null);
  const [tables, setTables] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [isDraftsOpen, setIsDraftsOpen] = useState(false);
  const [editingDraft, setEditingDraft] = useState(null);
  const [printData, setPrintData] = useState(null);
  const printRef = useRef();
  const [products, setProducts] = useState([]);
  const [stockLevels, setStockLevels] = useState({});
  const [sectionPrices, setSectionPrices] = useState({});
  const [userPermissions, setUserPermissions] = useState([]);
  const [serviceStaffList, setServiceStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isSalesHistoryOpen, setIsSalesHistoryOpen] = useState(false);
  const [recentSales, setRecentSales] = useState([]);
  const [allowOverselling, setAllowOverselling] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [taxRate, setTaxRate] = useState(10);
  const [discount, setDiscount] = useState({ type: 'percentage', value: 0 });
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);

  useEffect(() => {
    const loadFromBackend = async () => {
      try {
        // Load products for the user's branch
        const prods = await api.products.list({ branchId: user.branchId });
        setProducts(prods.map(p => ({ id: p.id, name: p.name, station: p.category || 'neutral', price: p.price ? parseFloat(p.price) : 0 })));

        // Load inventory levels for the branch
        const inv = await api.inventory.list({ branchId: user.branchId });
        // Initialize section-based prices/stock with a simple default using current section
        const currentSavedSectionPrices = JSON.parse(localStorage.getItem('loungeSectionPrices') || '{}');
        const currentSavedStockLevels = {};
        inv.forEach(row => {
          currentSavedStockLevels[row.productId] = currentSavedStockLevels[row.productId] || {};
          // Use section name later when available; prefill generic stock per current section
          currentSavedStockLevels[row.productId]['default'] = row.qtyOnHand;
        });
        setStockLevels(currentSavedStockLevels);
        setSectionPrices(currentSavedSectionPrices);
      } catch (e) {
        // Fall back to local data if backend fails
        const savedProducts = localStorage.getItem('loungeProducts');
        const savedStockLevels = localStorage.getItem('loungeStockLevels');
        const savedSectionPrices = localStorage.getItem('loungeSectionPrices');
        if (savedProducts) setProducts(JSON.parse(savedProducts));
        if (savedStockLevels) setStockLevels(JSON.parse(savedStockLevels));
        if (savedSectionPrices) setSectionPrices(JSON.parse(savedSectionPrices));
      }
    };

    const savedOverselling = localStorage.getItem('loungeAllowOverselling');
    const savedTaxSettings = JSON.parse(localStorage.getItem('loungeTaxSettings'));
    const savedDiscounts = JSON.parse(localStorage.getItem('loungeDiscounts'));

    if (savedTaxSettings && savedTaxSettings.tax1Number) {
      setTaxRate(parseFloat(savedTaxSettings.tax1Number));
    }
    setAllowOverselling(savedOverselling === 'true');

    loadFromBackend();

    (async () => {
      try {
        if (!user.branchId) return;
        const sections = await api.sections.list({ branchId: user.branchId });
        setBranchSections(sections || []);
        if (shiftRegister && shiftRegister.sectionId) {
          setCurrentSection(shiftRegister.sectionId);
        } else {
          const firstValidSection = (sections || []).find(s => !String(s.name || '').toLowerCase().includes('store') && !String(s.name || '').toLowerCase().includes('kitchen'));
          setCurrentSection(firstValidSection ? firstValidSection.id : ((sections && sections[0]) ? sections[0].id : ''));
        }
      } catch {
        setBranchSections([]);
        setCurrentSection('');
      }
    })();

    setTables([]);

    const savedDrafts = localStorage.getItem('loungeDrafts');
    if (savedDrafts) {
      setDrafts(JSON.parse(savedDrafts));
    }

    const allRoles = JSON.parse(localStorage.getItem('loungeRoles') || '[]');
    const currentUserRole = allRoles.find(r => r.name === user.role);
    if (currentUserRole) {
      setUserPermissions(currentUserRole.permissions);
    }

    const allUsers = JSON.parse(localStorage.getItem('loungeUsers') || '[]');
    const staff = allUsers.filter(u => u.isServiceStaff);
    setServiceStaffList(staff);
    setSelectedStaff(user.isServiceStaff ? user.id : null);

    const savedSales = localStorage.getItem('loungeRecentSales');
    if (savedSales) {
      setRecentSales(JSON.parse(savedSales));
    }

  }, [user, shiftRegister]);

  // Load effective prices for current section/branch and merge into sectionPrices
  useEffect(() => {
    const loadPrices = async () => {
      try {
        if (!user?.branchId || !currentSection || !products?.length) return;
        const pricesMap = await api.prices.effective({ branchId: user.branchId, sectionId: currentSection });
        const sectionName = branchSections.find(s => s.id === currentSection)?.name || 'default';
        const merged = JSON.parse(JSON.stringify(sectionPrices || {}));
        Object.entries(pricesMap || {}).forEach(([pid, price]) => {
          merged[pid] = merged[pid] || {};
          merged[pid][sectionName] = price;
        });
        setSectionPrices(merged);
      } catch (e) {
        // silent fallback
      }
    };
    loadPrices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.branchId, currentSection, products?.length, branchSections]);

  useEffect(() => {
    if (draftToLoad) {
      handleLoadDraft(draftToLoad);
      onClearDraftToLoad();
    }
  }, [draftToLoad]);

  // Load tables whenever currentSection changes
  useEffect(() => {
    const loadTables = async () => {
      try {
        if (!currentSection) return;
        const rows = await api.tables.list({ sectionId: currentSection });
        setTables((rows || []).map(t => ({ id: t.id, name: t.name || t.code || t.id, section: t.sectionId, status: t.locked ? 'occupied' : 'available' })));
      } catch {
        // fallback to local saved tables if API fails
        const savedTables = localStorage.getItem('loungeTables');
        if (savedTables) setTables(JSON.parse(savedTables));
      }
    };
    loadTables();
  }, [currentSection]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      clearInterval(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (printData) {
      const timer = setTimeout(() => {
        window.print();
        setPrintData(null);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [printData]);
  
  const updateTableStatus = async (tableId, status) => {
    try {
      if (status === 'occupied') await api.tables.lock(tableId);
      if (status === 'available') await api.tables.unlock(tableId);
    } catch (e) {
      // fallback to local-only update if API fails
    }
    setTables(prevTables => {
      const updatedTables = prevTables.map(t => t.id === tableId ? { ...t, status } : t);
      localStorage.setItem('loungeTables', JSON.stringify(updatedTables));
      return updatedTables;
    });
  };

  const handlePinRequest = (action) => {
    // Bypassing PIN for discount if user has permission
    if (action.type === 'edit_discount' && userPermissions.includes('pos.access_discount')) {
      setIsDiscountModalOpen(true);
      return;
    }
    setPinAction(action);
    setPinModalOpen(true);
  };
  
  const handlePinSuccess = (action) => {
    toast({ title: "PIN Verified!", description: `Action '${action.type}' authorized.` });
    if(action.type === 'clear_cart') {
      if (editingDraft && editingDraft.table) {
        updateTableStatus(editingDraft.table.id, 'available');
      }
      setCart([]);
      setEditingDraft(null);
      setSelectedTable(null);
      setCurrentService(serviceTypes[0]);
      setCurrentCustomer(customerTypes[0]);
    }
    if (action.type === 'void') {
        setCart(cart.filter(item => item.id !== action.itemId));
    }
    if (action.type === 'decrement') {
        setCart(cart.map(item => item.id === action.itemId ? {...item, qty: Math.max(0, item.qty - 1)} : item).filter(item => item.qty > 0));
    }
    if (action.type === 'edit_discount') {
      setIsDiscountModalOpen(true);
    }
    if (action.type === 'delete_draft') {
      handleDeleteDraft(action.draftId, true);
    }
  };

  const handlePrint = (type, data) => {
    setPrintData({ type, data });
  };

  const handlePrintItem = (item) => {
    let qtyToPrint = item.qty;

    if (editingDraft) {
      const originalItem = editingDraft.cart.find(draftItem => draftItem.id === item.id);
      if (originalItem) {
        qtyToPrint = item.qty - originalItem.qty;
      }
    }

    if (qtyToPrint <= 0) {
      toast({ title: "No new items to print", description: "Quantity has not increased.", variant: "default" });
      return;
    }

    handlePrint('item-invoice', {
      items: [{ ...item, qty: qtyToPrint }],
      table: selectedTable?.name,
      section: branchSections.find(s => s.id === currentSection)?.name,
      user: user.username,
      branch: user.branch,
    });
  };

  const handlePrintByCategory = (category) => {
    const itemsInCategory = cart.filter(item => item.station === category);
    if (itemsInCategory.length === 0) {
        toast({ title: `No ${category.charAt(0).toUpperCase() + category.slice(1)} Items`, description: `There are no ${category} items in the cart to print.`, variant: "default" });
        return;
    }

    const itemsToPrint = [];
    itemsInCategory.forEach(currentItem => {
      let qtyToPrint = currentItem.qty;

      if (editingDraft) {
        const originalItem = editingDraft.cart.find(draftItem => draftItem.id === currentItem.id);
        if (originalItem) {
          qtyToPrint = currentItem.qty - originalItem.qty;
        }
      }

      if (qtyToPrint > 0) {
        itemsToPrint.push({ ...currentItem, qty: qtyToPrint });
      }
    });

    if (itemsToPrint.length === 0) {
      toast({ title: `No New ${category.charAt(0).toUpperCase() + category.slice(1)} Items`, description: `No new items or quantity changes to print for this category.`, variant: "default" });
      return;
    }

    handlePrint('item-invoice', {
        items: itemsToPrint,
        table: selectedTable?.name,
        section: branchSections.find(s => s.id === currentSection)?.name,
        user: user.username,
        branch: user.branch,
    });
    toast({ title: `${category.charAt(0).toUpperCase() + category.slice(1)} Order Sent`, description: `New items have been sent for production.` });
  };

  const addToCart = (product) => {
    if (!currentSection) {
      toast({ title: 'Section Required', description: 'Please select an operational section.', variant: 'destructive' });
      return;
    }
    if (currentService === 'Dine-in' && !selectedTable) {
      toast({ title: 'Table Required', description: 'Please select a table for Dine-in orders.', variant: 'destructive' });
      return;
    }
    
    const currentSectionName = branchSections.find(s => s.id === currentSection)?.name || '';
    const price = (sectionPrices[product.id]?.[currentSectionName] ?? product.price);

    if (price === undefined || price === null) {
        toast({ title: 'Price Not Set', description: `Price for ${product.name} in ${currentSectionName} is not set.`, variant: 'destructive' });
        return;
    }

    const stock = (stockLevels[product.id]?.[currentSectionName] ?? stockLevels[product.id]?.['default'] ?? 0);
    const existingCartItem = cart.find(item => item.id === product.id);
    const currentCartQty = existingCartItem ? existingCartItem.qty : 0;

    if (stock <= currentCartQty && !allowOverselling) {
        toast({ title: 'Out of Stock', description: `${product.name} is currently out of stock.`, variant: 'destructive' });
        return;
    }

    setCart(prev => {
      if (existingCartItem) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1, price, station: product.station }];
    });
  };

  const updateQty = (id, delta) => {
    if (delta < 0) {
      handlePinRequest({type: 'decrement', itemId: id});
      return;
    }

    const product = products.find(p => p.id === id);
    const currentSectionName = branchSections.find(s => s.id === currentSection)?.name || '';
    const stock = (stockLevels[id]?.[currentSectionName] ?? stockLevels[id]?.['default'] ?? 0);
    const existingCartItem = cart.find(item => item.id === id);
    const currentCartQty = existingCartItem ? existingCartItem.qty : 0;

    if (delta > 0 && stock <= currentCartQty && !allowOverselling) {
        toast({ title: 'Stock Limit Reached', description: `No more ${product.name} in stock.`, variant: 'destructive' });
        return;
    }

    setCart(cart.map(item => item.id === id ? {...item, qty: Math.max(0, item.qty + delta)} : item).filter(item => item.qty > 0));
  };
  
  const handleVoid = (id) => {
    handlePinRequest({type: 'void', itemId: id});
  }

  const handleSaveDraft = () => {
    if (cart.length === 0) {
      toast({ title: 'Empty Cart', description: 'Cannot save an empty cart as a draft.', variant: 'destructive' });
      return;
    }
    let updatedDrafts;
    const draftTable = currentService === 'Dine-in' ? selectedTable : null;
    const staffMember = serviceStaffList.find(s => s.id === selectedStaff);
    const draftData = {
        cart,
        service: currentService,
        customer: currentCustomer,
        table: draftTable,
        sectionId: currentSection,
        waiter: staffMember ? staffMember.username : user.username,
        waiterId: selectedStaff,
        discount: discount,
        taxRate: taxRate,
    };
    
    // Update stock levels
    const newStockLevels = JSON.parse(JSON.stringify(stockLevels));
    const currentSectionName = branchSections.find(s => s.id === currentSection)?.name;
    let stockUpdated = false;

    if (editingDraft) {
      updatedDrafts = drafts.map(d => d.id === editingDraft.id ? { ...d, ...draftData, updatedAt: new Date().toISOString() } : d);
      toast({ title: 'Draft Updated!', description: `Draft "${editingDraft.name}" has been updated.` });

      // Calculate stock changes for updated draft
      draftData.cart.forEach(newItem => {
        const oldItem = editingDraft.cart.find(old => old.id === newItem.id);
        const qtyChange = newItem.qty - (oldItem ? oldItem.qty : 0);
        if (newStockLevels[newItem.id] && newStockLevels[newItem.id][currentSectionName] !== undefined && qtyChange !== 0) {
            newStockLevels[newItem.id][currentSectionName] -= qtyChange;
            stockUpdated = true;
        }
      });
      editingDraft.cart.forEach(oldItem => {
          if (!draftData.cart.some(newItem => newItem.id === oldItem.id)) {
              // Item removed from cart
              if (newStockLevels[oldItem.id] && newStockLevels[oldItem.id][currentSectionName] !== undefined) {
                  newStockLevels[oldItem.id][currentSectionName] += oldItem.qty;
                  stockUpdated = true;
              }
          }
      });

    } else {
      const draftName = `Draft #${drafts.length + 1}`;
      const newDraft = { id: Date.now(), name: draftName, ...draftData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      updatedDrafts = [...drafts, newDraft];
      toast({ title: 'Draft Saved!', description: `"${draftName}" has been saved.` });
      
      // Deplete stock for new draft
      cart.forEach(item => {
        if (newStockLevels[item.id] && newStockLevels[item.id][currentSectionName] !== undefined) {
          newStockLevels[item.id][currentSectionName] -= item.qty;
          stockUpdated = true;
        }
      });
    }

    if (stockUpdated) {
        setStockLevels(newStockLevels);
        localStorage.setItem('loungeStockLevels', JSON.stringify(newStockLevels));
    }
    
    setDrafts(updatedDrafts);
    localStorage.setItem('loungeDrafts', JSON.stringify(updatedDrafts));
    
    if (draftTable) {
      updateTableStatus(draftTable.id, 'occupied');
    }

    handlePrint('table-bill', {
      items: cart,
      table: selectedTable?.name,
      subtotal,
      discount: discountValue,
      tax,
      total,
      waiter: draftData.waiter,
      branch: user.branch,
      section: branchSections.find(s => s.id === currentSection)?.name,
      isDraft: true,
    });

    setCart([]);
    setEditingDraft(null);
    setSelectedTable(null);
    setCurrentService(serviceTypes[0]);
    setCurrentCustomer(customerTypes[0]);
    setDiscount({ type: 'percentage', value: 0 });
  };

  const handleLoadDraft = (draft) => {
    setCart(draft.cart);
    setCurrentService(draft.service || serviceTypes[0]);
    setCurrentCustomer(draft.customer || customerTypes[0]);
    if (draft.table) {
      const tableExists = tables.find(t => t.id === draft.table.id);
      setSelectedTable(tableExists ? draft.table : null);
    } else {
      setSelectedTable(null);
    }
    setCurrentSection(draft.sectionId || currentSection);
    setSelectedStaff(draft.waiterId || null);
    setDiscount(draft.discount || { type: 'percentage', value: 0 });
    setTaxRate(draft.taxRate || 10);
    setEditingDraft(draft);
    setIsDraftsOpen(false);
    toast({ title: 'Draft Loaded', description: `Now editing "${draft.name}".` });
  };

  const handleDeleteDraft = (draftId, pinVerified = false) => {
    if (!pinVerified) {
      handlePinRequest({ type: 'delete_draft', draftId: draftId });
      return;
    }
    
    const draftToDelete = drafts.find(d => d.id === draftId);
    if (!draftToDelete) return;

    // Restore stock
    const newStockLevels = JSON.parse(JSON.stringify(stockLevels));
    const sectionName = branchSections.find(s => s.id === draftToDelete.sectionId)?.name;
    if (sectionName) {
        draftToDelete.cart.forEach(item => {
            if (newStockLevels[item.id] && newStockLevels[item.id][sectionName] !== undefined) {
                newStockLevels[item.id][sectionName] += item.qty;
            }
        });
        setStockLevels(newStockLevels);
        localStorage.setItem('loungeStockLevels', JSON.stringify(newStockLevels));
    }

    if (draftToDelete.table) {
      updateTableStatus(draftToDelete.table.id, 'available');
    }

    const updatedDrafts = drafts.filter(d => d.id !== draftId);
    setDrafts(updatedDrafts);
    localStorage.setItem('loungeDrafts', JSON.stringify(updatedDrafts));
    toast({ title: 'Draft Deleted', description: 'The saved order has been removed and stock restored.' });
  };

  const handleTakePayment = (mode) => {
    if (cart.length === 0) {
        toast({ title: 'Empty Cart', description: 'Cannot proceed to payment with an empty cart.', variant: 'destructive' });
        return;
    }
    setPaymentMode(mode);
    setPaymentModalOpen(true);
  };
  
  const handlePaymentSuccess = async (paymentDetails) => {
    const staffMember = serviceStaffList.find(s => s.id === selectedStaff);
    const waiterName = editingDraft ? editingDraft.waiter : (staffMember ? staffMember.username : user.username);
    const savedBranches = JSON.parse(localStorage.getItem('loungeBranches') || '[]');
    const currentBranch = savedBranches.find(b => b.id.toString() === user.branchId.toString());

    const saleData = {
      items: cart,
      table: selectedTable?.name,
      subtotal,
      discount: discountValue,
      tax,
      total,
      paymentDetails,
      waiter: waiterName,
      cashier: user.username,
      branch: currentBranch,
      section: branchSections.find(s => s.id === currentSection)?.name,
      serviceType: currentService,
      id: Date.now(),
      isReceipt: true,
    };

    if (paymentDetails.method === 'credit sale') {
        const draftTable = currentService === 'Dine-in' ? selectedTable : null;
        const draftData = {
            cart,
            service: currentService,
            customer: paymentDetails.customer.name,
            customerDetails: paymentDetails.customer,
            table: draftTable,
            sectionId: currentSection,
            total: total,
            waiter: waiterName,
            waiterId: selectedStaff,
            discount: discount,
            taxRate: taxRate,
        };

        let updatedDrafts;
        if (editingDraft) {
            updatedDrafts = drafts.map(d => d.id === editingDraft.id ? { ...d, ...draftData, isSuspended: true, updatedAt: new Date().toISOString() } : d);
            toast({ title: 'Bill Suspended!', description: `Bill for "${editingDraft.name}" has been moved to credit.` });
        } else {
            const draftName = `Suspended: ${paymentDetails.customer.name}`;
            const newDraft = { id: Date.now(), name: draftName, ...draftData, isSuspended: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
            updatedDrafts = [...drafts, newDraft];
            toast({ title: 'Bill Suspended!', description: `"${draftName}" has been saved to pay later.` });
        }
        setDrafts(updatedDrafts);
        localStorage.setItem('loungeDrafts', JSON.stringify(updatedDrafts));

        if (draftTable) {
            updateTableStatus(draftTable.id, 'available');
        }
    } else {
        // Create order in backend (handles stock decrement)
        try {
          await api.orders.create({
            branchId: user.branchId,
            items: cart.map((ci) => ({ productId: ci.id, qty: ci.qty, price: String(ci.price ?? 0) })),
            payment: { method: String(paymentDetails.method || paymentMode), amount: String(total), reference: paymentDetails?.reference || undefined },
          });
          toast({ title: "Payment Successful!", description: "Order has been processed." });
        } catch (e) {
          toast({ title: 'Order save failed', description: String(e?.message || e), variant: 'destructive' });
        }

        if (editingDraft) {
          if (editingDraft.table) {
            updateTableStatus(editingDraft.table.id, 'available');
          }
          const updatedDrafts = drafts.filter(d => d.id !== editingDraft.id);
          setDrafts(updatedDrafts);
          localStorage.setItem('loungeDrafts', JSON.stringify(updatedDrafts));
        } else if (selectedTable) {
          updateTableStatus(selectedTable.id, 'available');
        }
        
        const updatedRecentSales = [saleData, ...recentSales].slice(0, 50); // Keep last 50 sales
        setRecentSales(updatedRecentSales);
        localStorage.setItem('loungeRecentSales', JSON.stringify(updatedRecentSales));

        handlePrint('final-receipt', saleData);
    }

    setCart([]);
    setEditingDraft(null);
    setSelectedTable(null); 
    setPaymentModalOpen(false);
    setDiscount({ type: 'percentage', value: 0 });
  };

  const handleCashDrawerAction = (details) => {
    console.log("Cash drawer action:", details);
    toast({ title: "Cash Drawer Updated", description: `${details.type === 'in' ? 'Added' : 'Removed'} ${details.amount.toFixed(2)}` });
    setCashDrawerModalOpen(false);
  };

  const handleCardTerminalAction = (details) => {
    console.log("Card terminal action:", details);
    toast({ title: "Card terminal action:", description: `Processed ${details.type} for ${details.amount.toFixed(2)}` });
    setCardTerminalModalOpen(false);
  };

  const handlePrintBill = () => {
    if (cart.length === 0) {
      toast({ title: 'Empty Cart', description: 'Cannot print a bill for an empty cart.', variant: 'destructive' });
      return;
    }
    const staffMember = serviceStaffList.find(s => s.id === selectedStaff);
    const waiterName = editingDraft?.waiter || (staffMember ? staffMember.username : user.username);

    const savedBranches = JSON.parse(localStorage.getItem('loungeBranches') || '[]');
    const currentBranch = savedBranches.find(b => b.id.toString() === user.branchId.toString());

    handlePrint('table-bill', {
      items: cart,
      table: selectedTable?.name,
      subtotal,
      discount: discountValue,
      tax,
      total,
      waiter: waiterName,
      cashier: user.username,
      branch: currentBranch,
      section: branchSections.find(s => s.id === currentSection)?.name,
      isDraft: false,
    });
  };

  const handleApplyDiscount = (newDiscount) => {
    setDiscount(newDiscount);
    setIsDiscountModalOpen(false);
  };

  const handleApplyTax = (newTaxRate) => {
    setTaxRate(newTaxRate);
    setIsTaxModalOpen(false);
  };

  const currentSectionName = branchSections.find(s => s.id === currentSection)?.name || '';
  const subtotal = cart.reduce((sum, item) => sum + ((item.price || 0) * item.qty), 0);
  const discountValue = discount.type === 'fixed' ? discount.value : subtotal * (discount.value / 100);
  const taxableAmount = subtotal - discountValue;
  const tax = taxableAmount * (taxRate / 100);
  const total = taxableAmount + tax;

  const displayedProducts = products
    .filter(p => {
        const resolved = (sectionPrices[p.id]?.[currentSectionName] ?? p.price);
        return resolved !== undefined && resolved !== null;
    })
    .filter(p => {
        if (activeCategory === 'All') return true;
        if (activeCategory === 'Neutral') return p.station === 'neutral';
        return p.station && p.station.toLowerCase() === activeCategory.toLowerCase();
    })
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  
  return (
    <>
      <div className="flex flex-col h-screen font-sans print:hidden bg-pos-background">
        <AppBar 
          time={time} 
          isOnline={isOnline} 
          user={user} 
          toggleTheme={toggleTheme} 
          currentTheme={currentTheme} 
          onBackToDashboard={onBackToDashboard}
          onLogout={onLogout}
          shiftRegister={shiftRegister}
          onShiftClose={onShiftClose}
          recentSales={recentSales}
          products={products}
          handlePrint={handlePrint}
        />
        <div className="flex flex-1 overflow-hidden">
          <ProductSidebar 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
          <main className="flex-1 p-4 grid grid-cols-4 gap-4 overflow-y-auto content-start">
            {displayedProducts.map(p => (
              <ProductCard key={p.id} product={p} sectionName={currentSectionName} stock={stockLevels[p.id]?.[currentSectionName]} price={sectionPrices[p.id]?.[currentSectionName]} onAdd={addToCart} allowOverselling={allowOverselling} />
            ))}
          </main>
          <CartPanel
            user={user}
            cart={cart}
            onUpdateQty={updateQty}
            onVoid={handleVoid}
            onPrintItem={handlePrintItem}
            subtotal={subtotal}
            discountValue={discountValue}
            tax={tax}
            total={total}
            currentSection={currentSection}
            setCurrentSection={setCurrentSection}
            branchSections={branchSections}
            currentService={currentService}
            setCurrentService={setCurrentService}
            currentCustomer={currentCustomer}
            setCurrentCustomer={setCurrentCustomer}
            selectedTable={selectedTable}
            setSelectedTable={setSelectedTable}
            onClearCart={() => handlePinRequest({ type: 'clear_cart' })}
            tables={tables}
            onSaveDraft={handleSaveDraft}
            onViewDrafts={() => setIsDraftsOpen(true)}
            onOpenCashDrawer={() => setCashDrawerModalOpen(true)}
            onTakePayment={handleTakePayment}
            draftCount={drafts.length}
            editingDraft={editingDraft}
            onPrintBill={handlePrintBill}
            canAcceptPayment={true}
            serviceStaffList={serviceStaffList}
            selectedStaff={selectedStaff}
            setSelectedStaff={setSelectedStaff}
            onPrintByCategory={handlePrintByCategory}
            onViewSalesHistory={() => setIsSalesHistoryOpen(true)}
            onEditDiscount={() => handlePinRequest({ type: 'edit_discount' })}
            onEditTax={() => setIsTaxModalOpen(true)}
            taxRate={taxRate}
          />
        </div>
        <PinModal
          isOpen={isPinModalOpen}
          onClose={() => setPinModalOpen(false)}
          onSuccess={() => handlePinSuccess(pinAction)}
          user={user}
        />
        <DraftsDialog 
          isOpen={isDraftsOpen}
          onClose={() => setIsDraftsOpen(false)}
          drafts={drafts}
          onLoad={handleLoadDraft}
          onDelete={handleDeleteDraft}
        />
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          totalAmount={total}
          onPaymentSuccess={handlePaymentSuccess}
          initialTab={paymentMode}
        />
        <CashDrawerModal
          isOpen={isCashDrawerModalOpen}
          onClose={() => setCashDrawerModalOpen(false)}
          onSubmit={handleCashDrawerAction}
        />
        <CardTerminalModal
          isOpen={isCardTerminalModalOpen}
          onClose={() => setCardTerminalModalOpen(false)}
          onSubmit={handleCardTerminalAction}
        />
        <SalesHistoryDialog
          isOpen={isSalesHistoryOpen}
          onClose={() => setIsSalesHistoryOpen(false)}
          sales={recentSales}
          onReprint={(sale) => handlePrint('final-receipt', sale)}
        />
        <DiscountTaxModal
          isOpen={isDiscountModalOpen}
          onClose={() => setIsDiscountModalOpen(false)}
          onApply={handleApplyDiscount}
          title="Apply Discount"
          type="discount"
          initialValue={discount}
        />
        <DiscountTaxModal
          isOpen={isTaxModalOpen}
          onClose={() => setIsTaxModalOpen(false)}
          onApply={handleApplyTax}
          title="Apply Tax"
          type="tax"
          initialValue={taxRate}
        />
      </div>
      {printData && <PrintView ref={printRef} type={printData.type} data={printData.data} />}
    </>
  );
};

const AppBar = ({ time, isOnline, user, toggleTheme, currentTheme, onBackToDashboard, onLogout, shiftRegister, onShiftClose, recentSales, products, handlePrint }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCloseFormOpen, setIsCloseFormOpen] = useState(false);
  const [closingCash, setClosingCash] = useState('');
  const [isZReportOpen, setIsZReportOpen] = useState(false);
  const [reportData, setReportData] = useState(null);

  const generateReportData = () => {
    if (!shiftRegister) return null;

    const shiftSales = recentSales.filter(sale => new Date(sale.id) >= new Date(shiftRegister.openedAt));
    
    const totalSoldItems = shiftSales.reduce((acc, sale) => {
        sale.items.forEach(item => {
            acc[item.id] = (acc[item.id] || 0) + item.qty;
        });
        return acc;
    }, {});

    const itemsWithDetails = Object.keys(totalSoldItems).map(id => {
        const product = products.find(p => p.id.toString() === id.toString());
        return {
            id,
            name: product?.name || 'Unknown Item',
            qty: totalSoldItems[id],
            brand: product?.brand || 'N/A',
            category: product?.category || 'N/A',
        };
    });

    const byBrand = itemsWithDetails.reduce((acc, item) => {
        acc[item.brand] = [...(acc[item.brand] || []), item];
        return acc;
    }, {});

    const byCategory = itemsWithDetails.reduce((acc, item) => {
        acc[item.category] = [...(acc[item.category] || []), item];
        return acc;
    }, { 'Bar': [], 'Kitchen': [], 'Neutral': [] }); // Initialize with known categories

    const paymentBreakdown = shiftSales.reduce((acc, sale) => {
        const method = sale.paymentDetails.method;
        if (method === 'cash') acc.cash += sale.total;
        else if (method === 'card') acc.card += sale.total;
        else if (method === 'transfer') acc.transfer += sale.total;
        return acc;
    }, { cash: 0, card: 0, transfer: 0 });

    const totalCredit = (JSON.parse(localStorage.getItem('loungeDrafts') || '[]'))
        .filter(d => d.isSuspended && new Date(d.updatedAt) >= new Date(shiftRegister.openedAt))
        .reduce((sum, d) => sum + d.total, 0);

    const serviceStaff = [...new Set(shiftSales.map(s => s.waiter).filter(Boolean))].join(', ');
    const cashiers = [...new Set(shiftSales.map(s => s.cashier).filter(Boolean))].join(', ');

    return {
        items: itemsWithDetails,
        byBrand,
        byCategory,
        totalSales: shiftSales.reduce((sum, s) => sum + s.total, 0),
        ...paymentBreakdown,
        totalCredit,
        serviceStaff,
        cashiers,
        shiftRegister,
        user,
        reportType: 'Shift Details'
    };
  };

  const handleOpenReport = (type) => {
    const data = generateReportData();
    if (data) {
      const reportWithType = {...data, reportType: type};
      setReportData(reportWithType);
      if (type === 'Z-Report') {
        setIsZReportOpen(true);
      } else {
        setIsDetailsOpen(true);
      }
    } else {
      toast({ title: "No active shift", description: "Cannot generate a report without an active shift." });
    }
  };

  const handlePrintReport = () => {
    handlePrint('z-report', reportData); // Re-using z-report print view
  };

  const handleExportReport = () => {
    toast({ title: "Feature coming soon!", description: "Export functionality is not yet implemented." });
  };

  const handleCloseRegister = (e) => {
    e.preventDefault();
    const cashAmount = parseFloat(closingCash);
     if (isNaN(cashAmount) || cashAmount < 0) {
      toast({ title: "Invalid Amount", description: "Please enter a valid closing cash amount.", variant: "destructive" });
      return;
    }
    const updatedRegister = {
      ...shiftRegister,
      closedAt: new Date().toISOString(),
      closingCash: cashAmount,
      difference: cashAmount - (shiftRegister.expectedCash || shiftRegister.openingCash),
    };
    
    const shiftHistory = JSON.parse(localStorage.getItem('loungeShiftHistory') || '[]');
    shiftHistory.push(updatedRegister);
    localStorage.setItem('loungeShiftHistory', JSON.stringify(shiftHistory));
    
    localStorage.removeItem('loungeShiftRegister');
    toast({ title: "Register Closed!", description: `Shift ended.` });
    setIsCloseFormOpen(false);
    onShiftClose();
    onBackToDashboard();
  };

  const notifications = [
    { id: 1, text: "Welcome to Stanforde Laze POS!", time: "9:00 AM" },
    { id: 2, text: "System updated to version 1.1.0.", time: "Yesterday" },
  ];

  return (
    <header className="flex items-center justify-between h-16 px-4 bg-card border-b shrink-0">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBackToDashboard} aria-label="Back to Dashboard">
          <ArrowLeft className="w-6 h-6 text-primary" />
        </Button>
        <Coffee className="w-6 h-6 text-primary" />
        <span className="font-bold text-lg">{user.branch}</span>
      </div>
      <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
        <span>{time.toLocaleTimeString()}</span>
        {isOnline ? <Wifi className="w-4 h-4 text-green-500" /> : <WifiOff className="w-4 h-4 text-destructive" />}
      </div>
      <div className="flex items-center gap-4">
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="View Shift Register Details" onClick={() => handleOpenReport('Shift Details')}>
              <Eye className="w-5 h-5" />
            </Button>
          </DialogTrigger>
          <ReportDialogContent reportData={reportData} onClose={() => setIsDetailsOpen(false)} onPrint={handlePrintReport} onExport={handleExportReport} />
        </Dialog>

        <Dialog open={isCloseFormOpen} onOpenChange={setIsCloseFormOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Close Shift Register">
              <X className="w-5 h-5 text-red-500" />
            </Button>
          </DialogTrigger>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Close Shift Register</DialogTitle>
                  <DialogDescription>Count the cash in the drawer and enter the final amount.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCloseRegister} className="space-y-4 pt-4">
                  <p className="text-sm text-muted-foreground">Expected amount: <span className="font-bold text-foreground">${(shiftRegister?.expectedCash || shiftRegister?.openingCash || 0).toFixed(2)}</span></p>
                  <div className="space-y-2">
                      <Label htmlFor="closing-cash">Counted Cash Amount</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="closing-cash" type="number" step="0.01" value={closingCash} onChange={(e) => setClosingCash(e.target.value)} placeholder="e.g., 4100.50" className="pl-8" required/>
                      </div>
                  </div>
                  <DialogFooter>
                      <Button type="button" variant="ghost" onClick={() => setIsCloseFormOpen(false)}>Cancel</Button>
                      <Button type="submit" variant="destructive">Confirm & Close Shift</Button>
                  </DialogFooter>
              </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isZReportOpen} onOpenChange={setIsZReportOpen}>
          <DialogTrigger asChild>
             <Button variant="ghost" size="icon" aria-label="Z-Report" onClick={() => handleOpenReport('Z-Report')}>
                <Wallet className="w-5 h-5" />
            </Button>
          </DialogTrigger>
          <ReportDialogContent reportData={reportData} onClose={() => setIsZReportOpen(false)} onPrint={handlePrintReport} onExport={handleExportReport} />
        </Dialog>
        
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Notifications">
                  <Bell className="w-5 h-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length > 0 ? (
                    notifications.map(n => (
                        <DropdownMenuItem key={n.id} className="flex flex-col items-start">
                            <p className="text-sm">{n.text}</p>
                            <p className="text-xs text-muted-foreground">{n.time}</p>
                        </DropdownMenuItem>
                    ))
                ) : (
                    <DropdownMenuItem disabled>No new notifications</DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {currentTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-semibold text-primary">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>{user.username} ({user.role})</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" })}>
                        <Info className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  )
};

const ReportDialogContent = ({ reportData, onClose, onPrint, onExport }) => (
    <DialogContent className="max-w-3xl">
        <DialogHeader>
            <DialogTitle>{reportData?.reportType || 'Report'}</DialogTitle>
            <DialogDescription>This report summarizes the financial activity for the current shift.</DialogDescription>
        </DialogHeader>
        {reportData ? (
        <div className="max-h-[70vh] overflow-y-auto p-1 text-sm">
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-4">
                <InfoItem label="Section" value={reportData.shiftRegister.sectionName} />
                <InfoItem label="Report Generated By" value={reportData.user.username} />
                <InfoItem label="Shift Started" value={new Date(reportData.shiftRegister.openedAt).toLocaleString()} />
                <InfoItem label="Report Time" value={new Date().toLocaleString()} />
            </div>

            <h3 className="font-bold text-lg my-4 border-b pb-2">Sales Summary</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                <InfoItem label="Total Sales" value={`${reportData.totalSales.toFixed(2)}`} className="font-bold text-primary" />
                <InfoItem label="Total Credit Sales" value={`${reportData.totalCredit.toFixed(2)}`} />
                <InfoItem label="Paid by Cash" value={`${reportData.cash.toFixed(2)}`} />
                <InfoItem label="Paid by Card" value={`${reportData.card.toFixed(2)}`} />
                <InfoItem label="Paid by Transfer" value={`${reportData.transfer.toFixed(2)}`} />
            </div>
            
            <h3 className="font-bold text-lg my-4 border-b pb-2">Items Sold ({reportData.items.reduce((sum, i) => sum + i.qty, 0)} total)</h3>
            <div className="space-y-1">
                {reportData.items.map(item => <InfoItem key={item.id} label={item.name} value={item.qty} />)}
            </div>

            <h3 className="font-bold text-lg my-4 border-b pb-2">Sales by Category</h3>
            {Object.entries(reportData.byCategory).map(([category, items]) => (
                <div key={category} className="mb-3">
                    <p className="font-semibold mb-1">{category} ({items.reduce((sum, i) => sum + i.qty, 0)} items)</p>
                    <div className="pl-4 space-y-1 border-l">
                        {items.map(item => <InfoItem key={item.id} label={item.name} value={item.qty} />)}
                    </div>
                </div>
            ))}

            <h3 className="font-bold text-lg my-4 border-b pb-2">Sales by Brand</h3>
             {Object.entries(reportData.byBrand).map(([brand, items]) => (
                <div key={brand} className="mb-3">
                    <p className="font-semibold mb-1">{brand} ({items.reduce((sum, i) => sum + i.qty, 0)} items)</p>
                    <div className="pl-4 space-y-1 border-l">
                        {items.map(item => <InfoItem key={item.id} label={item.name} value={item.qty} />)}
                    </div>
                </div>
            ))}

            <h3 className="font-bold text-lg my-4 border-b pb-2">Staff</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                <InfoItem label="Service Staff" value={reportData.serviceStaff || 'N/A'} />
                <InfoItem label="Cashiers" value={reportData.cashiers || 'N/A'} />
            </div>
        </div>
        ) : <p>No active shift register data to display.</p>}
        <DialogFooter>
          <Button variant="outline" onClick={onExport}><Download className="w-4 h-4 mr-2" /> Export</Button>
          <Button onClick={onPrint}><Printer className="w-4 h-4 mr-2" /> Print Report</Button>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
    </DialogContent>
);

const ProductSidebar = ({ searchTerm, setSearchTerm, activeCategory, setActiveCategory }) => (
  <aside className="w-[320px] bg-card border-r p-4 flex flex-col gap-4">
    <div className="relative">
      <Input 
        placeholder="Search... (⌘K)" 
        className="pl-10" 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
    </div>
    <div className="flex gap-2 flex-wrap">
      {categories.map(c => (
        <Button 
          key={c} 
          variant={activeCategory === c ? 'default' : 'secondary'} 
          size="sm" 
          className="text-xs"
          onClick={() => setActiveCategory(c)}
        >
          {c}
        </Button>
      ))}
    </div>
  </aside>
);

const ProductCard = ({ product, stock, price, onAdd, allowOverselling }) => {
  const isOutOfStock = stock <= 0 && !allowOverselling;

  const handleClick = () => {
    if (!isOutOfStock) {
      onAdd(product);
    }
  };

  return (
    <motion.div whileHover={!isOutOfStock ? { scale: 1.05 } : {}}>
      <Card 
        className={`rounded-xl shadow-md overflow-hidden flex flex-col justify-between relative aspect-square ${isOutOfStock ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        onClick={handleClick}
      >
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <span className="text-white font-bold text-xs bg-destructive px-2 py-0.5 rounded">OUT OF STOCK</span>
          </div>
        )}
        <div className="p-2 flex flex-col flex-grow">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-xs leading-tight">{product.name}</h3>
            <span className="text-[0.6rem] font-bold px-1 py-0.5 rounded-full bg-secondary text-secondary-foreground shrink-0 ml-1">{product.station?.toUpperCase()}</span>
          </div>
          <div className="flex-grow"></div>
          <div className="flex justify-between items-end mt-1">
            <span className="text-sm font-bold text-primary">${(price || 0).toFixed(2)}</span>
            <span className={`text-xs ${stock <= 0 ? 'text-destructive font-semibold' : 'text-muted-foreground'}`}>Stock: {stock === undefined ? 'N/A' : stock}</span>
          </div>
        </div>
        <div className={`text-center p-1 font-semibold text-xs ${isOutOfStock ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'}`}>
          {isOutOfStock ? 'Unavailable' : 'Add to Cart'}
        </div>
      </Card>
    </motion.div>
  );
};

const CartPanel = ({ user, cart, onUpdateQty, onVoid, onPrintItem, subtotal, discountValue, tax, total, currentSection, setCurrentSection, branchSections, currentService, setCurrentService, currentCustomer, setCurrentCustomer, selectedTable, setSelectedTable, onClearCart, tables, onSaveDraft, onViewDrafts, onOpenCashDrawer, onTakePayment, draftCount, editingDraft, onPrintBill, canAcceptPayment, serviceStaffList, selectedStaff, setSelectedStaff, onPrintByCategory, onViewSalesHistory, onEditDiscount, onEditTax, taxRate }) => (
  <aside className="w-[400px] bg-card border-l flex flex-col">
    <div className="p-4 border-b space-y-3">
       {editingDraft && (
        <div className="p-2 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-md text-sm text-center">
          Editing: <span className="font-semibold">{editingDraft.name}</span>
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-full flex justify-between" disabled={true}>
              {branchSections.find(s => s.id === currentSection)?.name || 'Select Section'}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {branchSections.length > 0 ? branchSections.map(section => (
              <DropdownMenuItem key={section.id} onSelect={() => setCurrentSection(section.id)} disabled={true}>
                {section.name}
              </DropdownMenuItem>
            )) : <DropdownMenuItem disabled>No sections in this branch</DropdownMenuItem>}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-full flex justify-between" disabled={!!editingDraft}>
              {currentService || 'Select Service'}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {serviceTypes.map(type => (
              <DropdownMenuItem key={type} onSelect={() => setCurrentService(type)}>
                {type}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-full flex justify-between" disabled={!!editingDraft}>
              {currentCustomer || 'Select Customer'}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {customerTypes.map(type => (
              <DropdownMenuItem key={type} onSelect={() => setCurrentCustomer(type)}>
                {type}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-full flex justify-between items-center" disabled={!!editingDraft}>
              <span className="truncate">{serviceStaffList.find(s => s.id === selectedStaff)?.username || 'Select Staff'}</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {serviceStaffList.map(staff => (
              <DropdownMenuItem key={staff.id} onSelect={() => setSelectedStaff(staff.id)}>
                {staff.username}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={currentService !== 'Dine-in' || !!editingDraft}>
            <Button variant="outline" size="sm" className={`w-full flex justify-between ${selectedTable ? 'border-accent text-accent' : ''}`}>
              {selectedTable ? `Table: ${selectedTable.name}` : 'Select Table'}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {tables.filter(t => t.section === branchSections.find(s => s.id === currentSection)?.name && t.status === 'available').map(table => (
              <DropdownMenuItem 
                key={table.id} 
                onSelect={() => {
                  setSelectedTable(table);
                  toast({ title: `Table ${table.name} selected.` });
                }}
                disabled={table.status === 'occupied' && (!editingDraft || editingDraft.table?.id !== table.id)}
              >
                <span className="flex items-center justify-between w-full">
                  {table.name} 
                  <span className={`text-xs capitalize ${table.status === 'available' ? 'text-green-400' : 'text-red-400'}`}>
                    {table.status}
                  </span>
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {cart.length === 0 ? <p className="text-center text-muted-foreground mt-8">Cart is empty</p> : cart.map(item => (
        <div key={item.id} className="flex items-center bg-background p-2 rounded-lg">
          <div className="flex-1">
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-muted-foreground">${(item.price || 0).toFixed(2)}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onUpdateQty(item.id, -1)}><Minus className="w-4 h-4" /></Button>
            <span className="w-6 text-center font-semibold">{item.qty}</span>
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onUpdateQty(item.id, 1)}><Plus className="w-4 h-4" /></Button>
          </div>
          <p className="w-20 text-right font-semibold">${((item.price || 0) * item.qty).toFixed(2)}</p>
          <div className="flex items-center ml-1">
            <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground" onClick={() => onPrintItem(item)}><Printer className="w-4 h-4" /></Button>
            <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => onVoid(item.id)}><X className="w-4 h-4" /></Button>
          </div>
        </div>
      ))}
    </div>
    <div className="p-2 border-t space-y-2 bg-background/50">
      <div className="space-y-0.5 text-xs">
        <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-muted-foreground">Discount</span>
            <Button variant="ghost" size="icon" className="h-4 w-4 ml-1" onClick={onEditDiscount}>
              <Pencil className="h-3 w-3" />
            </Button>
          </div>
          <span className="text-destructive">-${discountValue.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-muted-foreground">Tax ({taxRate}%)</span>
            <Button variant="ghost" size="icon" className="h-4 w-4 ml-1" onClick={onEditTax}>
              <Pencil className="h-3 w-3" />
            </Button>
          </div>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-base"><span className="text-foreground">Total</span><span>${total.toFixed(2)}</span></div>
      </div>
      <div className="flex gap-1">
        <Button size="sm" variant="destructive" className="flex-1 h-8 text-xs" onClick={onClearCart}><Trash2 className="w-3 h-3 mr-1"/> Clear</Button>
        <Button size="sm" className="flex-1 h-8 text-xs" onClick={onPrintBill}><Printer className="w-3 h-3 mr-1"/> Bill</Button>
        <Button 
          className="flex-1 h-8 text-xs bg-accent hover:bg-accent/90 text-accent-foreground font-bold" 
          onClick={() => onTakePayment('cash')}
          disabled={!canAcceptPayment}
          title={!canAcceptPayment ? "You do not have permission to accept payments" : "Process Payment"}
        >
          Payment
        </Button>
      </div>
      <div className="grid grid-cols-6 gap-1">
        <Button size="icon" variant="secondary" className="h-8 w-full" onClick={onSaveDraft} title="Save Draft"><FileText className="w-4 h-4" /></Button>
        <Button size="icon" variant="secondary" className="h-8 w-full relative" onClick={onViewDrafts} title="View Drafts">
          <FolderOpen className="w-4 h-4" />
          {draftCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {draftCount}
            </span>
          )}
        </Button>
        <Button size="icon" variant="secondary" className="h-8 w-full" onClick={() => onPrintByCategory('bar')} title="Print Bar Items"><Beer className="w-4 h-4" /></Button>
        <Button size="icon" variant="secondary" className="h-8 w-full" onClick={() => onPrintByCategory('kitchen')} title="Print Kitchen Items"><ChefHat className="w-4 h-4" /></Button>
        <Button size="icon" variant="secondary" className="h-8 w-full" onClick={onViewSalesHistory} title="View Sales History"><Wallet className="w-4 h-4" /></Button>
        <Button size="icon" variant="secondary" className="h-8 w-full" onClick={() => onTakePayment('multiple')} disabled={!canAcceptPayment} title="Multiple Payment Methods"><Layers className="w-4 h-4" /></Button>
      </div>
    </div>
  </aside>
);

const DraftsDialog = ({ isOpen, onClose, drafts, onLoad, onDelete }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Saved Drafts & Suspended Bills</DialogTitle>
        <DialogDescription>Select an item to load, edit, or delete.</DialogDescription>
      </DialogHeader>
      <div className="max-h-[60vh] overflow-y-auto p-1">
        {drafts.length > 0 ? (
          <div className="space-y-3">
            {drafts.sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt)).map(draft => (
              <div key={draft.id} className={`border rounded-lg p-3 flex justify-between items-center ${draft.isSuspended ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' : ''}`}>
                <div>
                  <p className="font-semibold">{draft.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {draft.cart.length} items - {draft.service}
                    {draft.table && ` - Table: ${draft.table.name}`}
                    {draft.isSuspended && ` - Total: ${draft.total.toFixed(2)}`}
                    {draft.waiter && ` | Waiter: ${draft.waiter}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last updated: {new Date(draft.updatedAt).toLocaleString()}
                    {draft.customerDetails?.phone && ` | Phone: ${draft.customerDetails.phone}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => onLoad(draft)}>Load</Button>
                  <Button size="sm" variant="destructive" onClick={() => onDelete(draft.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-10">No saved drafts or suspended bills.</p>
        )}
      </div>
      <DialogFooter>
        <Button onClick={onClose}>Close</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const SalesHistoryDialog = ({ isOpen, onClose, sales, onReprint }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>Recent Sales</DialogTitle>
        <DialogDescription>View and reprint receipts from recent transactions.</DialogDescription>
      </DialogHeader>
      <div className="max-h-[60vh] overflow-y-auto p-1">
        {sales.length > 0 ? (
          <div className="space-y-3">
            {sales.map(sale => (
              <div key={sale.id} className="border rounded-lg p-3 flex justify-between items-center">
                <div>
                  <p className="font-semibold">Receipt #{sale.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {sale.items.length} items - Total: ${sale.total.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(sale.id).toLocaleString()} | Cashier: {sale.cashier}
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={() => onReprint(sale)}>
                  <Printer className="w-4 h-4 mr-2" />
                  Reprint
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-10">No recent sales to display.</p>
        )}
      </div>
      <DialogFooter>
        <Button onClick={onClose}>Close</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const DiscountTaxModal = ({ isOpen, onClose, onApply, title, type, initialValue }) => {
  const [currentType, setCurrentType] = useState(type === 'discount' ? initialValue.type : 'percentage');
  const [value, setValue] = useState(type === 'discount' ? initialValue.value : initialValue);

  useEffect(() => {
    if (isOpen) {
      if (type === 'discount') {
        setCurrentType(initialValue.type);
        setValue(initialValue.value);
      } else {
        setValue(initialValue);
      }
    }
  }, [isOpen, initialValue, type]);

  const handleApply = () => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0) {
      toast({ title: 'Invalid Value', description: 'Please enter a non-negative number.', variant: 'destructive' });
      return;
    }
    if (type === 'discount') {
      onApply({ type: currentType, value: numValue });
    } else {
      onApply(numValue);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {type === 'discount' ? 'Set a discount for the current order.' : 'Set the tax rate for the current order.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {type === 'discount' && (
            <ToggleGroup
              type="single"
              value={currentType}
              onValueChange={(val) => { if(val) setCurrentType(val); }}
              className="grid grid-cols-2"
            >
              <ToggleGroupItem value="percentage" aria-label="Percentage discount">
                Percentage (%)
              </ToggleGroupItem>
              <ToggleGroupItem value="fixed" aria-label="Fixed amount discount">
                Fixed ($)
              </ToggleGroupItem>
            </ToggleGroup>
          )}
          <div>
            <Label htmlFor="value-input">{type === 'discount' ? 'Discount Value' : 'Tax Rate (%)'}</Label>
            <Input
              id="value-input"
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={type === 'discount' ? (currentType === 'percentage' ? 'e.g., 10' : 'e.g., 5.00') : 'e.g., 7.5'}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleApply}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


const InfoItem = ({ label, value, className }) => (
  <div className="flex justify-between items-center py-2 border-b border-border/50">
    <p className="text-muted-foreground">{label}</p>
    <p className={`font-semibold ${className}`}>{value}</p>
  </div>
);

export default POSInterface;
  