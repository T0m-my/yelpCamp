import mongoose from 'mongoose';
const { Schema } = mongoose;

const campgroundSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String,
  location: String
});

export default mongoose.model('Campground', campgroundSchema);