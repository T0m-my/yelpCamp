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