import mongoose from 'mongoose';
import { Review } from './review.js';
const { Schema } = mongoose;

const campgroundSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String,
  location: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
});

campgroundSchema.post('findOneAndDelete', async function(doc){
  if(doc){
    await Review.deleteMany({ _id: { $in: doc.reviews} });
  }
});

export default mongoose.model('Campground', campgroundSchema);