import * as mongoose from 'mongoose';

const styleSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, trim: true }
});

const Style = mongoose.model('Style', styleSchema);

export default Style;
