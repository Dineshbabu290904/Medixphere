const Schedule = require("../../models/Other/schedule.model");
const Appointment = require("../../models/Other/appointment.model"); // Import Appointment model
const DoctorDetail = require("../../models/Doctor/details.model"); // Import DoctorDetail model for validation

// Utility function to convert "HH:MM" to minutes from midnight
const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
};

// Utility function to convert minutes from midnight to "HH:MM"
const minutesToTime = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

// GET a doctor's full schedule (e.g., their weekly working days)
const getSchedule = async (req, res) => {
    try {
        // Expects req.body to contain doctorId or other filters
        // If req.body is empty, it will return all schedules
        const schedule = await Schedule.find(req.body).populate('doctorId', 'firstName lastName employeeId department');
        if (schedule && schedule.length > 0) {
            res.json({ success: true, message: "Schedule(s) Found!", schedule });
        } else {
            res.status(200).json({ success: true, message: "Schedule Not Found", schedule: [] }); // Return 200 with empty array
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

// Add or Update a doctor's detailed schedule (their working days, times, breaks)
const addOrUpdateSchedule = async (req, res) => {
    const { doctorId, workingDays } = req.body;

    if (!doctorId || !workingDays || !Array.isArray(workingDays)) {
        return res.status(400).json({ success: false, message: "Doctor ID and working days array are required." });
    }

    try {
        // Validate doctorId exists
        const doctorExists = await DoctorDetail.findById(doctorId);
        if (!doctorExists) {
            return res.status(404).json({ success: false, message: "Doctor not found." });
        }

        const upsertedSchedule = await Schedule.findOneAndUpdate(
            { doctorId: doctorId },
            { $set: { workingDays: workingDays } },
            { new: true, upsert: true, runValidators: true } // upsert creates if not found, runValidators ensures schema validation
        );

        const message = upsertedSchedule ? "Schedule Updated Successfully!" : "Schedule Added Successfully!";
        res.json({ success: true, message, schedule: upsertedSchedule });

    } catch (error) {
        console.error("Error adding/updating schedule:", error);
        // Handle Mongoose validation errors or other specific errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const deleteSchedule = async (req, res) => {
    try {
        let schedule = await Schedule.findByIdAndDelete(req.params.id);
        if (!schedule) {
            return res.status(404).json({ success: false, message: "No Schedule Exists!" }); // Changed to 404
        }
        const data = {
            success: true,
            message: "Schedule Deleted!",
        };
        res.json(data);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

// NEW FUNCTION: Get available time slots for a doctor on a specific date
const getDoctorAvailability = async (req, res) => {
    const { doctorId, date: queryDate } = req.query; // date should be YYYY-MM-DD

    if (!doctorId || !queryDate) {
        return res.status(400).json({ success: false, message: "Doctor ID and date are required." });
    }

    try {
        const schedule = await Schedule.findOne({ doctorId });
        if (!schedule) {
            return res.status(200).json({ success: true, message: "Doctor schedule not found.", availableSlots: [] });
        }

        const selectedDate = new Date(queryDate);
        // Ensure date is treated as UTC to prevent timezone issues with dayOfWeek
        const utcDay = selectedDate.getUTCDay(); // 0 for Sunday, 1 for Monday, etc.
        const dayOfWeekMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeek = dayOfWeekMap[utcDay];

        const todaySchedule = schedule.workingDays.find(day => day.dayOfWeek === dayOfWeek);

        if (!todaySchedule) {
            return res.status(200).json({ success: true, message: "Doctor not available on this day.", availableSlots: [] });
        }

        const { startTime, endTime, slotDuration, breaks } = todaySchedule;

        let possibleSlots = [];
        let currentSlotStartMinutes = timeToMinutes(startTime);
        const endTimeMinutes = timeToMinutes(endTime);

        // Generate all potential slots for the day
        while (currentSlotStartMinutes + slotDuration <= endTimeMinutes) {
            let slotEndMinutes = currentSlotStartMinutes + slotDuration;
            let slotStartTimeStr = minutesToTime(currentSlotStartMinutes);
            let slotEndTimeStr = minutesToTime(slotEndMinutes);

            let isDuringBreak = false;
            for (const b of breaks) {
                const breakStartMinutes = timeToMinutes(b.breakStart);
                const breakEndMinutes = timeToMinutes(b.breakEnd);
                // Check if the slot overlaps with any break
                if (
                    (currentSlotStartMinutes < breakEndMinutes && slotEndMinutes > breakStartMinutes)
                ) {
                    isDuringBreak = true;
                    break;
                }
            }

            if (!isDuringBreak) {
                possibleSlots.push({
                    start: slotStartTimeStr,
                    end: slotEndTimeStr,
                });
            }
            currentSlotStartMinutes += slotDuration;
        }

        // Get already booked appointments for this doctor on this date
        // Adjust queryDate to cover the full day in UTC
        const startOfDayUTC = new Date(queryDate);
        startOfDayUTC.setUTCHours(0, 0, 0, 0);
        const endOfDayUTC = new Date(queryDate);
        endOfDayUTC.setUTCHours(23, 59, 59, 999);

        const bookedAppointments = await Appointment.find({
            doctorId: doctorId,
            appointmentDate: {
                $gte: startOfDayUTC,
                $lte: endOfDayUTC
            },
            status: { $in: ['Scheduled'] } // Only consider 'Scheduled' as booked
        });

        // Use the start time of the appointment slot for comparison
        const bookedSlots = new Set(bookedAppointments.map(app => app.slot));

        // Filter out booked slots and slots that are in the past relative to current time for today's date
        const currentTime = new Date();
        // Convert the selectedDate to the local timezone's equivalent of midnight for proper comparison
        const selectedDateLocalMidnight = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());

        const currentHourMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
        const isToday = selectedDateLocalMidnight.toDateString() === currentTime.toDateString(); // Compare only date parts

        const availableSlots = possibleSlots.filter(slot => {
            const slotStartInMinutes = timeToMinutes(slot.start);
            // If it's today, exclude past slots
            if (isToday && slotStartInMinutes < currentHourMinutes) {
                return false;
            }
            // Exclude already booked slots
            return !bookedSlots.has(slot.start); 
        });

        res.json({ success: true, message: "Available slots retrieved successfully.", availableSlots });

    } catch (error) {
        console.error("Error getting doctor availability:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
// NEW FUNCTION: Export schedule data
const exportSchedule = async (req, res) => {
    const { doctorId, format, startDate, endDate } = req.query;

    // In a real application, you would query the database for appointments
    // for the given doctorId and date range, then format them as ICS or CSV.
    
    console.log(`Export requested for Doctor ${doctorId} in ${format} format.`);

    // For now, we'll return a placeholder to make the frontend work.
    if (format === 'ics') {
        res.setHeader('Content-Type', 'text/calendar');
        res.send('BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//My HMS//EN\nEND:VCALENDAR');
    } else {
        res.setHeader('Content-Type', 'text/csv');
        res.send('Subject,Start Date,Start Time\nSample Appointment,2024-01-01,10:00 AM');
    }
};
module.exports = { getSchedule, addOrUpdateSchedule, deleteSchedule, getDoctorAvailability, exportSchedule };