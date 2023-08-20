import express from 'express';
const router = express.Router();
import passport from 'passport';
import _ from 'lodash';
import User from '../models/user.js';
import { storeOriginalUrl } from '../middleware.js';
import { catchAsyncError } from '../utils/catchAsyncError.js';

router.route('/login')
  .get( (req, res) => {
    res.render('auth/login');
  })

  .post( storeOriginalUrl, passport.authenticate(
      'local',
      { failureFlash: true, failureRedirect: '/login' }
    ),
    (req, res) => {
      req.flash('success', `Welcome back ${_.capitalize(req.user.username)}!`);
      const redirectUrl = res.locals.returnToUrl || '/campgrounds';
      res.redirect(redirectUrl);
    }
  );

router.route('/register')
  .get( (req, res) => {
    res.render('auth/register')
  })

  .post( catchAsyncError( async (req, res, next) => {
    const { username, email, password } = req.body;
    try {
      
      const newUser = new User({ username, email });
      const registeredUser = await User.register(newUser, password);
      req.login(registeredUser, err => {
        if(err) return next(err);
        req.flash('success', `Welcome to Yelp Camp ${_.capitalize(req.user.username)}!`);
        console.log('***SESSION**',req.session)
        console.log('?????**ORIGINAL_URL',req.originalUrl)
        return res.redirect('/campgrounds');
      });
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('/register');
    }
  }));

router.get('/logout', (req, res, next) => {
  req.logOut(function(err){
    if(err) return next(err);

    req.flash('success', 'You have logged out.')
    res.redirect('/campgrounds');
  });

});

export default router;