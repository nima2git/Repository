var passport = require('passport'),
    jwt = require('jsonwebtoken'),
    Member = require('../app/models/members'),
    config = require('./config'),
    jwtStrategy = require('passport-jwt').Strategy,
    extractJwt = require('passport-jwt').ExtractJwt,
    localStrategy = require('passport-local');


var localOptions = { usernameField: 'email' };

var localLogin = new localStrategy(localOptions, function (email, password, next) {
    Member.findOne({ email: email }).exec()
        .then(function (member) {
            if (!member) {
                return next({ status: "404", message: "Email not found." });
            } else {
                member.comparePassword(password, function (err, isMatch) {
                    if (err) {
                        return next(err);
                    } else if (!isMatch) {
                        return next({ status: 401, message: 'Invalid username or password' });
                    } else {
                        return next(null, member);
                    }
                });
            }
        })
        .catch(function (err) { return next(err); });
});

generateToken = function (member) {
    return jwt.sign(member, config.secret, {
        expiresIn: 10000
    });
};

setMemberInfo = function (req) {
    return {
        _id: req._id,
        firstName: req.firstName,
        lastName: req.lastName,
        email: req.email,
        issuer: "edu.uwm"
    };
};

login = function (req, res, next) {
    var memberInfo = setMemberInfo(req.member);
    res.status(200).json({ token: generateToken(memberInfo), member: req.member });
};

var jwtOptions = {
    jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secret
};

var jwtLogin = new jwtStrategy(jwtOptions, function (payload, next) {
    Member.findById(payload._id).exec()
        .then(function (member) {
            if (member) {
                return next(null, member);
            } else {
                return next(null, false);
            }
        })
        .catch(function (err) { return next(err); });
});



passport.use(jwtLogin);
passport.use(localLogin);




