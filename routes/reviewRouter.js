import express from 'express';
const router = express.Router({ mergeParams: true });

import { catchAsyncError } from '../utils/catchAsyncError.js';
import * as reviewController from '../controllers/reviewController.js'
import { validateReview, isLoggedIn, verifyReviewAuthor } from '../middleware.js';

router.route('/')
  .post(
    isLoggedIn,
    validateReview,
    catchAsyncError( reviewController.createReview)
  );

router.route('/:reviewId')
  .delete(
    isLoggedIn,
    verifyReviewAuthor,
    catchAsyncError(reviewController.deleteReview)
  );

export default router;