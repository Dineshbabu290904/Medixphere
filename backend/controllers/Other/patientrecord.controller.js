const PatientRecord = require("../../models/Other/patientrecord.model");

const getPatientRecord = async (req, res) => {
    try {
        let record = await PatientRecord.find(req.body);
        if (!record) {
            return res
                .status(400)
                .json({ success: false, message: "No Record Available!" });
        }
        res.json({ success: true, message: "Record Found!", record });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const addPatientRecord = async (req, res) => {
    let { doctorName, patientId, title } = req.body;
    try {
        await PatientRecord.create({
            doctorName,
            link: req.file.filename,
            patientId,
            title,
        });
        const data = {
            success: true,
            message: "Patient Record Added!",
        };
        res.json(data);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const updatePatientRecord = async (req, res) => {
    let { doctorName, link, patientId, title } = req.body;
    try {
        let record = await PatientRecord.findByIdAndUpdate(req.params.id, {
            doctorName,
            link,
            patientId,
            title,
        });
        if (!record) {
            return res
                .status(400)
                .json({ success: false, message: "No Record Available!" });
        }
        res.json({
            success: true,
            message: "Record Updated!",
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const deletePatientRecord = async (req, res) => {
    try {
        let record = await PatientRecord.findByIdAndDelete(req.params.id);
        if (!record) {
            return res
                .status(400)
                .json({ success: false, error: "No Record Available!" });
        }
        res.json({
            success: true,
            message: "Record Deleted!",
            record,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
module.exports = { getPatientRecord, addPatientRecord, updatePatientRecord, deletePatientRecord };