import _ from 'lodash';
import User from '../models/user.js';

const getLoginPage = (req, res) => {
  res.render('auth/login');
};

const getRegisterPage = (req, res) => {
  res.render('auth/register')
};

const login = (req, res) => {
  req.flash('success', `Welcome back ${_.capitalize(req.user.username)}!`);
  const redirectUrl = res.locals.returnToUrl || '/campgrounds';
  res.redirect(redirectUrl);
};

const register = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, err => {
      if(err) return next(err);
      req.flash('success', `Welcome to Yelp Camp ${_.capitalize(req.user.username)}!`);
      return res.redirect('/campgrounds');
    });
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/register');
  }
};

const logout = (req, res, next) => {
  req.logOut(function(err){
    if(err) return next(err);

    req.flash('success', 'You have logged out.')
    res.redirect('/campgrounds');
  });

};

export {
  getLoginPage,
  login,
  getRegisterPage,
  register,
  logout
};