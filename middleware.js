import Campground from './models/campground.js';
import { Review } from './models/review.js';
import ExpressError from './utils/ExpressError.js';
import { campgroundJoiSchema, reviewsJoiSchema } from './joiSchemas.js';

export const isLoggedIn = (req, res, next) => {
  if(!req.isAuthenticated()){
    req.session.returnToUrl = req.originalUrl
    req.flash('error', 'You need to login first.');
    return res.redirect('/login');
  }

  next();
};

export const storeOriginalUrl = (req, res, next) => {
  if(req.session.returnToUrl) res.locals.returnToUrl = req.session.returnToUrl;
  next();
}

export const verifyCampCreator = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if(!campground) {
    req.flash('error', 'Campground does not exist.')
    return res.redirect('/campgrounds');
    // next(new ExpressError('Campground not found.', 404));
  }
  if(!campground.creator.equals(req.user._id)){
    req.flash('error', 'You do not have permission for that action.');
    return res.redirect(`/campgrounds/${id}`);
  }

  next();
};

export const verifyReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if(!review) {
    req.flash('error', ' Cannot find that review.')
    return res.redirect(`/campgrounds/${id}`);
    // next(new ExpressError('Campground not found.', 404));
  }
  if(!review.author.equals(req.user._id)){
    req.flash('error', 'You do not have permission for that action.');
    return res.redirect(`/campgrounds/${id}`);
  }

  next();
};

export const validateCampground = (req, res, next) => {
  const { error } = campgroundJoiSchema.validate(req.body);
  if(error){
    const msg = error.details.map( element => element.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

export const validateReview = (req, res, next) => {
  const { error } = reviewsJoiSchema.validate(req.body);
  if(error){
    const msg = error.details.map( element => element.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};