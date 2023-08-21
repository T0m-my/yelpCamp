import express from 'express';
const router = express.Router();
import passport from 'passport';
import { storeOriginalUrl } from '../middleware.js';
import { catchAsyncError } from '../utils/catchAsyncError.js';
import * as authController from '../controllers/authController.js';

router.route('/login')
  .get( authController.getLoginPage )

  .post(
    storeOriginalUrl,
    passport.authenticate(
      'local',
      { failureFlash: true, failureRedirect: '/login' }
    ),
    authController.login
  );

router.route('/register')
  .get( authController.getRegisterPage )

  .post( catchAsyncError(authController.register));

router.get('/logout', authController.logout);

export default router;