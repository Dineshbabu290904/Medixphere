const multer = require("multer");
const path = require("path"); // Import path module

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./media");
    },
    filename: function (req, file, cb) {
        // --- THE FIX ---
        // Get the file extension from the original file name (e.g., ".png", ".jpg")
        const fileExtension = path.extname(file.originalname); // Use path.extname

        let baseFilename = "";

        if (req.body?.type === "profile") {
            if (req.body.patientId) {
                baseFilename = `Patient_Profile_${req.body.patientId}`;
            } else if (req.body.employeeId) {
                baseFilename = `Staff_Profile_${req.body.employeeId}`;
            } else {
                baseFilename = `Profile_${Date.now()}`;
            }
        } else if (req.body?.type === "record") {
            baseFilename = `Record_${req.body.title.replace(/\s+/g, '_')}_${req.body.patientId}`;
        } else if (req.body?.type === "schedule") {
            baseFilename = `Schedule_${req.body.department.replace(/\s+/g, '_')}_${req.body.doctorId}`;
        } else {
            baseFilename = `${file.fieldname}_${Date.now()}`;
        }

        const finalFilename = baseFilename + fileExtension;
        cb(null, finalFilename);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf)$/i)) { // Added 'i' for case-insensitivity
            return cb(new Error('Only image and PDF files are allowed!'), false);
        }
        cb(null, true);
    }
});

module.exports = upload;