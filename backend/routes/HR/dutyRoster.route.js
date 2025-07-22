const express = require('express');
const router = express.Router();
const { getRoster, createRoster, updateRoster, deleteRoster } = require('../../controllers/HR/dutyRoster.controller');
// Add auth middleware later

router.route('/')
  .get(getRoster)
  .post(createRoster);

router.route('/:id')
  .put(updateRoster)
  .delete(deleteRoster);

module.exports = router;