import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  PackagePlus,
  Flame,
  FileText,
  CreditCard,
  BookOpen,
  ClipboardList,
  Utensils,
  UserCheck,
  History,
  ArrowRight,
  TrendingDown,
  ArrowLeft,
  CalendarDays,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReportViewer from '@/components/dashboard/reports/ReportViewer';

const reportCategories = [
  {
    title: 'Profit & Sales Reports',
    reports: [
      { id: 'profit-loss', name: 'Profit / Loss Report', icon: TrendingUp, description: 'Analyze gross and net profit margins.' },
      { id: 'purchase-sale', name: 'Purchase & Sale Report', icon: ShoppingCart, description: 'Compare buying and selling volumes.' },
      { id: 'product-sell', name: 'Product Sell Report', icon: BarChart3, description: 'Detailed breakdown of items sold.' },
      { id: 'trending-product', name: 'Trending Product Report', icon: Flame, description: 'Identify your most popular items.' },
    ],
  },
  {
    title: 'Stock & Inventory Reports',
    reports: [
      { id: 'stock', name: 'Stock Report', icon: Package, description: 'Current stock levels and valuation.' },
      { id: 'stock-adjustment', name: 'Stock Adjustment Report', icon: PackagePlus, description: 'Track all stock modifications.' },
      { id: 'items', name: 'Items Report', icon: FileText, description: 'Comprehensive list of all products.' },
      { id: 'product-purchase', name: 'Product Purchase Report', icon: TrendingDown, description: 'History of all purchased products.' },
    ],
  },
  {
    title: 'Payment & Expense Reports',
    reports: [
      { id: 'purchase-payment', name: 'Purchase Payment Report', icon: CreditCard, description: 'Track payments made to suppliers.' },
      { id: 'sell-payment', name: 'Sell Payment Report', icon: DollarSign, description: 'Consolidated report of all sales payments.' },
      { id: 'expense', name: 'Expense Report', icon: BookOpen, description: 'Log of all operational expenses.' },
    ],
  },
  {
    title: 'Staff & Customer Reports',
    reports: [
      { id: 'supplier-customer', name: 'Supplier & Customer Report', icon: Users, description: 'Manage supplier and customer data.' },
      { id: 'customer-group', name: 'Customer Group Report', icon: Users, description: 'Analyze sales by customer segments.' },
      { id: 'staff', name: 'Staff Report', icon: UserCheck, description: 'Overview of staff performance and activity.' },
      { id: 'shift-register', name: 'Shift Register Report', icon: ClipboardList, description: 'Detailed logs of all shifts.' },
      { id: 'leave', name: 'Leave Report', icon: CalendarDays, description: 'Summary of all staff leave.' },
    ],
  },
  {
    title: 'Operational Reports',
    reports: [
      { id: 'table', name: 'Table Report', icon: Utensils, description: 'Analyze table turnover and sales.' },
      { id: 'activity-log', name: 'Activity Log', icon: History, description: 'Chronological log of all system activities.' },
    ],
  },
];

const ReportCard = ({ report, onSelect }) => {
  const Icon = report.icon;
  return (
    <motion.div
      whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
      className="cursor-pointer"
      onClick={() => onSelect(report)}
    >
      <Card className="glass-effect h-full flex flex-col">
        <CardHeader className="flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold">{report.name}</CardTitle>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
            <Icon className="w-5 h-5" />
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground">{report.description}</p>
        </CardContent>
        <div className="p-4 pt-0">
          <Button variant="ghost" className="w-full justify-start p-0 h-auto text-primary hover:text-primary">
            View Report <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

const Reports = ({ user }) => {
  const [viewingReport, setViewingReport] = useState(null);

  if (viewingReport) {
    return (
      <div>
        <Button onClick={() => setViewingReport(null)} variant="outline" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Reports
        </Button>
        <ReportViewer report={viewingReport} user={user} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold gradient-text mb-2">Reports Dashboard</h2>
        <p className="text-muted-foreground">Analyze your business performance with detailed reports.</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="all">All Reports</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="stock">Stock</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="people">Staff & Customers</TabsTrigger>
          <TabsTrigger value="ops">Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {reportCategories.map((category, index) => (
            <div key={index} className="mb-8">
              <h3 className="text-2xl font-semibold mb-4">{category.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {category.reports.map((report, reportIndex) => (
                  <ReportCard key={reportIndex} report={report} onSelect={setViewingReport} />
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="sales" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {reportCategories.find(c => c.title.includes('Sales')).reports.map((report, reportIndex) => (
              <ReportCard key={reportIndex} report={report} onSelect={setViewingReport} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stock" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {reportCategories.find(c => c.title.includes('Stock')).reports.map((report, reportIndex) => (
              <ReportCard key={reportIndex} report={report} onSelect={setViewingReport} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {reportCategories.find(c => c.title.includes('Payment')).reports.map((report, reportIndex) => (
              <ReportCard key={reportIndex} report={report} onSelect={setViewingReport} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="people" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {reportCategories.find(c => c.title.includes('Staff')).reports.map((report, reportIndex) => (
              <ReportCard key={reportIndex} report={report} onSelect={setViewingReport} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ops" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {reportCategories.find(c => c.title.includes('Operational')).reports.map((report, reportIndex) => (
              <ReportCard key={reportIndex} report={report} onSelect={setViewingReport} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;