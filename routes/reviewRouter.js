import express from 'express';
const router = express.Router({ mergeParams: true });

import { Review } from '../models/review.js';
import Campground from '../models/campground.js';
import { catchAsyncError } from '../utils/catchAsyncError.js';
import ExpressError from '../utils/ExpressError.js';
import { reviewsJoiSchema } from '../joiSchemas.js'

const validateReview = (req, res, next) => {
  const { error } = reviewsJoiSchema.validate(req.body);
  if(error){
    const msg = error.details.map( element => element.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.post('/', validateReview, catchAsyncError( async (req, res) => {
  const review = new Review(req.body.review);
  const campground = await Campground.findById(req.params.id);
  campground.reviews.push(review);
  await campground.save();
  await review.save();
  req.flash('success', 'Review created successfully!');
  res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:reviewId', catchAsyncError(async(req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, {$pull: { reviews: id}});
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Review successfully deleted!');
  res.redirect(`/campgrounds/${id}`);
}));

export default router;