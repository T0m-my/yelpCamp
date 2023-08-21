import mongoose from "mongoose";
const { Schema, model } = mongoose;

const reviewsSchema = new Schema({
  rating: {
    type: Number,
    min: 0
  },
  body: {
    type: String
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

export const Review = model('Review', reviewsSchema);