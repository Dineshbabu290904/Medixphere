const Service = require("../../models/Billing/Service.model");
const Invoice = require("../../models/Billing/Invoice.model");
const asyncHandler = require("express-async-handler");
const { generateInvoiceId } = require("../../utils/idGenerator");

// ... (Service controllers remain the same)
const createService = asyncHandler(async (req, res) => {
  const { name, description, price, category } = req.body;
  if (!name || price === undefined || !category) {
    res.status(400);
    throw new Error("Please provide all required fields: name, price, category");
  }
  const service = await Service.create({ name, description, price, category });
  res.status(201).json(service);
});

const getServices = asyncHandler(async (req, res) => {
  const services = await Service.find({});
  res.status(200).json(services);
});

const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }
  const { name, description, price, category } = req.body;
  service.name = name || service.name;
  service.description = description || service.description;
  service.price = price ?? service.price;
  service.category = category || service.category;
  const updatedService = await service.save();
  res.status(200).json(updatedService);
});

const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }
  await service.deleteOne();
  res.status(200).json({ message: "Service removed" });
});


// Invoice Controllers
const createInvoice = asyncHandler(async (req, res) => {
  const { patient, items, status, dueDate, notes } = req.body;
  if (!patient || !items || items.length === 0) {
    res.status(400);
    throw new Error("Please provide patient and at least one item");
  }

  // BUG FIX: The controller is now the single source of truth for invoice number generation.
  // The seeder now provides all required fields, so this controller is simpler and correct for frontend use.
  const invoiceNumber = await generateInvoiceId();

  const invoice = await Invoice.create({ patient, invoiceNumber, items, status, dueDate, notes });
  res.status(201).json(invoice);
});

const getInvoices = asyncHandler(async (req, res) => {
  // THE FIX: Simplified populate call. The virtual 'name' property will be included.
  const invoices = await Invoice.find({}).populate("patient");
  res.status(200).json(invoices);
});

const updateInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) {
    res.status(404);
    throw new Error("Invoice not found");
  }
  const { items, status, dueDate, notes, amountPaid } = req.body;
  invoice.items = items ?? invoice.items;
  invoice.status = status ?? invoice.status;
  invoice.dueDate = dueDate ?? invoice.dueDate;
  invoice.notes = notes ?? invoice.notes;
  invoice.amountPaid = amountPaid ?? invoice.amountPaid;
  const updatedInvoice = await invoice.save();
  res.status(200).json(updatedInvoice);
});

const deleteInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) {
    res.status(404);
    throw new Error("Invoice not found");
  }
  await invoice.deleteOne();
  res.status(200).json({ message: "Invoice removed" });
});

module.exports = {
  createService,
  getServices,
  updateService,
  deleteService,
  createInvoice,
  getInvoices,
  updateInvoice,
  deleteInvoice,
};