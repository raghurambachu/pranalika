const User = require("../models/User");

exports.verifyUserLoggedIn = function (req, res, next) {
  if (req.session && req.session.userId) {
    next();
  } else {
    req.flash(
      "error",
      "Unaunthenticated user! Please login to access the resource."
    );
    return res.redirect("/users/login");
  }
};

exports.userInfo = function (req, res, next) {
  const userId = req.session && req.session.userId;
  if (userId) {
    User.findById(userId, "-password", (err, user) => {
      if (err) return next(err);
      req.user = user;

      res.locals.user = user;
      next();
    });
  } else {
    req.user = null;
    res.locals.user = null;
    next();
  }
};
