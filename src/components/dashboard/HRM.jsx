import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCog, Wallet, Calendar, FileText, KeyRound, Eye, EyeOff, UserPlus, Briefcase, Star, X, Check, Plus, Trash2, ArrowLeft, Clock, PhoneOff, CalendarPlus, CalendarClock, PlayCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const HRM = ({ user }) => {
    const [activeModule, setActiveModule] = useState(null);
    const [overridePin, setOverridePin] = useState('');
    const [graceWindow, setGraceWindow] = useState(5);
    const [showPin, setShowPin] = useState(false);
    const [userPermissions, setUserPermissions] = useState([]);

    useEffect(() => {
      const savedSettings = JSON.parse(localStorage.getItem('loungeSettings'));
      if (savedSettings) {
        setOverridePin(savedSettings.overridePin || '');
        setGraceWindow(savedSettings.graceWindow || 5);
      }
      
      const allRoles = JSON.parse(localStorage.getItem('loungeRoles') || '[]');
      const currentUserRole = allRoles.find(r => r.name === user.role);
      if (currentUserRole) {
        setUserPermissions(currentUserRole.permissions);
      }
    }, [user.role]);

    const handleSavePinSettings = () => {
      const settingsToSave = JSON.parse(localStorage.getItem('loungeSettings')) || {};
      const updatedSettings = {
        ...settingsToSave,
        overridePin,
        graceWindow,
      };
      localStorage.setItem('loungeSettings', JSON.stringify(updatedSettings));
      toast({
        title: `✅ Override PIN Settings Saved`,
        description: "Your settings have been saved locally.",
      });
    };

    const generateRandomPin = () => {
      const pin = Math.floor(1000 + Math.random() * 9000).toString();
      setOverridePin(pin);
      toast({ title: "New PIN Generated", description: "Don't forget to save your settings." });
    };

    const hrmModules = [
        { id: 'shift', title: 'Shift Management', icon: Clock, description: 'Assign and manage staff shifts.' },
        { id: 'payroll', title: 'Payroll', icon: Wallet, description: 'Manage salaries, deductions, and pay slips.' },
        { id: 'leave', title: 'Leave Management', icon: Calendar, description: 'Track employee leave requests and balances.' },
        { id: 'recruitment', title: 'Recruitment', icon: UserCog, description: 'Manage job openings and candidate applications.' },
        { id: 'performance', title: 'Performance', icon: FileText, description: 'Conduct employee performance reviews.' },
    ];
    
    const canManagePin = userPermissions.includes('manage_override_pin') || userPermissions.includes('all');

    const renderContent = () => {
        if (activeModule) {
            return <ModuleView module={activeModule} onBack={() => setActiveModule(null)} />;
        }

        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold gradient-text mb-2">Human Resource Management</h2>
                    <p className="text-gray-600 dark:text-gray-400">Oversee all aspects of your workforce</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hrmModules.map((module, index) => {
                    const Icon = module.icon;
                    return (
                        <motion.div
                        key={module.title}
                        whileHover={{ scale: 1.03, y: -5 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        >
                        <Card className="glass-effect border-2 border-white/30 dark:border-slate-700/50 h-full flex flex-col">
                            <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                                <Icon className="w-6 h-6 text-white" />
                                </div>
                                <CardTitle>{module.title}</CardTitle>
                            </div>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col justify-between">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{module.description}</p>
                            <Button
                                variant="outline"
                                onClick={() => setActiveModule(module)}
                            >
                                Manage {module.title}
                            </Button>
                            </CardContent>
                        </Card>
                        </motion.div>
                    );
                    })}
                </div>
                
                {canManagePin && (
                    <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                    >
                    <Card className="glass-effect border-2 border-white/30 dark:border-slate-700/50">
                        <CardHeader>
                        <CardTitle className="flex items-center gap-2"><KeyRound />Override/Void PIN</CardTitle>
                        <CardDescription>Manage the master PIN for authorizing sensitive actions like voiding items.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                            <Label htmlFor="override-pin-hrm">Master PIN</Label>
                            <div className="relative">
                                <Input id="override-pin-hrm" type={showPin ? 'text' : 'password'} value={overridePin} onChange={(e) => setOverridePin(e.target.value)} placeholder="4-digit PIN" />
                                <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => setShowPin(!showPin)}>
                                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </Button>
                            </div>
                            </div>
                            <div className="space-y-2">
                            <Label htmlFor="grace-window-hrm">Grace Window (seconds)</Label>
                            <Input id="grace-window-hrm" type="number" value={graceWindow} onChange={(e) => setGraceWindow(parseInt(e.target.value, 10))} placeholder="e.g., 5" />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <Button variant="outline" onClick={generateRandomPin}>Generate Random PIN</Button>
                            <Button onClick={handleSavePinSettings}>Save PIN Settings</Button>
                        </div>
                        </CardContent>
                    </Card>
                    </motion.div>
                )}
            </div>
        );
    }

    return <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>;
};

const ModuleView = ({ module, onBack }) => {
    const renderModuleContent = () => {
        switch (module.id) {
            case 'shift': return <ShiftManagement />;
            case 'payroll': return <PayrollManagement />;
            case 'leave': return <LeaveManagement />;
            case 'recruitment': return <RecruitmentManagement />;
            case 'performance': return <PerformanceManagement />;
            default: return <p>Module not found.</p>;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex items-center gap-4 mb-6">
                <Button variant="outline" size="icon" onClick={onBack}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h2 className="text-3xl font-bold gradient-text">{module.title}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{module.description}</p>
                </div>
            </div>
            {renderModuleContent()}
        </motion.div>
    );
};

const ShiftManagement = () => {
    const [staff, setStaff] = useState([]);
    const [shifts, setShifts] = useState([]);

    useEffect(() => {
        const savedStaff = JSON.parse(localStorage.getItem('loungeUsers') || '[]');
        setStaff(savedStaff);
        const savedShifts = JSON.parse(localStorage.getItem('loungeShifts') || '["Morning", "Evening", "Night"]');
        setShifts(savedShifts);
    }, []);

    const handleShiftChange = (staffId, newShift) => {
        const updatedStaff = staff.map(s => s.id === staffId ? { ...s, shift: newShift } : s);
        setStaff(updatedStaff);
        localStorage.setItem('loungeUsers', JSON.stringify(updatedStaff));
        toast({ title: "Shift Updated", description: `Shift for ${updatedStaff.find(s => s.id === staffId).username} has been updated.` });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Staff Shifts</CardTitle>
                <CardDescription>Assign shifts to your staff members.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Staff Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Current Shift</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {staff.map(s => (
                            <TableRow key={s.id}>
                                <TableCell>{s.username}</TableCell>
                                <TableCell>{s.role}</TableCell>
                                <TableCell>
                                    <Select value={s.shift || ''} onValueChange={(value) => handleShiftChange(s.id, value)}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Assign Shift" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {shifts.map(shift => <SelectItem key={shift} value={shift}>{shift}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

const PayrollManagement = () => {
    const [staff, setStaff] = useState([]);

    useEffect(() => {
        const savedStaff = JSON.parse(localStorage.getItem('loungeUsers') || '[]');
        setStaff(savedStaff);
    }, []);

    const handleSalaryChange = (staffId, newSalary) => {
        const updatedStaff = staff.map(s => s.id === staffId ? { ...s, salary: parseFloat(newSalary) || 0 } : s);
        setStaff(updatedStaff);
    };

    const handleSaveSalaries = () => {
        localStorage.setItem('loungeUsers', JSON.stringify(staff));
        toast({ title: "Salaries Saved", description: "Staff salary information has been updated." });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Payroll</CardTitle>
                <CardDescription>Set basic monthly salaries for your staff.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Staff Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Salary ($)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {staff.map(s => (
                            <TableRow key={s.id}>
                                <TableCell>{s.username}</TableCell>
                                <TableCell>{s.role}</TableCell>
                                <TableCell>
                                    <Input 
                                        type="number" 
                                        value={s.salary || ''} 
                                        onChange={(e) => handleSalaryChange(s.id, e.target.value)}
                                        className="w-[150px]"
                                        placeholder="Enter salary"
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <DialogFooter className="p-6 pt-0">
                <Button onClick={handleSaveSalaries}>Save Salaries</Button>
            </DialogFooter>
        </Card>
    );
};

const LeaveManagement = () => {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [staff, setStaff] = useState([]);
    const [isScheduleLeaveOpen, setIsScheduleLeaveOpen] = useState(false);
    const [isExtendLeaveOpen, setIsExtendLeaveOpen] = useState(false);
    const [leaveToExtend, setLeaveToExtend] = useState(null);
    const [newLeave, setNewLeave] = useState({ staffId: '', startDate: '', endDate: '', reason: '' });
    const [newEndDate, setNewEndDate] = useState('');

    useEffect(() => {
        const savedRequests = JSON.parse(localStorage.getItem('loungeLeaveRequests') || '[]');
        setLeaveRequests(savedRequests);
        const savedStaff = JSON.parse(localStorage.getItem('loungeUsers') || '[]');
        setStaff(savedStaff);
    }, []);

    const updateLeaveRequests = (updatedRequests) => {
        setLeaveRequests(updatedRequests);
        localStorage.setItem('loungeLeaveRequests', JSON.stringify(updatedRequests));
    };

    const handleScheduleLeave = () => {
        if (!newLeave.staffId || !newLeave.startDate || !newLeave.endDate || !newLeave.reason) {
            toast({ title: "Missing Information", description: "Please fill all fields.", variant: "destructive" });
            return;
        }
        const staffMember = staff.find(s => s.id.toString() === newLeave.staffId);
        const newRequest = {
            id: Date.now(),
            staffName: staffMember.username,
            ...newLeave,
            status: 'Scheduled'
        };
        updateLeaveRequests([...leaveRequests, newRequest]);
        toast({ title: "Leave Scheduled", description: `Leave for ${staffMember.username} has been scheduled.` });
        setIsScheduleLeaveOpen(false);
        setNewLeave({ staffId: '', startDate: '', endDate: '', reason: '' });
    };

    const handleStatusChange = (requestId, status) => {
        const updatedRequests = leaveRequests.map(req => req.id === requestId ? { ...req, status } : req);
        updateLeaveRequests(updatedRequests);
        toast({ title: `Leave status updated to "${status}"`, description: "Leave request status has been updated." });
    };

    const handleCallOffLeave = (requestId) => {
        const updatedRequests = leaveRequests.map(req => req.id === requestId ? { ...req, status: 'Called Off', endDate: new Date().toISOString().split('T')[0] } : req);
        updateLeaveRequests(updatedRequests);
        toast({ title: "Leave Called Off", description: "The leave has been marked as ended." });
    };

    const handleDeleteLeave = (requestId) => {
        const updatedRequests = leaveRequests.filter(req => req.id !== requestId);
        updateLeaveRequests(updatedRequests);
        toast({ title: "Leave Canceled", description: "The scheduled leave has been removed." });
    };

    const openExtendLeaveModal = (request) => {
        setLeaveToExtend(request);
        setNewEndDate(request.endDate);
        setIsExtendLeaveOpen(true);
    };

    const handleExtendLeave = () => {
        if (!newEndDate) {
            toast({ title: "Invalid Date", description: "Please select a new end date.", variant: "destructive" });
            return;
        }
        const updatedRequests = leaveRequests.map(req => req.id === leaveToExtend.id ? { ...req, endDate: newEndDate, status: 'Extended' } : req);
        updateLeaveRequests(updatedRequests);
        toast({ title: "Leave Extended", description: "The leave has been successfully extended." });
        setIsExtendLeaveOpen(false);
        setLeaveToExtend(null);
    };

    const isLeaveFuture = (leave) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(leave.startDate);
        return startDate > today;
    };
    
    return (
        <>
            <Card>
                <CardHeader className="flex-row items-center justify-between">
                    <div>
                        <CardTitle>Leave Requests</CardTitle>
                        <CardDescription>Review and manage employee leave requests.</CardDescription>
                    </div>
                    <Button onClick={() => setIsScheduleLeaveOpen(true)}>
                        <CalendarPlus className="w-4 h-4 mr-2" />
                        Schedule Leave
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Staff Name</TableHead>
                                <TableHead>Dates</TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leaveRequests.length > 0 ? leaveRequests.map(req => (
                                <TableRow key={req.id}>
                                    <TableCell>{req.staffName}</TableCell>
                                    <TableCell>{req.startDate} to {req.endDate}</TableCell>
                                    <TableCell>{req.reason}</TableCell>
                                    <TableCell>{req.status}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        {req.status === 'Pending' && (
                                            <>
                                                <Button size="sm" variant="outline" className="text-green-500" onClick={() => handleStatusChange(req.id, 'Approved')}><Check className="w-4 h-4 mr-2" />Approve</Button>
                                                <Button size="sm" variant="outline" className="text-red-500" onClick={() => handleStatusChange(req.id, 'Rejected')}><X className="w-4 h-4 mr-2" />Reject</Button>
                                            </>
                                        )}
                                        {req.status === 'Scheduled' && (
                                            <>
                                                <Button size="sm" variant="outline" onClick={() => handleStatusChange(req.id, 'On Leave')}><PlayCircle className="w-4 h-4 mr-2" />Start Leave</Button>
                                                <Button size="sm" variant="destructive" onClick={() => handleDeleteLeave(req.id)}><Trash2 className="w-4 h-4 mr-2" />Cancel</Button>
                                            </>
                                        )}
                                        {['On Leave', 'Extended'].includes(req.status) && (
                                            <>
                                                <Button size="sm" variant="outline" onClick={() => handleCallOffLeave(req.id)}><PhoneOff className="w-4 h-4 mr-2" />Call Off</Button>
                                                <Button size="sm" variant="outline" onClick={() => openExtendLeaveModal(req)}><CalendarClock className="w-4 h-4 mr-2" />Extend</Button>
                                            </>
                                        )}
                                        {isLeaveFuture(req) && req.status === 'Approved' && (
                                            <Button size="sm" variant="destructive" onClick={() => handleDeleteLeave(req.id)}><Trash2 className="w-4 h-4 mr-2" />Cancel</Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan="5" className="text-center">No leave requests found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isScheduleLeaveOpen} onOpenChange={setIsScheduleLeaveOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Schedule New Leave</DialogTitle>
                        <DialogDescription>Create a new leave plan for a staff member.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Staff Member</Label>
                            <Select value={newLeave.staffId} onValueChange={value => setNewLeave({ ...newLeave, staffId: value })}>
                                <SelectTrigger><SelectValue placeholder="Select Staff" /></SelectTrigger>
                                <SelectContent>
                                    {staff.map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.username}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="start-date">Start Date</Label>
                                <Input id="start-date" type="date" value={newLeave.startDate} onChange={e => setNewLeave({ ...newLeave, startDate: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="end-date">End Date</Label>
                                <Input id="end-date" type="date" value={newLeave.endDate} onChange={e => setNewLeave({ ...newLeave, endDate: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="reason">Reason</Label>
                            <Input id="reason" value={newLeave.reason} onChange={e => setNewLeave({ ...newLeave, reason: e.target.value })} placeholder="e.g., Annual Vacation" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsScheduleLeaveOpen(false)}>Cancel</Button>
                        <Button onClick={handleScheduleLeave}>Schedule Leave</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isExtendLeaveOpen} onOpenChange={setIsExtendLeaveOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Extend Leave</DialogTitle>
                        <DialogDescription>Extend the leave for {leaveToExtend?.staffName}.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <p>Current End Date: {leaveToExtend?.endDate}</p>
                        <div className="space-y-2">
                            <Label htmlFor="new-end-date">New End Date</Label>
                            <Input id="new-end-date" type="date" value={newEndDate} onChange={e => setNewEndDate(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsExtendLeaveOpen(false)}>Cancel</Button>
                        <Button onClick={handleExtendLeave}>Confirm Extension</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};


const RecruitmentManagement = () => {
    const [jobOpenings, setJobOpenings] = useState([]);
    const [newOpening, setNewOpening] = useState({ title: '', department: '' });

    useEffect(() => {
        const savedOpenings = JSON.parse(localStorage.getItem('loungeJobOpenings') || '[]');
        setJobOpenings(savedOpenings);
    }, []);

    const handleAddOpening = () => {
        if (!newOpening.title || !newOpening.department) {
            toast({ title: "Missing Information", description: "Please provide a title and department.", variant: "destructive" });
            return;
        }
        const updatedOpenings = [...jobOpenings, { id: Date.now(), ...newOpening, status: 'Open' }];
        setJobOpenings(updatedOpenings);
        localStorage.setItem('loungeJobOpenings', JSON.stringify(updatedOpenings));
        setNewOpening({ title: '', department: '' });
        toast({ title: "Job Opening Added" });
    };

    const handleDeleteOpening = (id) => {
        const updatedOpenings = jobOpenings.filter(job => job.id !== id);
        setJobOpenings(updatedOpenings);
        localStorage.setItem('loungeJobOpenings', JSON.stringify(updatedOpenings));
        toast({ title: "Job Opening Deleted" });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recruitment</CardTitle>
                <CardDescription>Manage job openings and track applicants.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-4 items-end">
                    <div className="flex-1 space-y-2">
                        <Label htmlFor="job-title">Job Title</Label>
                        <Input id="job-title" value={newOpening.title} onChange={e => setNewOpening({...newOpening, title: e.target.value})} placeholder="e.g., Senior Barista" />
                    </div>
                    <div className="flex-1 space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input id="department" value={newOpening.department} onChange={e => setNewOpening({...newOpening, department: e.target.value})} placeholder="e.g., Bar Operations" />
                    </div>
                    <Button onClick={handleAddOpening}><Plus className="w-4 h-4 mr-2" /> Add Opening</Button>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {jobOpenings.map(job => (
                            <TableRow key={job.id}>
                                <TableCell>{job.title}</TableCell>
                                <TableCell>{job.department}</TableCell>
                                <TableCell>{job.status}</TableCell>
                                <TableCell>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500" onClick={() => handleDeleteOpening(job.id)}><Trash2 className="w-4 h-4" /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

const PerformanceManagement = () => {
    const [reviews, setReviews] = useState([]);
    const [staff, setStaff] = useState([]);
    const [newReview, setNewReview] = useState({ staffId: '', rating: 0, comments: '' });

    useEffect(() => {
        const savedReviews = JSON.parse(localStorage.getItem('loungePerformanceReviews') || '[]');
        setReviews(savedReviews);
        const savedStaff = JSON.parse(localStorage.getItem('loungeUsers') || '[]');
        setStaff(savedStaff);
    }, []);

    const handleAddReview = () => {
        if (!newReview.staffId || !newReview.rating) {
            toast({ title: "Missing Information", description: "Please select a staff member and provide a rating.", variant: "destructive" });
            return;
        }
        const staffMember = staff.find(s => s.id.toString() === newReview.staffId.toString());
        const updatedReviews = [...reviews, { id: Date.now(), ...newReview, staffName: staffMember.username, date: new Date().toLocaleDateString() }];
        setReviews(updatedReviews);
        localStorage.setItem('loungePerformanceReviews', JSON.stringify(updatedReviews));
        setNewReview({ staffId: '', rating: 0, comments: '' });
        toast({ title: "Review Added" });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Performance Reviews</CardTitle>
                <CardDescription>Log and track employee performance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-4 items-end">
                    <div className="space-y-2">
                        <Label>Staff Member</Label>
                        <Select value={newReview.staffId} onValueChange={value => setNewReview({...newReview, staffId: value})}>
                            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Select Staff" /></SelectTrigger>
                            <SelectContent>
                                {staff.map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.username}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Rating (1-5)</Label>
                        <Input type="number" min="1" max="5" value={newReview.rating} onChange={e => setNewReview({...newReview, rating: parseInt(e.target.value)})} className="w-[100px]" />
                    </div>
                    <div className="flex-1 space-y-2">
                        <Label>Comments</Label>
                        <Input value={newReview.comments} onChange={e => setNewReview({...newReview, comments: e.target.value})} placeholder="e.g., Excellent customer service" />
                    </div>
                    <Button onClick={handleAddReview}><Plus className="w-4 h-4 mr-2" /> Add Review</Button>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Staff Name</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Comments</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reviews.map(review => (
                            <TableRow key={review.id}>
                                <TableCell>{review.staffName}</TableCell>
                                <TableCell>{review.date}</TableCell>
                                <TableCell>{review.rating}/5</TableCell>
                                <TableCell>{review.comments}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default HRM;