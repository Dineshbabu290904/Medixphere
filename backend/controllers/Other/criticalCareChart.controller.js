const CriticalCareChart = require("../../models/Other/criticalCareChart.model.js");
const asyncHandler = require('express-async-handler');

const mapRoleToModelName = (role) => {
    const roleMap = {
        'admin': 'Admin Detail',
        'doctor': 'Doctor Detail',
        'nurse': 'Nurse Detail'
    };
    return roleMap[role] || 'Doctor Detail';
};

// Get chart with enhanced error handling and data validation
const getChart = asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    
    try {
        let chart = await CriticalCareChart.findOne({ patientId })
            .populate({
                path: 'days.timeSlots.lastModifiedBy',
                select: 'firstName lastName email'
            });

        if (!chart) {
            // Create new chart with default structure
            chart = new CriticalCareChart({ 
                patientId, 
                days: [],
                weight: '',
                age_sex: '',
                bed_no: '',
                primary_consultant: '',
                days_in_icu: 0,
                intropes: '',
                diagnosis: '',
                operation_performed: '',
                post_op_day: 0
            });
            await chart.save();
        }

        res.json({ 
            success: true, 
            chart,
            message: chart.days.length === 0 ? "New chart created" : "Chart retrieved successfully"
        });
    } catch (error) {
        res.status(500);
        throw new Error(`Failed to retrieve chart: ${error.message}`);
    }
});

// Enhanced update chart header information
const updateChartHeader = asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const updateData = req.body;
    const userId = req.user.id;

    try {
        let chart = await CriticalCareChart.findOne({ patientId });
        
        if (!chart) {
            chart = new CriticalCareChart({ patientId, days: [] });
        }

        // Update only the header fields
        const headerFields = [
            'weight', 'bed_no', 'primary_consultant', 'days_in_icu', 
            'intropes', 'diagnosis', 'operation_performed', 'post_op_day'
        ];
        
        headerFields.forEach(field => {
            if (updateData.hasOwnProperty(field)) {
                chart[field] = updateData[field];
            }
        });

        await chart.save();
        
        const populatedChart = await chart.populate({
            path: 'days.timeSlots.lastModifiedBy',
            select: 'firstName lastName email'
        });

        res.json({ 
            success: true, 
            message: "Chart header updated successfully", 
            chart: populatedChart 
        });
    } catch (error) {
        res.status(500);
        throw new Error(`Failed to update chart header: ${error.message}`);
    }
});

// Enhanced add/update time slot with better validation
const upsertTimeSlot = asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const { date, time, ...slotData } = req.body;
    const userId = req.user.id;
    const userModel = mapRoleToModelName(req.user.role);

    if (!date || !time) {
        res.status(400);
        throw new Error("Date and time are required.");
    }

    try {
        let chart = await CriticalCareChart.findOne({ patientId });
        if (!chart) {
            chart = new CriticalCareChart({ patientId, days: [] });
        }

        // Find or create day
        let day = chart.days.find(d => d.date && d.date.toISOString().split('T')[0] === date);
        if (!day) {
            day = { 
                date: new Date(date), 
                timeSlots: [],
                catheters_tubes_summary: '',
                catheters_tubes: [],
                investigations_sent: [],
                investigations_pending: [],
                nutrition_calories_summary: '',
                nutrition_details: {},
                fluid_intake_24hr: 0,
                total_output_24hr: 0,
                cumulative_balance: 0,
                physiotherapy: [],
                shift_day_notes: '',
                shift_night_notes: '',
                iv_fluids: [],
                drugs_administered: [],
                blood_products: []
            };
            chart.days.push(day);
        }

        // Find existing slot or create new one
        let timeSlot = day.timeSlots.find(slot => slot.time === time);
        let isNewSlot = !timeSlot;

        if (isNewSlot) {
            timeSlot = {
                time,
                vitals: {},
                gcs: {},
                pupils: { r: {}, l: {} },
                intake_output: {},
                nursing_care: {},
                ventilator: {},
                abg: {},
                positioning: {},
                lastModifiedBy: userId,
                lastModifiedByUserModel: userModel,
                history: []
            };
            day.timeSlots.push(timeSlot);
        } else {
            // Save current state to history before updating
            const oldVersion = { ...timeSlot.toObject() };
            delete oldVersion.history;
            delete oldVersion._id;
            timeSlot.history.push({
                ...oldVersion,
                modifiedAt: new Date(),
                modifiedBy: timeSlot.lastModifiedBy,
                modifiedByUserModel: timeSlot.lastModifiedByUserModel
            });
        }

        // Update slot data with deep merge
        Object.keys(slotData).forEach(key => {
            if (typeof slotData[key] === 'object' && slotData[key] !== null && !Array.isArray(slotData[key])) {
                timeSlot[key] = { ...timeSlot[key], ...slotData[key] };
            } else {
                timeSlot[key] = slotData[key];
            }
        });

        timeSlot.lastModifiedBy = userId;
        timeSlot.lastModifiedByUserModel = userModel;

        // Sort time slots by time
        day.timeSlots.sort((a, b) => a.time.localeCompare(b.time));
        
        // Sort days by date
        chart.days.sort((a, b) => new Date(a.date) - new Date(b.date));

        await chart.save();
        
        const populatedChart = await chart.populate({
            path: 'days.timeSlots.lastModifiedBy',
            select: 'firstName lastName email'
        });

        res.json({
            success: true,
            message: isNewSlot ? "Time slot created successfully" : "Time slot updated successfully",
            chart: populatedChart,
            isNewSlot
        });
    } catch (error) {
        res.status(500);
        throw new Error(`Failed to save time slot: ${error.message}`);
    }
});

// Update day-level data (IV fluids, drugs, etc.)
const updateDayData = asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const { date, ...dayData } = req.body;
    const userId = req.user.id;

    if (!date) {
        res.status(400);
        throw new Error("Date is required.");
    }

    try {
        let chart = await CriticalCareChart.findOne({ patientId });
        if (!chart) {
            chart = new CriticalCareChart({ patientId, days: [] });
        }

        let day = chart.days.find(d => d.date && d.date.toISOString().split('T')[0] === date);
        if (!day) {
            day = { date: new Date(date), timeSlots: [] };
            chart.days.push(day);
        }

        // Update day-level fields
        Object.keys(dayData).forEach(key => {
            if (dayData.hasOwnProperty(key)) {
                day[key] = dayData[key];
            }
        });

        chart.days.sort((a, b) => new Date(a.date) - new Date(b.date));
        await chart.save();

        const populatedChart = await chart.populate({
            path: 'days.timeSlots.lastModifiedBy',
            select: 'firstName lastName email'
        });

        res.json({
            success: true,
            message: "Day data updated successfully",
            chart: populatedChart
        });
    } catch (error) {
        res.status(500);
        throw new Error(`Failed to update day data: ${error.message}`);
    }
});

// Delete time slot
const deleteTimeSlot = asyncHandler(async (req, res) => {
    const { patientId, dayId, slotId } = req.params;

    try {
        const chart = await CriticalCareChart.findOne({ patientId });
        if (!chart) {
            res.status(404);
            throw new Error("Chart not found.");
        }

        const day = chart.days.id(dayId);
        if (!day) {
            res.status(404);
            throw new Error("Day not found in chart.");
        }

        const timeSlotIndex = day.timeSlots.findIndex(slot => slot._id.toString() === slotId);
        if (timeSlotIndex === -1) {
            res.status(404);
            throw new Error("Time slot not found.");
        }

        day.timeSlots.splice(timeSlotIndex, 1);
        await chart.save();

        const populatedChart = await chart.populate({
            path: 'days.timeSlots.lastModifiedBy',
            select: 'firstName lastName email'
        });

        res.json({
            success: true,
            message: "Time slot deleted successfully",
            chart: populatedChart
        });
    } catch (error) {
        res.status(500);
        throw new Error(`Failed to delete time slot: ${error.message}`);
    }
});

// Get chart analytics/summary
const getChartAnalytics = asyncHandler(async (req, res) => {
    const { patientId } = req.params;

    try {
        const chart = await CriticalCareChart.findOne({ patientId });
        if (!chart) {
            res.status(404);
            throw new Error("Chart not found.");
        }

        const analytics = {
            totalDays: chart.days.length,
            totalTimeSlots: chart.days.reduce((acc, day) => acc + day.timeSlots.length, 0),
            lastUpdated: chart.updatedAt,
            vitalSignsCompliance: {},
            criticalAlerts: [],
            trends: {}
        };

        // Calculate compliance and trends
        chart.days.forEach(day => {
            day.timeSlots.forEach(slot => {
                // Check vital signs compliance
                if (slot.vitals) {
                    Object.keys(slot.vitals).forEach(vital => {
                        if (!analytics.vitalSignsCompliance[vital]) {
                            analytics.vitalSignsCompliance[vital] = { recorded: 0, total: 0 };
                        }
                        analytics.vitalSignsCompliance[vital].total++;
                        if (slot.vitals[vital] !== null && slot.vitals[vital] !== '') {
                            analytics.vitalSignsCompliance[vital].recorded++;
                        }
                    });
                }

                // Check for critical alerts
                if (slot.vitals?.spo2 && slot.vitals.spo2 < 90) {
                    analytics.criticalAlerts.push({
                        type: 'Low SpO2',
                        value: slot.vitals.spo2,
                        time: slot.time,
                        date: day.date
                    });
                }
            });
        });

        res.json({
            success: true,
            analytics
        });
    } catch (error) {
        res.status(500);
        throw new Error(`Failed to get chart analytics: ${error.message}`);
    }
});

module.exports = {
    getChart,
    updateChartHeader,
    upsertTimeSlot,
    updateDayData,
    deleteTimeSlot,
    getChartAnalytics
};