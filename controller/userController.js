const User = require("../models/User");

exports.createUser = (req, res, next) => {
  const { email, username, password } = req.body;
  console.log("Print", email === "", !username, !password);
  if (email === "" || username === "" || password === "") {
    req.flash("error", "Email, username, password fields cannot be empty.");
    return res.redirect("/users/login");
  }
  // Check for if email is already registered
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    if (user) {
      req.flash("warn", "Email is already registered");
      return res.redirect("/users/login");
    } else {
      User.create(req.body, (err, user) => {
        if (err) return next(err);
        return res.redirect("/users/login");
      });
    }
  });
};

exports.getLoginOrRegisterPage = function (req, res, next) {
  let warnings, errors;
  if (req.flash("error")) errors = req.flash("error");
  if (req.flash("warn")) warnings = req.flash("warning");

  res.render("login-signup", { errors, warnings });
};

exports.logUserIn = function (req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    req.flash("warn", "Email & Password fields required");
    return res.redirect("/users/login");
  }

  User.findOne({ email }, (err, user) => {
    user.verifyPassword(password, next, (isSame) => {
      if (!isSame) {
        return res.redirect("/users/login");
      } else {
        req.user = user;
        res.locals.user = user;
        req.session.userId = user._id;
        res.render("dashboard");
      }
    });
  });
};

exports.logOutUser = function (req, res, next) {
  //destroy the session in the server
  req.session.destroy();
  //clear the cookie in the browser
  res.clearCookie("connect.sid");
  res.redirect("/users/login");
};
