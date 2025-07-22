const mongoose = require('mongoose');

// Define all sub-schemas from the specification
const VitalsSchema = new mongoose.Schema({ 
  pulse: Number, 
  bp_systolic: Number, 
  bp_diastolic: Number, 
  temp: Number, 
  spo2: Number, 
  cvp: Number, 
  rhythm: String, // e.g., "NSR", "AFib"
  rhythm_regular: Boolean,
  rhythm_arrhythmia_type: String,
  bp_cuff_size: String, // Adult/Pediatric
  bp_method: String, // Manual/Automatic
  temp_unit: { type: String, enum: ['F', 'C'], default: 'F' }, // Fahrenheit/Celsius
  temp_site: String, // Oral, Rectal, Axillary, Tympanic
}, { _id: false });

const GcsSchema = new mongoose.Schema({ 
  eye: Number, 
  verbal: Number, 
  motor: Number 
}, { _id: false });

const PupilSchema = new mongoose.Schema({ 
  size: String, // e.g., "3mm"
  reaction: String // e.g., "Brisk", "Sluggish", "Fixed"
}, { _id: false });

const IntakeOutputSchema = new mongoose.Schema({ 
  hourly_iv: Number, 
  oral_feed: Number, 
  total_oral: Number,
  urine: Number, 
  drainage: Number,
  urine_character: String, // Clear/Cloudy/Bloody
  drain_type: String, // Chest tube, Surgical drain, etc.
  stool_freq: String,
  stool_consistency: String,
  emesis_volume: Number,
  emesis_character: String,
  insensible_losses: Number // Estimated
}, { _id: false });

const NursingCareSchema = new mongoose.Schema({ 
  position_change: Boolean, 
  mouth_care: Boolean, 
  dressing_change: Boolean, 
  eye_care: Boolean, 
  bed_sore_care: Boolean,
  bath: Boolean,
  foley_care: Boolean,
  skin_assessment: String // e.g., "Intact", "Redness"
}, { _id: false });

const VentilatorSchema = new mongoose.Schema({ 
  mode: String, 
  fio2: Number, 
  set_tidal_vol: Number, // Set TV
  expired_tv: Number, // Expired TV
  set_rate: Number, // Set RR
  resp_rate: Number, // Total RR
  spontaneous_rate: Number,
  mandatory_rate: Number,
  ie_ratio: String, 
  peep: Number, 
  pressure_support: Number, 
  peak_airway_pressure: Number,
  plateau_pressure: Number,
  driving_pressure: Number,
  compliance: Number,
  inspiratory_time: Number,
  expiratory_time: Number,
  nebulisation: String,
  nebulisation_type: String,
  nebulisation_freq: String
}, { _id: false });

const AbgSchema = new mongoose.Schema({ 
  ph: Number, 
  pco2: Number, 
  po2: Number, 
  hco3: Number, 
  be: Number, 
  na: Number, 
  k: Number, 
  cl: Number,
  ca: Number,
  mg: Number,
  po4: Number,
  hgb: Number, // Hemoglobin
  hct: Number, // Hematocrit
  sao2: Number // ABG calculated SaO2
}, { _id: false });

const PatientPositioningSchema = new mongoose.Schema({
  position: { type: String, enum: ['Supine', 'Prone', 'Left Lateral', 'Right Lateral', 'Semi-Fowler\'s', 'Fowler\'s', 'High Fowler\'s', 'Trendelenburg', 'Reverse Trendelenburg', 'Custom'] },
  custom_position_notes: String,
  mobility_bed: { type: String, enum: ['Independent', 'Assisted', 'Dependent'] },
  mobility_transfers: String, // e.g., "Chair", "Commode", "Ambulation"
  rom: { type: String, enum: ['Active', 'Passive', 'Restricted'] }, // Range of Motion
  restraints: { type: [String], enum: ['None', 'Soft', 'Mitt', 'Vest'] },
  restraint_order_ref: String // Physician order for restraints
}, { _id: false });

const CatheterTubeSchema = new mongoose.Schema({
  type: { type: String, enum: ['Arterial Line', 'CVC', 'Swan-Ganz', 'Foley', 'ICD', 'ET Tube', 'Tracheostomy', 'Ryle\'s Tube', 'Peritoneal Dialysis Catheter'] },
  location: String,
  insertion_date: Date,
  size: String, // French size, mm for ET tube
  status: String, // e.g., "Patent", "Occluded", "Dry", "Intact"
  complications: String, // e.g., "None", "Infection", "Bleeding"
  notes: String
}, { _id: false });

const TimeSlotSchema = new mongoose.Schema({
  time: { type: String, required: true },
  vitals: VitalsSchema,
  gcs: GcsSchema,
  pupils: { r: PupilSchema, l: PupilSchema },
  intake_output: IntakeOutputSchema,
  nursing_care: NursingCareSchema,
  ventilator: VentilatorSchema,
  abg: AbgSchema,
  positioning: PatientPositioningSchema,
  lastModifiedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    refPath: 'lastModifiedByUserModel' // Tells Mongoose to look at the 'lastModifiedByUserModel' field to know which model to populate from
  },
  lastModifiedByUserModel: {
    type: String,
    enum: ['Admin Detail', 'Doctor Detail'] // The possible models this can refer to
  },
  history: [mongoose.Schema.Types.Mixed]
});


const IvFluidSchema = new mongoose.Schema({ 
  name: String, 
  volume_started: String, 
  time_start: String, 
  time_stop: String, 
  total_volume: String, 
  nurse_signature: String,
  rate: String, // mL/hr
  site: String, // location and gauge
  insertion_date: Date,
  site_condition: String,
  dressing_condition: String,
  complications: String
}, { _id: false });

const DrugSchema = new mongoose.Schema({ 
  date: String,
  drug: String, 
  dose: String, 
  time: String, 
  route: String, 
  nurse_sign: String, 
  ordered_by: String,
  frequency: String, // QD, BID, PRN, etc.
  indication: String,
  allergy_check: Boolean,
  contraindication_alert: Boolean,
  pump_type: String,
  infusion_rate: String,
  volume_infused_pump: Number
}, { _id: false });

const BloodProductSchema = new mongoose.Schema({ 
  name: String, 
  volume: String, 
  start_time: String, 
  stop_time: String, 
  nurse_sign: String,
  compatibility_check: Boolean,
  reaction_monitored: Boolean,
  reaction_notes: String
}, { _id: false });

const InvestigationSchema = new mongoose.Schema({
  test_name: String,
  type: { type: String, enum: ['Lab', 'Imaging'] },
  order_status: { type: String, enum: ['Ordered', 'Collected', 'Pending', 'Complete'] },
  priority: { type: String, enum: ['Routine', 'Urgent', 'STAT'] },
  result_link: String,
  ordered_by: String,
  order_date: Date
}, { _id: false });

const DietSchema = new mongoose.Schema({
  type: { type: String, enum: ['NPO', 'Clear Liquids', 'Full Liquids', 'Soft Diet', 'Regular Diet', 'Diabetic Diet', 'Cardiac Diet', 'Renal Diet', 'Custom'] },
  notes: String,
  daily_calorie_target: Number,
  enteral_feeding_rate: Number,
  parenteral_nutrition_rate: Number,
  oral_intake_percent: Number,
  protein_grams: Number,
  carb_grams: Number,
  fat_grams: Number,
  nutritional_status: String
}, { _id: false });

const PhysiotherapySessionSchema = new mongoose.Schema({
  session_type: String,
  duration_minutes: Number,
  frequency: String,
  therapist: String,
  patient_response: String,
  progress_notes: String,
  mobility_assessment: String
}, { _id: false });

const ChartDaySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  catheters_tubes_summary: String,
  catheters_tubes: [CatheterTubeSchema],
  investigations_sent: [InvestigationSchema],
  investigations_pending: [InvestigationSchema],
  nutrition_calories_summary: String,
  nutrition_details: DietSchema,
  fluid_intake_24hr: Number,
  total_output_24hr: Number,
  cumulative_balance: Number,
  physiotherapy: [PhysiotherapySessionSchema],
  shift_day_notes: String,
  shift_night_notes: String,
  iv_fluids: [IvFluidSchema], // Added for dynamic table
  drugs_administered: [DrugSchema], // Added for dynamic table
  blood_products: [BloodProductSchema], // Added for dynamic table
  timeSlots: [TimeSlotSchema],
});

const CriticalCareChartSchema = new mongoose.Schema({
  patientId: { type: String, required: true, ref: 'Patient Detail', unique: true },
  weight: String,
  age_sex: String,
  bed_no: String,
  primary_consultant: String,
  days_in_icu: Number,
  intropes: String,
  diagnosis: String,
  operation_performed: String,
  post_op_day: Number,
  days: [ChartDaySchema],
}, { timestamps: true });

module.exports = mongoose.model("CriticalCareChart", CriticalCareChartSchema);