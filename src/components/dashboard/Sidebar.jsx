
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Home, BarChart2, Package, Users, Shield, ShoppingCart, Utensils, Beer, Building, UserCheck, HardHat, Receipt, Settings, Waypoints, Tag, X, ClipboardList as AddressBook } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Sidebar = ({ activeTab, setActiveTab, isOpen, setOpen }) => {
  const navItems = [
    { name: 'overview', icon: Home, label: 'Overview' },
    { name: 'orders', icon: ShoppingCart, label: 'Order Management' },
    { name: 'tables', icon: Utensils, label: 'Table Management' },
    { name: 'products', icon: Beer, label: 'Product Management' },
    { name: 'inventory', icon: Package, label: 'Inventory' },
    { name: 'production', icon: HardHat, label: 'Production' },
    { name: 'purchase', icon: Receipt, label: 'Purchase' },
    { name: 'sell', icon: Tag, label: 'Sell Management' },
    { name: 'staff', icon: Users, label: 'User Management' },
    { name: 'contacts', icon: AddressBook, label: 'Contacts' },
    { name: 'roles', icon: Shield, label: 'Roles & Permissions' },
    { name: 'hrm', icon: UserCheck, label: 'HRM' },
    { name: 'shift-register', icon: Waypoints, label: 'Shift Register' },
    { name: 'branches', icon: Building, label: 'Branches' },
    { name: 'reports', icon: BarChart2, label: 'Reports' },
    { name: 'settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <>
      <div className="hidden lg:block">
        <NavContent navItems={navItems} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed top-0 left-0 h-full w-72 bg-card text-card-foreground z-50 lg:hidden"
            >
              <NavContent navItems={navItems} activeTab={activeTab} setActiveTab={setActiveTab} setOpen={setOpen} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const NavContent = ({ navItems, activeTab, setActiveTab, setOpen }) => {
  return (
    <div className="h-screen flex flex-col border-r shadow-lg bg-white dark:bg-slate-800">
      <div className="flex items-center justify-between p-4 h-[65px] border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Utensils className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Stanforde Laze</h1>
        </div>
        {setOpen && (
           <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="lg:hidden">
            <X className="w-5 h-5"/>
           </Button>
        )}
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map(item => <NavItem key={item.name} item={item} isActive={activeTab === item.name} onClick={() => setActiveTab(item.name)} />)}
      </nav>
      <div className="p-4 border-t">
        <button onClick={() => setActiveTab('pos')} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white h-12 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
          <BarChart2 className="w-5 h-5" />
          <span>Go to POS</span>
        </button>
      </div>
    </div>
  );
};


const NavItem = ({ item, isActive, onClick }) => {
  const { icon: Icon, label } = item;
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <button 
        onClick={onClick} 
        className={`w-full flex items-center h-11 px-4 rounded-lg transition-all duration-200 text-sm ${
          isActive 
            ? 'bg-blue-100 text-blue-600 font-semibold dark:bg-blue-900/50 dark:text-blue-300' 
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200'
        }`}
      >
        <Icon className="w-5 h-5 mr-4 flex-shrink-0" />
        <span className="truncate">{label}</span>
      </button>
    </motion.div>
  );
};

export default Sidebar;
