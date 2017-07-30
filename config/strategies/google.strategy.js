var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var User = require('../../models/userModel');

module.exports = function(app) {
    passport.use(new GoogleStrategy({
	clientID: '183929068166-nn4flm489t9k0g4niki0ikausmspthel.apps.googleusercontent.com',
	clientSecret: 'srRQYgwuKowcaOCDxG582WYf',
	callbackURL: 'http://localhost:3000/auth/google/callback/',
        passReqToCallback: true
    }, function(req, accessToken, refreshToken, profile, done) {
        if (req.user) {
            var query = {};
            if (req.user.facebook) {
                console.log('facebook');
                query = {
                    'facebook.id': req.user.facebook.id
                };
            }
            User.findOne(query, function(error, user) {
                if (user) {
                    user.google = {
                        id: profile.id,
                        token: accessToken
                    };
                    user.save();
                    done(null, user);
                }
            });
        } else {
            var query = {
                'google.id': profile.id
            };
            User.findOne(query, function(error, user) {
                if (user) {
                    done(null, user);
                } else {
                    var user = new User;
                    user.email = profile.emails[0].value;
                    user.image = profile._json.image.url;
                    user.displayName = profile.displayName;
                    user.google = {
                        id: profile.id,
                        token: accessToken
                    };
                    user.save();
                    done(null, user);
                }
            })
        }
    }
                                   ));
}

