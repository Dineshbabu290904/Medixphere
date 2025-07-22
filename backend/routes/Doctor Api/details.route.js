const express = require("express");
const router = express.Router();
const { getDetails, addDetails, updateDetails, deleteDetails, getCount, getDetailsByDepartment } = require("../../controllers/Doctor/details.controller.js")
const upload = require("../../middlewares/multer.middleware.js")

router.post("/getDetails", getDetails);

router.post("/addDetails", upload.single("profile"), addDetails);

router.put("/updateDetails/:id", upload.single("profile"), updateDetails);

router.delete("/deleteDetails/:id", deleteDetails);

router.get("/by-department/:departmentName", getDetailsByDepartment); // New Route

router.get("/count", getCount);

module.exports = router;