import mongoose from "mongoose";
const { Schema, model } = mongoose;

const reviewsSchema = new Schema({
  rating: {
    type: Number,
    min: 0
  },
  body: {
    type: String
  }
});

export const Review = model('Review', reviewsSchema);