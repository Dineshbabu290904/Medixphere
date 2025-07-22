const mongoose = require("mongoose");
const connectToMongo = require("./Database/db.js");

// Import models
const Doctor = require("./models/Doctor/details.model.js");
const Patient = require("./models/Patient/details.model.js");
const Appointment = require("./models/Other/appointment.model.js");
const Prescription = require("./models/Doctor/Prescription.model.js");
const ClinicalNote = require("./models/Clinical/ClinicalNote.model.js");
const LabTest = require("./models/LIS/LabTest.model.js");
const LabReport = require("./models/LIS/LabReport.model.js");

const seedDoctorData = async () => {
  try {
    await connectToMongo();
    console.log("🚀 Connected to MongoDB for doctor-specific seeding...");

    // --- 1. Fetch Existing Doctors and Patients ---
    const doctors = await Doctor.find().limit(2);
    const patients = await Patient.find().limit(5);

    if (doctors.length < 1 || patients.length < 2) {
      console.error("❌ Not enough doctors or patients found. Please run the main seeder first.");
      process.exit(1);
    }
    console.log(`Found ${doctors.length} doctors and ${patients.length} patients to work with.`);

    const doctor1 = doctors[0];
    const patient1 = patients[0];
    const patient2 = patients[1];

    // --- 2. Seed Appointments ---
    console.log("Seeding additional appointments...");
    await Appointment.insertMany([
      { patient: patient1._id, doctor: doctor1._id, appointmentDate: new Date(), reason: "Follow-up checkup", status: "Completed" },
      { patient: patient2._id, doctor: doctor1._id, appointmentDate: new Date(new Date().setDate(new Date().getDate() + 1)), reason: "New symptoms", status: "Scheduled" },
      { patient: patient1._id, doctor: doctor1._id, appointmentDate: new Date(new Date().setDate(new Date().getDate() - 7)), reason: "Initial consultation", status: "Completed" },
    ]);
    console.log("👍 Appointments seeded.");

    // --- 3. Seed Clinical Notes ---
    console.log("Seeding clinical notes...");
    await ClinicalNote.create({
      patientId: patient1._id,
      doctorId: doctor1._id,
      subjective: "Patient reports feeling much better.",
      objective: "Blood pressure is 120/80. Heart rate is 70 bpm.",
      assessment: "Condition stable. Responding well to treatment.",
      plan: "Continue current medication. Follow up in 2 weeks.",
    });
    console.log("👍 Clinical notes seeded.");

    // --- 4. Seed Prescriptions ---
    console.log("Seeding prescriptions...");
    await Prescription.create({
      patient: patient1._id,
      doctor: doctor1._id,
      date: new Date(),
      medications: [
        { name: "Lisinopril", dosage: "10mg", frequency: "Once a day" },
        { name: "Aspirin", dosage: "81mg", frequency: "Once a day" },
      ],
      notes: "Take with food.",
    });
    console.log("👍 Prescriptions seeded.");

    // --- 5. Seed Lab Reports ---
    console.log("Seeding lab reports...");
    const cbcTest = await LabTest.findOne({ name: "Complete Blood Count (CBC)" });
    if (cbcTest) {
      await LabReport.create({
        patient: patient2._id,
        labTest: cbcTest._id,
        results: "WBC: 5.5, RBC: 4.8, HGB: 14.2. All within normal range.",
        notes: "No abnormalities detected.",
      });
      console.log("👍 Lab reports seeded.");
    } else {
      console.warn("⚠️ CBC Lab test not found, skipping lab report seeding.");
    }

    console.log("\n✅✅✅ Doctor data seeding completed successfully! ✅✅✅");

  } catch (error) {
    console.error("❌ Error during doctor data seeding:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed.");
    process.exit();
  }
};

seedDoctorData();