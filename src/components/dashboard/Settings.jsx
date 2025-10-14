import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Bell, Database, Printer, FileText, Briefcase, Percent, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import CategoryManagement from '@/components/dashboard/settings/CategoryManagement';
import BrandManagement from '@/components/dashboard/settings/BrandManagement';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const Settings = ({ theme, setTheme, user, setActiveTab }) => {
  const [printerType, setPrinterType] = React.useState('thermal');
  const [printerAddress, setPrinterAddress] = React.useState('');
  const [invoicePrefix, setInvoicePrefix] = React.useState('INV-');
  const [invoiceStartNumber, setInvoiceStartNumber] = React.useState(1);
  const [invoiceLayout, setInvoiceLayout] = React.useState('default');

  React.useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('loungeSettings'));
    if (savedSettings) {
      setPrinterType(savedSettings.printerType || 'thermal');
      setPrinterAddress(savedSettings.printerAddress || '');
      setInvoicePrefix(savedSettings.invoicePrefix || 'INV-');
      setInvoiceStartNumber(savedSettings.invoiceStartNumber || 1);
      setInvoiceLayout(savedSettings.invoiceLayout || 'default');
    }
  }, []);

  const handleFeatureClick = () => {
    toast({
      title: "🚧 Feature in development!",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const handleSaveSettings = (settingName) => {
    const settingsToSave = JSON.parse(localStorage.getItem('loungeSettings')) || {};
    const updatedSettings = {
      ...settingsToSave,
      printerType,
      printerAddress,
      invoicePrefix,
      invoiceStartNumber,
      invoiceLayout,
    };
    localStorage.setItem('loungeSettings', JSON.stringify(updatedSettings));
    toast({
      title: `✅ ${settingName} Settings Saved`,
      description: "Your settings have been saved locally. Backend integration is ready!",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold gradient-text mb-2">Settings</h2>
        <p className="text-gray-600 dark:text-gray-400">Manage your application settings and preferences.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SettingCard
          title="Business Settings"
          description="Manage name, logo, currency, etc."
          icon={Briefcase}
          onClick={() => setActiveTab('business-settings')}
          delay={0.1}
        />
        <SettingCard
          title="Tax Settings"
          description="Manage tax rates for purchase & sell."
          icon={Percent}
          onClick={() => setActiveTab('tax-settings')}
          delay={0.15}
        />
        <SettingCard
          title="Discount Settings"
          description="Create and manage sales discounts."
          icon={Tag}
          onClick={() => setActiveTab('discount-settings')}
          delay={0.2}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <CategoryManagement user={user} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <BrandManagement user={user} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="glass-effect border-2 border-white/30 dark:border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {theme === 'dark' ? <Moon /> : <Sun />}
              Appearance
            </CardTitle>
            <CardDescription>Customize the look and feel of the application.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/20 dark:bg-slate-800/20">
              <Label htmlFor="theme-switch" className="font-semibold text-gray-700 dark:text-gray-300">
                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </Label>
              <div className="flex items-center space-x-2">
                <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <Switch
                  id="theme-switch"
                  checked={theme === 'dark'}
                  onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                />
                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="glass-effect border-2 border-white/30 dark:border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Printer />Receipt Printer Settings</CardTitle>
            <CardDescription>Configure your receipt printer for the POS.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="printer-type">Printer Type</Label>
              <Select value={printerType} onValueChange={setPrinterType}>
                <SelectTrigger id="printer-type">
                  <SelectValue placeholder="Select printer type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="thermal">Thermal Printer (80mm)</SelectItem>
                  <SelectItem value="standard">Standard A4 Printer</SelectItem>
                  <SelectItem value="network">Network Printer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="printer-address">Printer Name / IP Address</Label>
              <Input id="printer-address" value={printerAddress} onChange={(e) => setPrinterAddress(e.target.value)} placeholder="e.g., EPSON_TM-T20II or 192.168.1.100" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={handleFeatureClick}>Test Print</Button>
              <Button onClick={() => handleSaveSettings('Printer')}>Save Printer Settings</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="glass-effect border-2 border-white/30 dark:border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText />Invoice Settings</CardTitle>
            <CardDescription>Customize your invoice schemes and layouts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Invoice Scheme</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoice-prefix">Invoice Prefix</Label>
                  <Input id="invoice-prefix" value={invoicePrefix} onChange={(e) => setInvoicePrefix(e.target.value)} placeholder="e.g., INV-" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoice-start">Start Number</Label>
                  <Input id="invoice-start" type="number" value={invoiceStartNumber} onChange={(e) => setInvoiceStartNumber(parseInt(e.target.value, 10))} placeholder="e.g., 1" />
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Invoice Layout</h4>
              <div className="space-y-2">
                <Label htmlFor="invoice-layout">Layout Template</Label>
                <Select value={invoiceLayout} onValueChange={setInvoiceLayout}>
                  <SelectTrigger id="invoice-layout">
                    <SelectValue placeholder="Select layout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default Layout</SelectItem>
                    <SelectItem value="compact">Compact Layout</SelectItem>
                    <SelectItem value="detailed">Detailed Layout</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button onClick={() => handleSaveSettings('Invoice')}>Save Invoice Settings</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Card className="glass-effect border-2 border-white/30 dark:border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell />Notifications</CardTitle>
            <CardDescription>Manage how you receive notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/20 dark:bg-slate-800/20">
              <Label htmlFor="email-notifications" className="text-gray-700 dark:text-gray-300">Email Notifications</Label>
              <Switch id="email-notifications" onClick={handleFeatureClick} />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/20 dark:bg-slate-800/20">
              <Label htmlFor="push-notifications" className="text-gray-700 dark:text-gray-300">Push Notifications</Label>
              <Switch id="push-notifications" disabled />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Card className="glass-effect border-2 border-white/30 dark:border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Database />Data Management</CardTitle>
            <CardDescription>Manage your application data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/20 dark:bg-slate-800/20">
              <div className="flex flex-col">
                <Label className="font-semibold text-gray-700 dark:text-gray-300">Export Data</Label>
                <span className="text-sm text-gray-600 dark:text-gray-400">Export your data to a CSV file.</span>
              </div>
              <Button variant="outline" onClick={handleFeatureClick}>Export</Button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/20 dark:bg-slate-800/20">
              <div className="flex flex-col">
                <Label className="font-semibold text-red-700 dark:text-red-500">Clear Local Data</Label>
                <span className="text-sm text-gray-600 dark:text-gray-400">This will clear all local storage data. This action cannot be undone.</span>
              </div>
              <Button variant="destructive" onClick={handleFeatureClick}>Clear Data</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

const SettingCard = ({ title, description, icon: Icon, onClick, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <Card className="glass-effect border-2 border-white/30 dark:border-slate-700/50 cursor-pointer hover:shadow-lg transition-shadow h-full" onClick={onClick}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  </motion.div>
);

export default Settings;