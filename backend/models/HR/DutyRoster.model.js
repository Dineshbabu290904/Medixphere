const mongoose = require("mongoose");

const dutyRosterSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    shift: {
      type: String,
      required: true,
      enum: ["Morning", "Evening", "Night"],
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const DutyRoster = mongoose.model("DutyRoster", dutyRosterSchema);

module.exports = DutyRoster;
