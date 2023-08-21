import express from 'express';
const router = express.Router();

import { catchAsyncError } from '../utils/catchAsyncError.js';
import * as campgroundController from '../controllers/campgroundController.js'
import { isLoggedIn, verifyCampCreator, validateCampground } from '../middleware.js';

// router.get('/', (req, res) => {
//   res.render('home')
// });

router.get('/new', isLoggedIn, campgroundController.viewCampCreateForm);

router.get('/:id/edit', isLoggedIn, verifyCampCreator, campgroundController.editCampground);

router.route('/')
  .get(campgroundController.getAllCampgrounds)

  .post(
      isLoggedIn,
      validateCampground,
      catchAsyncError (campgroundController.createCampground)
    );

router.route('/:id')
  .get(catchAsyncError( campgroundController.viewCampground))

  .put(
      isLoggedIn,
      verifyCampCreator,
      validateCampground,
      campgroundController.updateCampground
    )

  .delete(
      isLoggedIn,
      verifyCampCreator,
      campgroundController.deleteCampground
    );

export default router;