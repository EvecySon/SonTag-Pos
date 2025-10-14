import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  FileText, 
  AlertCircle, 
  RefreshCw, 
  DollarSign, 
  CreditCard, 
  MinusCircle,
  Calendar as CalendarIcon,
  ChevronDown
} from 'lucide-react';
import { format, subDays } from "date-fns";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { cn } from "@/lib/utils";

const colorPalette = [
  '#3b82f6', '#22c55e', '#a855f7', '#f97316', '#eab308', 
  '#ec4899', '#14b8a6', '#6366f1', '#ef4444', '#84cc16'
];

const generateRandomSales = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const StatCard = ({ icon: Icon, title, value, color, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-shadow">
        <CardContent className="p-4 flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(value)}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/90 dark:bg-black/90 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                <p className="label font-bold text-gray-800 dark:text-gray-200">{`${label}`}</p>
                {payload.map((pld) => (
                    <div key={pld.dataKey} style={{ color: pld.color }} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: pld.color }}></div>
                        <span>{pld.name}: {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(pld.value)}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const formatYAxis = (tick) => {
    if (tick >= 1000000) {
        return `${(tick / 1000000).toFixed(1)}M`;
    }
    if (tick >= 1000) {
        return `${(tick/1000).toFixed(0)}K`;
    }
    return tick;
};

const Overview = ({ user }) => {
  const [locations, setLocations] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [fullSalesData, setFullSalesData] = useState([]);
  const [filteredSalesData, setFilteredSalesData] = useState([]);
  const [stats, setStats] = useState([]);
  const [date, setDate] = useState({
    from: subDays(new Date(), 29),
    to: new Date(),
  });

  useEffect(() => {
    const savedBranches = JSON.parse(localStorage.getItem('loungeBranches')) || [];
    setBranches(savedBranches);

    const allLocations = [{ id: 'all', name: 'All Locations' }, ...savedBranches];
    setLocations(allLocations);
    
    if (savedBranches.length > 0) {
      setSelectedLocation('all');
    }
  }, []);

  useEffect(() => {
    const today = new Date();
    const historicalData = [];
    for (let i = 365; i >= 0; i--) {
      const date = subDays(today, i);
      const entry = { date: date };
      branches.forEach(branch => {
        entry[branch.name] = generateRandomSales(20000, 150000);
      });
      entry['All Locations'] = branches.reduce((total, branch) => total + entry[branch.name], 0);
      historicalData.push(entry);
    }
    setFullSalesData(historicalData);
  }, [branches]);

  useEffect(() => {
    const filteredData = fullSalesData.filter(d => {
      const entryDate = new Date(d.date);
      const from = date.from ? new Date(date.from.setHours(0,0,0,0)) : null;
      const to = date.to ? new Date(date.to.setHours(23,59,59,999)) : null;
      if (from && to) return entryDate >= from && entryDate <= to;
      if (from) return entryDate >= from;
      if (to) return entryDate <= to;
      return true;
    }).map(d => ({...d, date: format(d.date, 'dd-MMM')}));
    
    setFilteredSalesData(filteredData);

    const totals = filteredData.reduce((acc, day) => {
        acc.totalSales += day['All Locations'] || 0;
        return acc;
    }, { totalSales: 0 });

    const invoiceDue = totals.totalSales * (generateRandomSales(1, 5) / 100);
    const totalPurchase = totals.totalSales * (generateRandomSales(40, 60) / 100);
    const purchaseDue = totalPurchase * (generateRandomSales(1, 3) / 100);
    const expense = totals.totalSales * (generateRandomSales(5, 10) / 100);
    const netSales = totals.totalSales - invoiceDue;

    setStats([
      { title: 'Total Sales', value: totals.totalSales, icon: ShoppingCart, color: 'bg-cyan-500' },
      { title: 'Net Sales', value: netSales, icon: FileText, color: 'bg-green-500' },
      { title: 'Invoice Due', value: invoiceDue, icon: AlertCircle, color: 'bg-orange-500' },
      { title: 'Total Sell Return', value: 0, icon: RefreshCw, color: 'bg-red-500' },
      { title: 'Total Purchase', value: totalPurchase, icon: DollarSign, color: 'bg-cyan-500' },
      { title: 'Purchase Due', value: purchaseDue, icon: CreditCard, color: 'bg-orange-500' },
      { title: 'Total Purchase Return', value: 0, icon: RefreshCw, color: 'bg-red-500' },
      { title: 'Expense', value: expense, icon: MinusCircle, color: 'bg-red-500' },
    ]);

  }, [fullSalesData, date, branches]);
  
  const chartLocations = branches.map((branch, index) => ({
    name: branch.name,
    color: colorPalette[index % colorPalette.length],
  }));

  if (selectedLocation === 'all') {
    chartLocations.unshift({ name: 'All Locations', color: '#ef4444'});
  }

  const displayedChartKeys = selectedLocation === 'all' 
    ? chartLocations.map(l => l.name)
    : [locations.find(l => l.id === selectedLocation)?.name];

  return (
    <div className="space-y-6">
      <div className="bg-dashboard-header text-white p-6 -m-6 mb-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold">Welcome {user.username},</h1>
          <div className="flex items-center gap-4">
            <div className="w-56">
               <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="bg-white/20 border-white/30 text-white">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map(loc => (
                      <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"secondary"}
                  className={cn(
                    "w-[300px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 p-6">
        {stats.map((stat, index) => (
          <StatCard key={stat.title} {...stat} index={index} />
        ))}
      </div>

       <div className="p-6 pt-0">
         <Card className="bg-white dark:bg-slate-800">
           <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">Sales Overview</h2>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={filteredSalesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                     <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.1)" />
                     <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                     <YAxis tickFormatter={formatYAxis} fontSize={12} tickLine={false} axisLine={false} label={{ value: 'Sales (NGN)', angle: -90, position: 'insideLeft' }}/>
                     <Tooltip content={<CustomTooltip />} />
                     <Legend />
                     {chartLocations
                        .filter(loc => displayedChartKeys.includes(loc.name))
                        .map(loc => (
                          <Line key={loc.name} type="monotone" dataKey={loc.name} stroke={loc.color} strokeWidth={2} dot={false} activeDot={{ r: 6 }} name={loc.name} />
                     ))}
                   </LineChart>
                </ResponsiveContainer>
              </div>
           </CardContent>
         </Card>
       </div>

    </div>
  );
};

export default Overview;