const adminCredential = require("../../models/Admin/credential.model.js");
const adminDetailsModel = require("../../models/Admin/details.model.js"); // Import adminDetails model
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SALT_ROUNDS = 10;

const loginHandler = async (req, res) => {
    let { loginid, password } = req.body;
    try {
        let userCredential = await adminCredential.findOne({ loginid });
        if (!userCredential) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
        
        const isMatch = await bcrypt.compare(password, userCredential.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Find the corresponding adminDetails document using employeeId (which is the loginid)
        const adminDetail = await adminDetailsModel.findOne({ employeeId: loginid });
        if (!adminDetail) {
            return res.status(404).json({ success: false, message: "Admin details not found. Please contact support." });
        }
        
        const payload = { 
            user: { 
                id: adminDetail._id, // Use the admin's actual detail ID in JWT
                loginid: userCredential.loginid, 
                role: 'admin' 
            } 
        };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) throw err;
            res.json({
                success: true,
                message: "Login Successful!",
                token,
                id: adminDetail._id, // Return the admin's actual detail ID to the frontend
                loginid: userCredential.loginid,
                role: 'admin'
            });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const updateHandler = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const { id: credentialId } = req.params; // Using the credential's _id from params
    try {
        // Find the credential document by its _id from the token, not a separate one from params
        const user = await adminCredential.findById(credentialId);
        if (!user) {
            return res.status(404).json({ success: false, message: "Admin not found." });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Incorrect current password." });
        }
        
        const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
        user.password = hashedPassword;
        await user.save();
        
        res.json({ success: true, message: "Password updated successfully!" });
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


const registerHandler = async (req, res) => {
    let { loginid, password } = req.body;
    try {
        let user = await adminCredential.findOne({ loginid });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "Admin With This LoginId Already Exists",
            });
        }
        
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        
        user = await adminCredential.create({
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



const deleteHandler = async (req, res) => {
    try {
        let user = await adminCredential.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "No Admin Exists!",
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