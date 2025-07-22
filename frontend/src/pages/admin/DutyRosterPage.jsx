import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/services/api';
import PageHeader from '@/components/ui/PageHeader';
import Modal from '@/components/ui/Modal';
import DutyRosterForm from '@/components/admin/hr/DutyRosterForm';
import { ChevronLeft, ChevronRight, Plus, User, Trash2 } from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import toast from 'react-hot-toast';
import Select from '@/components/ui/Select'; // Using our UI Select, not a native one

const ShiftBadge = ({ shift }) => {
    const colors = {
        Morning: 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300',
        Evening: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
        Night: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
    }
    return <div className={`px-2 py-1 text-xs font-bold rounded-full text-center ${colors[shift] || 'bg-gray-200'}`}>{shift}</div>
}

const DutyRosterPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [rosterData, setRosterData] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRosterEntry, setSelectedRosterEntry] = useState(null);
    const [modalDefaults, setModalDefaults] = useState({});
    
    const week = eachDayOfInterval({
        start: startOfWeek(currentDate, { weekStartsOn: 1 }), // Monday
        end: endOfWeek(currentDate, { weekStartsOn: 1 })
    });

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const startDate = format(week[0], 'yyyy-MM-dd');
            const endDate = format(week[6], 'yyyy-MM-dd');

            const [rosterRes, employeeRes, deptRes] = await Promise.all([
                apiService.request(`/hr/duty-roster?startDate=${startDate}&endDate=${endDate}&department=${selectedDepartment}`),
                apiService.request('/hr/employees'),
                apiService.request('/department/getDepartment')
            ]);
            
            setRosterData(rosterRes || []);
            setEmployees(employeeRes || []);
            setDepartments([{value: '', label: 'All Departments'}, ...deptRes.departments.map(d => ({ value: d.name, label: d.name }))]);
        } catch (error) {
            toast.error('Failed to load roster data.');
        } finally {
            setLoading(false);
        }
    }, [currentDate, selectedDepartment]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpenModal = (entry = null, defaultDate = null, defaultEmployee = null) => {
        setSelectedRosterEntry(entry);
        setModalDefaults({
            defaultDate: format(defaultDate || new Date(), 'yyyy-MM-dd'),
            defaultEmployee
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleSubmit = async (data) => {
        const payload = { ...data, date: new Date(data.date).toISOString() };
        try {
            if (selectedRosterEntry) {
                await apiService.request(`/hr/duty-roster/${selectedRosterEntry._id}`, { method: 'PUT', body: payload });
                toast.success('Shift updated successfully!');
            } else {
                await apiService.request('/hr/duty-roster', { method: 'POST', body: payload });
                toast.success('Shift added successfully!');
            }
            fetchData();
            handleCloseModal();
        } catch (error) { /* Global handler will show toast */ }
    };
    
    const handleDelete = async () => {
        if (!selectedRosterEntry || !window.confirm("Are you sure you want to delete this shift?")) return;
        try {
            await apiService.request(`/hr/duty-roster/${selectedRosterEntry._id}`, { method: 'DELETE' });
            toast.success('Shift deleted successfully!');
            fetchData();
            handleCloseModal();
        } catch (error) { /* Global handler will show toast */ }
    }
    
    const filteredEmployees = selectedDepartment 
        ? employees.filter(e => e.department === selectedDepartment) 
        : employees;

    return (
        <>
            <PageHeader title="Duty Roster" subtitle="Manage weekly staff schedules and shifts." breadcrumbs={['Admin', 'HR', 'Duty Roster']} />
            <div className="bg-white dark:bg-slate-800/50 p-4 rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 mb-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => setCurrentDate(addDays(currentDate, -7))}><ChevronLeft/></Button>
                        <Button variant="outline" onClick={() => setCurrentDate(new Date())}>Today</Button>
                        <Button variant="outline" onClick={() => setCurrentDate(addDays(currentDate, 7))}><ChevronRight/></Button>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 ml-4">
                            {format(week[0], 'MMM d')} - {format(week[6], 'MMM d, yyyy')}
                        </h3>
                    </div>
                    <div className="w-full sm:w-64">
                         <Select 
                            name="departmentFilter"
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            options={departments}
                            placeholder="Filter by Department"
                         />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto bg-white dark:bg-slate-800/50 rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50">
                {loading ? <div className="h-96 flex items-center justify-center"><Spinner size="lg"/></div> : (
                <table className="w-full min-w-[1200px]">
                    <thead className="bg-gray-50 dark:bg-slate-800">
                        <tr>
                            <th className="p-3 text-left w-64 text-sm font-semibold text-gray-700 dark:text-gray-300">Employee</th>
                            {week.map(day => (
                                <th key={day.toString()} className="p-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 border-l dark:border-slate-700">
                                    {format(day, 'E')} <span className="block text-xs text-gray-500">{format(day, 'd')}</span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-slate-700">
                        {filteredEmployees.map(employee => {
                            const employeeShifts = rosterData.filter(r => r.employee?._id === employee._id);
                            return (
                                <tr key={employee._id}>
                                    <td className="p-3 align-top font-medium text-gray-800 dark:text-gray-100">
                                        {employee.name}
                                        <span className="block text-xs text-gray-500">{employee.department}</span>
                                    </td>
                                    {week.map(day => {
                                        const shift = employeeShifts.find(s => isSameDay(new Date(s.date), day));
                                        return (
                                            <td key={day.toString()} className="p-2 align-top text-center border-l dark:border-slate-700 h-24 group">
                                                {shift ? (
                                                    <div onClick={() => handleOpenModal(shift)} className="cursor-pointer p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700">
                                                        <ShiftBadge shift={shift.shift} />
                                                    </div>
                                                ) : (
                                                    <button onClick={() => handleOpenModal(null, day, employee._id)} className="w-full h-full flex items-center justify-center text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Plus size={20}/>
                                                    </button>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                         {filteredEmployees.length === 0 && (
                            <tr><td colSpan={8} className="text-center py-16 text-gray-500">No employees found for this department.</td></tr>
                         )}
                    </tbody>
                </table>
                )}
            </div>
            
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={selectedRosterEntry ? 'Edit Shift' : 'Add Shift'}>
                <DutyRosterForm
                    rosterEntry={selectedRosterEntry}
                    employees={employees}
                    onSubmit={handleSubmit}
                    onCancel={handleCloseModal}
                    defaultDate={modalDefaults.defaultDate}
                    defaultEmployee={modalDefaults.defaultEmployee}
                />
                 {selectedRosterEntry && <Button variant="danger" size="sm" onClick={handleDelete} className="mt-4 flex items-center gap-2"><Trash2 size={14}/> Delete Shift</Button>}
            </Modal>
        </>
    );
};

export default DutyRosterPage;