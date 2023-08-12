import express from 'express';
import ejsMate from 'ejs-mate';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import { campgroundJoiSchema } from './joiSchemas.js'
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import Campground from './models/campground.js';
import { catchAsyncError } from './utils/catchAsyncError.js';
import ExpressError from './utils/ExpressError.js';

const app = express();
const port = 3000;
const dbName = 'yelp-Camp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);

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

try {
  mongoose.connection
    .on('connecting', () => {
      console.log(`Initiating connection to ${dbName} Database`);
    })
    .on('connected', () => {
      console.log(`Connection to ${dbName} Mongo Database successful`);
    })
    .on('disconnected', () => {
      console.log(`Disconnected from ${dbName} Database`);
    });

  await mongoose.connect(`mongodb://127.0.0.1:27017/${dbName}`);
} catch (error) {
  console.log(error);
}

app.get('/', (req, res) => {
  // console.log(mongoose)
  res.render('home')
});

app.get('/campgrounds', async (req, res) => {
  const campgrounds = await Campground.find();
  res.render('campgrounds/index', { campgrounds });
});

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

app.get('/campgrounds/:id', catchAsyncError( async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/show', { campground });
}));

app.put('/campgrounds/:id', validateCampground, async (req, res) => {
  const { id } = req.params;
  // const { name, location } = req.body.campground;
  await Campground.findByIdAndUpdate(id, { ...req.body.campground});
  res.redirect(`/campgrounds/${id}`);
});

app.get('/campgrounds/:id/edit', async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/edit', { campground });
  
});

app.post('/campgrounds', validateCampground, catchAsyncError (async (req, res) => {
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
  res.redirect(`campgrounds/${camp._id}`);
}));

app.delete('/campgrounds/:id', async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  res.redirect('/campgrounds');
});

app.all('*', (req, res, next) => {
  const err = new ExpressError('Page not found.', 404);
  next(err);
});

app.use((err, req, res, next) => {
  // const { message = message ? message : 'Oops! Something went wrong.', statusCode = 500 } = err;
  if(!err.message) err.message = 'Oops! Something went wrong.'
  if(!err.statusCode) err.statusCode = 500
  res.status(err.statusCode).render('error', { err });
});

app.listen(port, () => {
  console.log(`Server up on port ${port}`);
});