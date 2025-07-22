// --- START OF FILE Doctor/credential.controller.js ---

const doctorCredential = require("../../models/Doctor/credential.model.js");
const doctorDetailsModel = require("../../models/Doctor/details.model.js"); // Import doctorDetails model
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SALT_ROUNDS = 10;

const loginHandler = async (req, res) => {
    let { loginid, password } = req.body;
    try {
        let userCredential = await doctorCredential.findOne({ loginid });
        if (!userCredential) {
            return res.status(401).json({ success: false, message: "Wrong Credentials" });
        }
        
        const isMatch = await bcrypt.compare(password, userCredential.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Wrong Credentials" });
        }

        // Find the corresponding doctorDetails document using employeeId which is the loginid
        const doctorDetail = await doctorDetailsModel.findOne({ employeeId: loginid });
        if (!doctorDetail) {
            return res.status(404).json({ success: false, message: "Doctor details not found. Please contact support." });
        }

        const payload = {
            user: {
                id: doctorDetail._id, // Use the doctor's actual detail ID in JWT
                loginid: userCredential.loginid,
                role: 'doctor' 
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    success: true,
                    message: "Login Successful!",
                    token: token,
                    loginid: userCredential.loginid,
                    role: 'doctor', 
                    id: doctorDetail._id // Return the doctor's actual detail ID to the frontend
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
        let user = await doctorCredential.findOne({ loginid });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "Doctor With This LoginId Already Exists",
            });
        }
        
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        
        user = await doctorCredential.create({
            loginid,
            password: hashedPassword,
        });
        
        const data = {
            success: true,
            message: "Register Successful!",
            loginid: user.loginid,
            id: user.id,
        };
        res.json(data);
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
        
        let user = await doctorCredential.findByIdAndUpdate(
            req.params.id,
            req.body
        );
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "No Doctor Exists!",
            });
        }
        
        const data = {
            success: true,
            message: "Updated Successful!",
        };
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const deleteHandler = async (req, res) => {
    try {
        let user = await doctorCredential.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "No Doctor Exists!",
            });
        }
        
        const data = {
            success: true,
            message: "Deleted Successful!",
        };
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

module.exports = { loginHandler, registerHandler, updateHandler, deleteHandler };