import React, { useState } from 'react';
import useApi from '../../hooks/useApi';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { Toaster, toast } from 'react-hot-toast';

const UploadLabReportPage = () => {
  const { post, loading } = useApi();
  const [patientId, setPatientId] = useState('');
  const [labTestId, setLabTestId] = useState('');
  const [results, setResults] = useState('');
  const [notes, setNotes] = useState('');

  // In a real app, you'd fetch patients and lab tests to populate dropdowns
  // For now, we'll use text inputs

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await post('/lis/reports', {
        patient: patientId,
        labTest: labTestId,
        results,
        notes,
      });
      toast.success('Lab report uploaded successfully!');
      // Clear form
      setPatientId('');
      setLabTestId('');
      setResults('');
      setNotes('');
    } catch (error) {
      toast.error(error.message || 'Failed to upload report.');
    }
  };

  return (
    <div>
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">Upload Lab Report</h1>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Patient ID</label>
            <input type="text" value={patientId} onChange={(e) => setPatientId(e.target.value)}
                   className="mt-1 block w-full p-2 border rounded-md" required />
          </div>
          <div>
            <label className="block text-sm font-medium">Lab Test ID</label>
            <input type="text" value={labTestId} onChange={(e) => setLabTestId(e.target.value)}
                   className="mt-1 block w-full p-2 border rounded-md" required />
          </div>
          <div>
            <label className="block text-sm font-medium">Results</label>
            <textarea value={results} onChange={(e) => setResults(e.target.value)}
                      rows="4" className="mt-1 block w-full p-2 border rounded-md" required></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium">Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                      rows="2" className="mt-1 block w-full p-2 border rounded-md"></textarea>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? 'Uploading...' : 'Upload Report'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default UploadLabReportPage;