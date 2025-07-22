const CriticalCareChart = require("../../models/Other/criticalCareChart.model.js");
const asyncHandler = require('express-async-handler');

const mapRoleToModelName = (role) => {
    if (role === 'admin') return 'Admin Detail';
    if (role === 'doctor') return 'Doctor Detail';
    return 'Doctor Detail';
};

const getChart = asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const chart = await CriticalCareChart.findOne({ patientId })
        .populate({
            path: 'days.timeSlots.lastModifiedBy',
            select: 'firstName lastName'
            // No model needed here because refPath in the schema handles it
        });

    if (!chart) {
        const newChart = new CriticalCareChart({ patientId, days: [] });
        await newChart.save();
        return res.json({ success: true, chart: newChart });
    }
    res.json({ success: true, chart });
});

const addTimeSlot = asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const { date, time, ...data } = req.body;
    const userId = req.user.id;
    const userModel = mapRoleToModelName(req.user.role);

    if (!date || !time) {
        res.status(400); throw new Error("Date and time are required.");
    }

    let chart = await CriticalCareChart.findOne({ patientId });
    if (!chart) chart = new CriticalCareChart({ patientId, days: [] });

    let day = chart.days.find(d => d.date && d.date.toISOString().split('T')[0] === date);
    if (!day) {
        day = { date: new Date(date), timeSlots: [] };
        chart.days.push(day);
    }

    const existingSlot = day.timeSlots.find(slot => slot.time === time);
    if (existingSlot) {
        res.status(409); // Conflict
        throw new Error("A time slot for this time already exists. Please edit it instead.");
    }

    const newTimeSlot = { time, ...data, lastModifiedBy: userId, lastModifiedByUserModel: userModel, history: [] };
    day.timeSlots.push(newTimeSlot);
    day.timeSlots.sort((a, b) => a.time.localeCompare(b.time));
    chart.days.sort((a, b) => new Date(a.date) - new Date(b.date));

    await chart.save();
    
    const populatedChart = await chart.populate({ path: 'days.timeSlots.lastModifiedBy', select: 'firstName lastName' });
    res.status(201).json({ success: true, message: "Time slot added.", chart: populatedChart });
});

const updateTimeSlot = asyncHandler(async (req, res) => {
    const { patientId, dayId, slotId } = req.params;
    const updateData = req.body;
    const userId = req.user.id;
    const userModel = mapRoleToModelName(req.user.role);

    const chart = await CriticalCareChart.findOne({ patientId });
    if (!chart) { res.status(404); throw new Error("Chart not found."); }

    const day = chart.days.id(dayId);
    if (!day) { res.status(404); throw new Error("Day not found in chart."); }

    const timeSlot = day.timeSlots.id(slotId);
    if (!timeSlot) { res.status(404); throw new Error("Time slot not found."); }

    const oldVersion = { ...timeSlot.toObject() };
    delete oldVersion.history; delete oldVersion._id;
    timeSlot.history.push({ ...oldVersion, modifiedAt: new Date(), modifiedBy: timeSlot.lastModifiedBy });

    Object.assign(timeSlot, updateData);
    timeSlot.lastModifiedBy = userId;
    timeSlot.lastModifiedByUserModel = userModel;

    await chart.save();
    
    const populatedChart = await chart.populate({ path: 'days.timeSlots.lastModifiedBy', select: 'firstName lastName' });
    res.json({ success: true, message: "Time slot updated.", chart: populatedChart });
});

module.exports = { getChart, addTimeSlot, updateTimeSlot };