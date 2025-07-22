import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { useAuth } from '../../contexts/AuthContext';

const CreateNoteForm = ({ onNoteCreated }) => {
  const { id: patientId } = useParams();
  const { post } = useApi();
  const [subjective, setSubjective] = useState('');
  const [objective, setObjective] = useState('');
  const [assessment, setAssessment] = useState('');
  const [plan, setPlan] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const newNote = await post(`/doctor/patients/${patientId}/notes`, {
        subjective,
        objective,
        assessment,
        plan,
      });
      onNoteCreated(newNote);
      // Clear form
      setSubjective('');
      setObjective('');
      setAssessment('');
      setPlan('');
    } catch (err) {
      setError(err.message || 'Failed to create note.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Add New Clinical Note (SOAP)</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="subjective" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Subjective</label>
          <textarea id="subjective" value={subjective} onChange={(e) => setSubjective(e.target.value)} rows="2" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white"></textarea>
        </div>
        <div>
          <label htmlFor="objective" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Objective</label>
          <textarea id="objective" value={objective} onChange={(e) => setObjective(e.target.value)} rows="2" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white"></textarea>
        </div>
        <div>
          <label htmlFor="assessment" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Assessment *</label>
          <textarea id="assessment" value={assessment} onChange={(e) => setAssessment(e.target.value)} rows="2" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white"></textarea>
        </div>
        <div>
          <label htmlFor="plan" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Plan *</label>
          <textarea id="plan" value={plan} onChange={(e) => setPlan(e.target.value)} rows="2" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white"></textarea>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Note'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CreateNoteForm;