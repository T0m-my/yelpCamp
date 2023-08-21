import { Review } from '../models/review.js';
import Campground from '../models/campground.js';

const createReview = async (req, res) => {
  const review = new Review(req.body.review);
  const campground = await Campground.findById(req.params.id);
  review.author = req.user._id;
  campground.reviews.push(review);
  await campground.save();
  await review.save();
  req.flash('success', 'Review created successfully!');
  res.redirect(`/campgrounds/${campground._id}`);
};

const deleteReview = async(req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, {$pull: { reviews: id}});
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Review successfully deleted!');
  res.redirect(`/campgrounds/${id}`);
}

export {
  createReview,
  deleteReview
};