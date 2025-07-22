const TestReport = require("../../models/Other/testreport.model.js");

const getTestReport = async (req, res) => {
    try {
        let report = await TestReport.find(req.body);
        if (!report) {
            return res
                .status(400)
                .json({ success: false, message: "Reports Not Available" });
        }
        const data = {
            success: true,
            message: "All Reports Loaded!",
            report,
        };
        res.json(data);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const addTestReport = async (req, res) => {
    let { patientId, results } = req.body;
    try {
        let existingReport = await TestReport.findOne({ patientId });
        if (existingReport) {
            if (results) {
                existingReport.results = { ...existingReport.results, ...results };
            }
            await existingReport.save();
            const data = {
                success: true,
                message: "Test Report Updated!",
            };
            res.json(data);
        } else {
            await TestReport.create(req.body);
            const data = {
                success: true,
                message: "Test Report Added!",
            };
            res.json(data);
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const deleteTestReport = async (req, res) => {
    try {
        let report = await TestReport.findByIdAndDelete(req.params.id);
        if (!report) {
            return res
                .status(400)
                .json({ success: false, message: "No Report Data Exists!" });
        }
        const data = {
            success: true,
            message: "Report Deleted!",
        };
        res.json(data);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

module.exports = { getTestReport, addTestReport, deleteTestReport };