import mongoose from 'mongoose';
import { Review } from './review.js';
import User from './user.js';
const { Schema } = mongoose;

const imageSchema = new mongoose.Schema({
  url: String,
  filename: String
});

imageSchema.virtual('thumbnail').get(function(){
  return this.url.replace('/upload', '/upload/w_200,h_200');
});

const campgroundSchema = new mongoose.Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  name: String,
  price: Number,
  images: [imageSchema],
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