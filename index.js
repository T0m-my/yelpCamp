import express from 'express';
import ejsMate from 'ejs-mate';
import mongoose from 'mongoose';
import flash from 'connect-flash'
import session from 'express-session';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import campgroundRouter from './routes/campgroundRouter.js'
import reviewRouter from './routes/reviewRouter.js'
import ExpressError from './utils/ExpressError.js';

const app = express();
const port = 3000;
const dbName = 'yelp-Camp';
const sessionConfig = {
  secret: 'iLoveCarolyn',
  resave: false,
  saveUnitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(session(sessionConfig));
app.use(flash());
// app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);

//validateCamp



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

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.get('/', (req, res) => {
  res.render('home')
});

app.use('/campgrounds', campgroundRouter);
app.use('/campgrounds/:id/reviews', reviewRouter);

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