const express = require("express");
const router = express.Router();
const { getDetails, addDetails, updateDetails, deleteDetails, getCount, getDetailsByDepartment, getAllDetails } = require("../../controllers/Patient/details.controller.js");
const upload = require("../../middlewares/multer.middleware.js")

router.post("/getDetails", getDetails);
router.get("/getAllDetails", getAllDetails);
router.post("/addDetails", upload.single("profile"), addDetails);
router.put("/updateDetails/:id", upload.single("profile"), updateDetails);
router.get("/by-department/:departmentName", getDetailsByDepartment); // New Route
router.delete("/deleteDetails/:id", deleteDetails);
router.get("/count", getCount);

module.exports = router;