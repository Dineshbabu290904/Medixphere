const MedicalTest = require("../../models/Other/medicaltest.model");

const getMedicalTest = async (req, res) => {
    try {
        let tests = await MedicalTest.find();
        if (!tests) {
            return res
                .status(400)
                .json({ success: false, message: "No Medical Tests Available" });
        }
        const data = {
            success: true,
            message: "All Medical Tests Loaded!",
            tests,
        };
        res.json(data);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const addMedicalTest = async (req, res) => {
    let { name, code } = req.body;
    try {
        let test = await MedicalTest.findOne({ code });
        if (test) {
            return res
                .status(400)
                .json({ success: false, message: "Medical Test Already Exists" });
        }
        await MedicalTest.create({
            name,
            code,
        });
        const data = {
            success: true,
            message: "Medical Test Added!",
        };
        res.json(data);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const deleteMedicalTest = async (req, res) => {
    try {
        let test = await MedicalTest.findByIdAndDelete(req.params.id);
        if (!test) {
            return res
                .status(400)
                .json({ success: false, message: "No Medical Test Exists!" });
        }
        const data = {
            success: true,
            message: "Medical Test Deleted!",
        };
        res.json(data);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

module.exports = { getMedicalTest, addMedicalTest, deleteMedicalTest };