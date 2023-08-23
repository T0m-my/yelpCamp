import express from 'express';
import multer from 'multer';
const router = express.Router();

import { storage } from '../cloudinary/index.js';
import { catchAsyncError } from '../utils/catchAsyncError.js';
import * as campgroundController from '../controllers/campgroundController.js'
import { isLoggedIn, verifyCampCreator, validateCampground } from '../middleware.js';

// const upload = multer({ dest: 'uploads/'})
const upload = multer({ storage });

// router.get('/', (req, res) => {
//   res.render('home')
// });

router.get('/new', isLoggedIn, campgroundController.viewCampCreateForm);

router.get('/:id/edit', isLoggedIn, verifyCampCreator, campgroundController.editCampground);

router.route('/')
  .get(campgroundController.getAllCampgrounds)

  .post(
      isLoggedIn,
      upload.array('image'),
      validateCampground,
      catchAsyncError (campgroundController.createCampground)
    );

router.route('/:id')
  .get(catchAsyncError( campgroundController.viewCampground))

  .put(
      isLoggedIn,
      verifyCampCreator,
      upload.array('image'),
      validateCampground,
      campgroundController.updateCampground
    )

  .delete(
      isLoggedIn,
      verifyCampCreator,
      campgroundController.deleteCampground
    );

export default router;