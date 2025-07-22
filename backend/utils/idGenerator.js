const Counter = require('../models/Other/counter.model');

const getNextSequenceValue = async (sequenceName) => {
  const sequenceDocument = await Counter.findByIdAndUpdate(
    sequenceName,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return sequenceDocument.seq;
};

const generatePatientId = async () => {
  const seq = await getNextSequenceValue('patient');
  return `SIMS-PAT-${String(seq).padStart(5, '0')}`;
};

const generateDoctorId = async () => {
  const seq = await getNextSequenceValue('doctor');
  return `SIMS-DOC-${String(seq).padStart(5, '0')}`;
};

const generateAdminId = async () => {
  const seq = await getNextSequenceValue('admin');
  return `SIMS-ADM-${String(seq).padStart(5, '0')}`;
};

const generateInvoiceId = async () => {
  const seq = await getNextSequenceValue('invoice');
  const year = new Date().getFullYear();
  return `INV-${year}-${String(seq).padStart(6, '0')}`;
}

// Generic ID generator that can be used by other modules
const generateId = async (prefix, sequenceName) => {
    const seq = await getNextSequenceValue(sequenceName);
    return `${prefix}-${String(seq).padStart(6, '0')}`;
}


module.exports = {
  generatePatientId,
  generateDoctorId,
  generateAdminId,
  generateInvoiceId,
  generateId,
};