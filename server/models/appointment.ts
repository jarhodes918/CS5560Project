import * as mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  client: { type: String, required: true, trim: true },
  style: { type: String, required: true, trim: true },
  price: { type: Number, required: true, trim: true },
  stylist: { type: String, required: true, trim: true },
  date: { type: String, required: true, trim: true },
  time: { type: String, required: true, trim: true },
  hour: { type: String, trim: true },  
  creator: { type: String, required: true, trim: true }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
