const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const connectToMongo = require("./Database/db.js");
const { generateInvoiceId } = require("./utils/idGenerator.js"); // Import the ID generator

// Import ALL models
const AdminCredential = require("./models/Admin/credential.model.js");
const AdminDetail = require("./models/Admin/details.model.js");
const DoctorCredential = require("./models/Doctor/credential.model.js");
const DoctorDetail = require("./models/Doctor/details.model.js");
const PatientCredential = require("./models/Patient/credential.model.js");
const PatientDetail = require("./models/Patient/details.model.js");
const Department = require("./models/Other/department.model.js");
const Schedule = require("./models/Other/schedule.model.js");
const Appointment = require("./models/Other/appointment.model.js");
const ActivityLog = require("./models/Other/activitylog.model.js");
const Counter = require("./models/Other/counter.model.js");
const Service = require("./models/Billing/Service.model.js");
const Invoice = require("./models/Billing/Invoice.model.js");
const Medicine = require("./models/Pharmacy/Medicine.model.js");
const Dispense = require("./models/Pharmacy/Dispense.model.js");
const LabTest = require("./models/LIS/LabTest.model.js");
const LabReport = require("./models/LIS/LabReport.model.js");
const RadiologyTest = require("./models/RIS/RadiologyTest.model.js");
const RadiologyReport = require("./models/RIS/RadiologyReport.model.js");
const Ward = require("./models/IPD/Ward.model.js");
const Bed = require("./models/IPD/Bed.model.js");
const Employee = require("./models/HR/Employee.model.js");
const DutyRoster = require("./models/HR/DutyRoster.model.js");

const seedDatabase = async () => {
  try {
    await connectToMongo();
    console.log("🚀 Connected to MongoDB for seeding...");

    // --- 1. Clear All Collections ---
    console.log("🧹 Clearing existing collections...");
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
    console.log("Collections cleared.");

    // --- [Sections 2 through 7 remain the same] ---
    
    // --- 2. Seed Departments ---
    console.log("Seeding Departments...");
    await Department.insertMany([
      { name: "Cardiology" }, { name: "Neurology" }, { name: "Orthopedics" },
      { name: "Pediatrics" }, { name: "Oncology" }, { name: "Radiology" },
      { name: "Pathology" }, { name: "General Ward" }
    ]);
    console.log(`👍 Departments seeded.`);

    // --- 3. Seed Admin ---
    console.log("Seeding Admin...");
    const adminPassword = await bcrypt.hash("password", 10);
    await AdminCredential.create({ loginid: "demo", password: adminPassword });
    const adminDet = await AdminDetail.create({
      employeeId: "demo", firstName: "Admin", lastName: "User", email: "admin@medicare.com",
      phoneNumber: 9999999999, gender: "Other", profile: "Default.png",
    });
    await Counter.findByIdAndUpdate('admin', { $set: { seq: 1 } }, { upsert: true });
    console.log("👍 Admin seeded (login: demo / password: password).");

    // --- 4. Seed Doctors ---
    console.log("Seeding Doctors...");
    const doctorData = [
      { firstName: "John", lastName: "Doe", department: "Cardiology", post: "Senior Consultant", experience: 12 },
      { firstName: "Eliza", lastName: "Beth", department: "Neurology", post: "Consultant", experience: 8 },
      { firstName: "Michael", lastName: "Smith", department: "Orthopedics", post: "HOD", experience: 15 },
    ];
    const doctorDocs = await Promise.all(doctorData.map(async (doc, i) => {
      const employeeId = `SIMS-DOC-${String(i + 1).padStart(5, '0')}`;
      await DoctorCredential.create({ loginid: employeeId, password: await bcrypt.hash(employeeId, 10) });
      return DoctorDetail.create({
        employeeId, ...doc, email: `${doc.firstName.toLowerCase()}@medicare.com`,
        phoneNumber: `987654321${i}`, gender: i % 2 === 0 ? "Male" : "Female", profile: "Default.png",
      });
    }));
    await Counter.findByIdAndUpdate('doctor', { $set: { seq: doctorData.length } }, { upsert: true });
    console.log(`👍 ${doctorDocs.length} doctors seeded.`);

    // --- 5. Seed Patients ---
    console.log("Seeding Patients...");
    const patientData = [
      { firstName: "Alice", lastName: "Williams", bloodGroup: "A+", gender: "Female", phone: 9111122220 },
      { firstName: "Bob", lastName: "Johnson", bloodGroup: "B-", gender: "Male", phone: 9111122221 },
      { firstName: "Charlie", lastName: "Brown", bloodGroup: "O+", gender: "Male", phone: 9111122222 },
    ];
    const patientDocs = await Promise.all(patientData.map(async (pat, i) => {
      const patientId = `SIMS-PAT-${String(i + 1).padStart(5, '0')}`;
      await PatientCredential.create({ loginid: patientId, password: await bcrypt.hash(patientId, 10) });
      return PatientDetail.create({
        patientId, ...pat, email: `${pat.firstName.toLowerCase()}@email.com`, phoneNumber: pat.phone,
        dateOfBirth: new Date(1990 + i, i, 15), address: `${i + 1}23 Sample St, City`, profile: "Default.png"
      });
    }));
    await Counter.findByIdAndUpdate('patient', { $set: { seq: patientData.length } }, { upsert: true });
    console.log(`👍 ${patientDocs.length} patients seeded.`);

    // --- 6. Seed Services, Tests, and Medicines ---
    console.log("Seeding Services, Tests, and Medicines...");
    const services = await Service.insertMany([
      { name: "General Consultation", price: 500, category: "Consultation" },
      { name: "Echocardiogram", price: 2500, category: "Procedure" },
      { name: "Complete Blood Count (CBC)", price: 300, category: "Lab Test" },
    ]);
    const labTests = await LabTest.insertMany([
      { name: "Lipid Profile", price: 600, category: "Biochemistry" },
    ]);
    const radiologyTests = await RadiologyTest.insertMany([
      { name: "CT Scan Brain", price: 3000, category: "CT" },
    ]);
    const medicines = await Medicine.insertMany([
      { name: "Paracetamol 500mg", stock: 1000, unit: "Tablet", price: 2, expiryDate: new Date("2025-12-31") },
    ]);
    console.log(`👍 Seeded base services and items.`);
    
    // --- 7. Seed IPD, HR, and Schedules ---
    console.log("Seeding IPD, HR, and Schedules...");
    const wards = await Ward.insertMany([{ name: "General Ward A" }, { name: "ICU" }]);
    await Bed.insertMany([
      { bedNumber: "GW-A01", ward: wards[0]._id }, { bedNumber: "GW-A02", ward: wards[0]._id },
      { bedNumber: "ICU-01", ward: wards[1]._id, isOccupied: true, patient: patientDocs[2]._id }
    ]);
    const employees = await Employee.insertMany([
      { name: "Nurse Jane", employeeId: "NRS001", role: "Nurse", department: "General Ward", joiningDate: new Date(), contactNumber: "9222233333", email: "nurse.jane@medicare.com"},
    ]);
    await DutyRoster.create({ employee: employees[0]._id, shift: "Morning", date: new Date() });
    for (const doc of doctorDocs) {
        await Schedule.create({ doctorId: doc._id, workingDays: [{ dayOfWeek: 'Monday', startTime: '09:00', endTime: '17:00' }] });
    }
    console.log(`👍 Seeded IPD, HR, and Schedules.`);

    // --- 8. Seed Interconnected Records ---
    console.log("Seeding interconnected records (Invoices, Reports, etc.)...");
    const today = new Date(); today.setHours(0,0,0,0);
    await Appointment.insertMany([
        { patientId: patientDocs[0]._id, doctorId: doctorDocs[0]._id, appointmentDate: new Date(today), slot: '10:00', status: 'Scheduled' },
        { patientId: patientDocs[1]._id, doctorId: doctorDocs[1]._id, appointmentDate: new Date(today), slot: '11:00', status: 'Scheduled' },
    ]);
    
    // *** BUG FIX STARTS HERE ***
    const invoiceItems = [{ 
        service: services[0]._id, 
        name: services[0].name, 
        quantity: 1, 
        price: services[0].price 
    }];
    const totalAmount = invoiceItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    
    await Invoice.create({
        patient: patientDocs[0]._id,
        invoiceNumber: await generateInvoiceId(), // Manually generate ID
        items: invoiceItems,
        totalAmount: totalAmount, // Manually calculate
        balance: totalAmount,     // Manually calculate
        status: "Issued"
    });
    // *** BUG FIX ENDS HERE ***
    
    await LabReport.create({ patient: patientDocs[1]._id, labTest: labTests[0]._id, results: "All parameters within normal limits." });
    await RadiologyReport.create({ patient: patientDocs[0]._id, radiologyTest: radiologyTests[0]._id, results: "No acute abnormalities." });
    await Dispense.create({ patient: patientDocs[2]._id, medicines: [{ medicine: medicines[0]._id, quantity: 10 }] });
    
    console.log("👍 Interconnected records seeded.");

    // --- 9. Seed Activity Log ---
    console.log("Seeding Activity Logs...");
    await ActivityLog.insertMany([
        { action: 'SYSTEM_SEED', description: 'Database was seeded with initial sample data.', user: adminDet._id, userModel: 'Admin Detail' },
        { action: 'PATIENT_ADMITTED', description: `Patient ${patientData[2].firstName} was admitted to bed ICU-01.`, user: adminDet._id, userModel: 'Admin Detail' },
    ]);
    console.log("👍 Activity logs seeded.");

    console.log("\n✅✅✅ Database seeding completed successfully! ✅✅✅");

  } catch (error) {
    console.error("❌ Error during database seeding:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed.");
    process.exit();
  }
};

seedDatabase();