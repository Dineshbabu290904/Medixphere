const patientCredential = require("../../models/Patient/credential.model.js");
const patientDetailsModel = require("../../models/Patient/details.model.js"); // Import patientDetails model
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SALT_ROUNDS = 10;

const loginHandler = async (req, res) => {
    let { loginid, password } = req.body;
    try {
        let userCredential = await patientCredential.findOne({ loginid });
        if (!userCredential) {
            return res.status(401).json({ success: false, message: "Wrong Credentials" });
        }
        
        const isMatch = await bcrypt.compare(password, userCredential.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Wrong Credentials" });
        }

        // Find the corresponding patientDetails document using patientId (which is the loginid)
        const patientDetail = await patientDetailsModel.findOne({ patientId: loginid });
        if (!patientDetail) {
            return res.status(404).json({ success: false, message: "Patient details not found. Please contact support." });
        }

        const payload = {
            user: {
                id: patientDetail._id, // Use the patient's actual detail ID in JWT
                loginid: userCredential.loginid,
                role: 'patient' 
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' }, // Token expires in 7 days
            (err, token) => {
                if (err) throw err;
                res.json({
                    success: true,
                    message: "Login Successful!",
                    token: token,
                    loginid: userCredential.loginid,
                    role: 'patient',
                    id: patientDetail._id // Return the patient's actual detail ID to the frontend
                });
            }
        );
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


const registerHandler = async (req, res) => {
    let { loginid, password } = req.body;
    try {
        let user = await patientCredential.findOne({ loginid });
        if (user) {
            return res.status(400).json({ success: false, message: "Patient With This LoginId Already Exists" });
        }
        
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        
        user = await patientCredential.create({ loginid, password: hashedPassword });
        
        res.json({ success: true, message: "Register Successful!", loginid: user.loginid, id: user.id });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const updateHandler = async (req, res) => {
    try {
        const { password } = req.body;
        
        if (password) {
            req.body.password = await bcrypt.hash(password, SALT_ROUNDS);
        }
        
        let user = await patientCredential.findByIdAndUpdate(req.params.id, req.body);
        if (!user) {
            return res.status(400).json({ success: false, message: "No Patient Exists!" });
        }
        
        res.json({ success: true, message: "Updated Successful!" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const deleteHandler = async (req, res) => {
    try {
        let user = await patientCredential.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(400).json({ success: false, message: "No Patient Exists!" });
        }
        
        res.json({ success: true, message: "Deleted Successful!" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

module.exports = { loginHandler, registerHandler, updateHandler, deleteHandler };