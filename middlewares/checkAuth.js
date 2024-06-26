exports.isPrivate = (req, res, next) => {
    if (req.session.user) {
      return next()
    } 
    else {
      res.redirect('/login');
    }
};
  
exports.isPublic = (req, res, next) => {
    if (req.session.user) {
      res.redirect('/');
    } 
    else {
      return next();
    }
}