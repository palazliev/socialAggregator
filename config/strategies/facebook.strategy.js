var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../../models/userModel');

module.exports = function() {
    passport.use(new FacebookStrategy({
        clientID: '1441706375895363',
        clientSecret: '5cc06cdcfe25d2434dfc956563176b8d',
        callbackURL: 'http://localhost:3000/auth/facebook/callback',
        passReqToCallback: true
    }, function(req, accessToken, refreshToken, profile, done) {
        if (req.user) {
            var query = {};
            if (req.user.google) {
                query = {
                    'google.id': req.user.google.id
                };
            }
            User.findOne(query, function(error, user) {
                if (user) {
                    user.facebook = {
                        id: profile.id,
                        token: accessToken
                    };
                    user.save();
                    done(null, user);
                }
            });

        } else {
            var query = {
                'facebook.id': profile.id
            };
            User.findOne(query, function(error, user) {
                if (user) {
                    done(null, user);
                } else {
                    var user = new User;
                    // user.email = profile.emails[0].value;
                    // user.image = profile._json.image.url;
                    user.displayName = profile.displayName;
                    user.facebook = {
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
};
 
