import express from 'express';
const router = express.Router();

import Campground from '../models/campground.js';
import { catchAsyncError } from '../utils/catchAsyncError.js';
import ExpressError from '../utils/ExpressError.js';
import { campgroundJoiSchema } from '../joiSchemas.js'

const validateCampground = (req, res, next) => {
  const { error } = campgroundJoiSchema.validate(req.body);
  // console.log(error)
  if(error){
    const msg = error.details.map( element => element.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get('/', async (req, res) => {
  const campgrounds = await Campground.find();
  res.render('campgrounds/index', { campgrounds });
});

router.get('/new', (req, res) => {
  res.render('campgrounds/new');
});

router.get('/:id', catchAsyncError( async (req, res) => {
  const campground = await Campground.findById(req.params.id).populate('reviews');
  res.render('campgrounds/show', { campground });
}));

router.put('/:id', validateCampground, async (req, res) => {
  const { id } = req.params;
  // const { name, location } = req.body.campground;
  await Campground.findByIdAndUpdate(id, { ...req.body.campground});
  req.flash('success', 'Campground updated successfully!');
  res.redirect(`/campgrounds/${id}`);
});

router.get('/:id/edit', async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/edit', { campground });
  
});

router.post('', validateCampground, catchAsyncError (async (req, res) => {
  // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 404);
  const { name, location, price, description, image } = req.body.campground;
  const camp = new Campground({
    name,
    location,
    price,
    description,
    image
  });
  await camp.save();
  req.flash('success', 'Successfully created campground!');
  res.redirect(`campgrounds/${camp._id}`);
}));

router.delete('/:id', async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  req.flash('success', 'Campground deleted successfully!');
  res.redirect('/campgrounds');
});

export default router;