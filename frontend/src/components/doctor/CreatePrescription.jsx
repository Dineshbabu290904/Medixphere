import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import Button from '../ui/Button';
import Modal from '../ui/Modal'; // Assuming a Modal component exists
import { FiPlus, FiTrash } from 'react-icons/fi';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const CreatePrescription = ({ onPrescriptionCreated }) => {
  const { id: patientId } = useParams();
  const { post } = useApi();
  const [isOpen, setIsOpen] = useState(false);
  const [medications, setMedications] = useState([{ name: '', dosage: '', frequency: '' }]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleMedicationChange = (index, field, value) => {
    const newMedications = [...medications];
    newMedications[index][field] = value;
    setMedications(newMedications);
  };

  const addMedication = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '' }]);
  };

  const removeMedication = (index) => {
    const newMedications = medications.filter((_, i) => i !== index);
    setMedications(newMedications);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const newPrescription = await post(`/doctor/patients/${patientId}/prescriptions`, {
        medications,
        notes,
      });
      onPrescriptionCreated(newPrescription);
      setIsOpen(false);
      // Optional: Generate PDF after creation
      generatePdf(newPrescription);
    } catch (err) {
      setError(err.message || 'Failed to create prescription.');
    } finally {
      setLoading(false);
    }
  };

  const generatePdf = (prescription) => {
    const input = document.getElementById('prescription-pdf');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 0, 0);
      pdf.save(`prescription-${prescription._id}.pdf`);
    });
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Create New Prescription</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Create Prescription">
        <form onSubmit={handleSubmit}>
          <div id="prescription-pdf" className="p-4">
            <h3 className="text-lg font-bold mb-4">Medications</h3>
            {medications.map((med, index) => (
              <div key={index} className="grid grid-cols-4 gap-2 mb-2">
                <input type="text" placeholder="Medicine Name" value={med.name} onChange={(e) => handleMedicationChange(index, 'name', e.target.value)} className="col-span-2 p-2 border rounded" required />
                <input type="text" placeholder="Dosage (e.g., 500mg)" value={med.dosage} onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)} className="p-2 border rounded" required />
                <input type="text" placeholder="Frequency (e.g., Twice a day)" value={med.frequency} onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)} className="p-2 border rounded" required />
                <Button type="button" onClick={() => removeMedication(index)} className="bg-red-500 hover:bg-red-600"><FiTrash /></Button>
              </div>
            ))}
            <Button type="button" onClick={addMedication} className="mt-2"><FiPlus /> Add Medication</Button>
            
            <div className="mt-4">
              <label htmlFor="notes" className="block text-sm font-medium">Notes</label>
              <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows="3" className="mt-1 block w-full p-2 border rounded"></textarea>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          
          <div className="flex justify-end mt-4">
            <Button type="button" onClick={() => setIsOpen(false)} className="mr-2 bg-gray-300 hover:bg-gray-400">Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Prescription'}</Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default CreatePrescription;