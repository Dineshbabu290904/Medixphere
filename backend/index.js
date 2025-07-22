const connectToMongo = require("./Database/db");
const express = require("express");
const http = require('http');
const { Server } = require("socket.io");
const path = require("path");
const Message = require('./models/Other/Message.model');
const Admin = require('./models/Admin/details.model');
const Doctor = require('./models/Doctor/details.model');


const app = express();
const server = http.createServer(app);

// --- WebSocket (Socket.IO) Initialization ---
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust for production
    methods: ["GET", "POST"]
  }
});

// --- Store Socket.IO instance for global access ---
app.set('socketio', io);

// --- Real-time Communication Handlers ---
const userSockets = {}; // { userId: socketId }

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Store user's socket ID upon connection
  socket.on('register', (userId) => {
    console.log(`Registering user ${userId} with socket ${socket.id}`);
    userSockets[userId] = socket.id;
    // Join a room for individual notifications
    socket.join(userId);
  });

  // Handle sending a message
  socket.on('send_message', async (data) => {
    const { sender, receiver, content } = data;
    
    // Save message to database
    const message = new Message({ sender, receiver, content });
    await message.save();
    
    // Manually populate sender info since ref is generic
    let populatedMessage = message.toObject();
    let senderInfo = await Doctor.findById(sender, 'firstName lastName').lean() || await Admin.findById(sender, 'firstName lastName').lean();
    if (senderInfo) {
      populatedMessage.sender = senderInfo;
    }

    // Send message to receiver if they are online
    const receiverSocketId = userSockets[receiver];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receive_message', populatedMessage);
    }
    // Also send message back to sender to confirm it was sent
    socket.emit('receive_message', populatedMessage);
  });

  // Real-time vitals updates
  socket.on('vitals_update', (data) => {
    // Broadcast to all connected clients (e.g., doctor dashboards)
    io.emit('new_vitals', data); 
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Remove user from tracking
    for (const userId in userSockets) {
      if (userSockets[userId] === socket.id) {
        delete userSockets[userId];
        break;
      }
    }
  });
});


connectToMongo();
const port = process.env.PORT || 5000;
var cors = require("cors");

app.use(cors(
  {
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allow specific headers
  }
));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello! MediCare HMS Backend is running. 🚀");
});

app.use('/media', express.static(path.join(__dirname, 'media')));

// --- CORE AUTH & DETAILS ---
app.use("/api/patient/auth", require("./routes/Patient Api/credential.route"));
app.use("/api/doctor/auth", require("./routes/Doctor Api/credential.route"));
app.use("/api/admin/auth", require("./routes/Admin Api/credential.route"));
app.use("/api/patient/details", require("./routes/Patient Api/details.route"));
app.use("/api/doctor/details", require("./routes/Doctor Api/details.route"));
app.use("/api/admin/details", require("./routes/Admin Api/details.route"));

// --- HOSPITAL MANAGEMENT APIS ---
app.use("/api/schedule", require("./routes/Other/schedule.route.js"));
app.use("/api/patientrecord", require("./routes/Other/patientrecord.route.js"));
app.use("/api/notice", require("./routes/Other/notice.route.js"));
app.use("/api/medicaltest", require("./routes/Other/medicaltest.route.js"));
app.use("/api/department", require("./routes/Other/department.route.js"));
app.use("/api/flow-chart", require("./routes/Other/criticalCareChart.route.js"));
app.use("/api/appointment", require("./routes/Other/appointment.route"));
app.use("/api/auth/role", require("./routes/Admin Api/role.route"));
app.use("/api/activity", require("./routes/Other/activitylog.route.js"));

// --- BILLING & FINANCIAL APIS ---
app.use("/api/billing", require("./routes/Billing/billing.route.js"));

// --- PHARMACY & INVENTORY APIS ---
app.use("/api/pharmacy", require("./routes/Pharmacy/pharmacy.route.js"));

// --- LIS & RADIOLOGY APIS ---
app.use("/api/lis", require("./routes/LIS/lis.route.js"));
app.use("/api/ris", require("./routes/RIS/ris.route.js"));

// --- MESSAGING API ---
app.use("/api/messages", require("./routes/Other/message.route.js"));
app.use("/api/users", require("./routes/Other/user.route.js"));

// --- IPD & WARD MANAGEMENT APIS ---
app.use("/api/ipd", require("./routes/IPD/ipd.route.js"));

// --- HR MANAGEMENT APIS ---
app.use("/api/hr", require("./routes/HR/hr.route.js"));
app.use('/api/hr/duty-roster', require('./routes/HR/dutyRoster.route'));

// --- DOCTOR MANAGEMENT APIS ---
app.use("/api/doctor", require("./routes/Doctor/doctor.route.js"));
app.use("/api/patient", require("./routes/Patient/patient.route.js"));

server.listen(port, () => {
  console.log(`Server Listening On http://localhost:${port}`);
});