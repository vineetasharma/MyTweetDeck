/**
 * Home Controller
 *
 * Handles the routes responsible for public facing pages (non-logged in pages)
 *
 * */

var EventName = require("../src/enum/EventName");

/**
 * Handles the route which renders the dashboard page
 * @url "/"
 * */
exports.dashboard = function (req, res) {
    res.render("dashboard", {});
}.secured();

exports.findOrCreateTwitterAccount = function (accessToken, refreshToken, profile, done) {
    console.log(accessToken, 'accessToken');
    console.log(refreshToken, 'refreshToken');
    console.log(done, 'done');
    UserService.findOrCreateTwitterAccountService(accessToken, refreshToken, profile)
        .on("success", function (user) {
            console.log(user, 'user>>>>>>>>>>..');
            done(null, user);
        })
        .on("error", function (err) {
            done(err, user);
        });
};
/**
 * Handles the login form submission
 * @url "/"
 * */
exports.getProfile = function (req, res) {
    var user = req.checkLoggedIn();
    if (user) {
        UserService.getUserDetails(user._id)
            .on("success", function (user) {
                res.send(user);
            })
            .on("error", function (err) {
                res.send(null);
            });
    }
    else
        res.send(null);
}
exports.updateProfile = function (req, res) {
    log.info('update profile method called', req.body);
    var user = req.checkLoggedIn();
    if (user) {
        UserService.updateUserDetails(user._id, req.body)
            .on("success", function (user1) {
                if ((req.body.Email && req.body.reset=='Yes') || (req.body.Email && !req.body.reset)) {
                    log.info(req.body.reset,'mail send service called');

                    UserService.sendEmailVerificationLink(user._id, req.body.Name, req.body.Email)
                        .on(EventName.ERROR, function (err) {
                            log.info('Email not sent', err.message);
                        })
                        .on(EventName.DONE, function (res) {
                            console.log('Email sent successfully', res);
                        });
                }
                log.info('profile updated successfully', user);
                res.send(user);
            })
            .on("error", function (err) {
                log.error('error while updating user profile', err.message);
                res.send(null);
            });
    }
    else
        res.send(null);
}
exports.loginHandler = function (req, res) {
    req.assert('username', 'Please Enter the Username.').notEmpty();
    req.assert('password', 'Please enter a password.').notEmpty();

    //Check for errors
    var errors = req.validationErrors();
    if (Boolean(errors)) {
        res.render('index', {error: errors.reduce(function (pre, curr) {
            pre.push(curr.msg);
            return pre;
        }, [])});
        return;
    }

    AuthService.authenticate(req.param("username"), req.param("password"))
        .on(EventName.DONE, function (user) {
            res.loginUser(user._id, user.name, user.roles);
            res.redirect("/");
        })
        .on(EventName.ERROR, function (err) {
            log.error(err);
            res.render('index', {error: ["Some error occurred. Try again later."]});
        })
        .on(EventName.NOT_FOUND, function () {
            res.render('index', {error: ["Invalid Username or Password!"]});
        });
};

/**
 * Handles the logout route
 * @url "/logout"
 * */
exports.logout = function (req, res) {
    res.logoutUser();
    res.redirect("/");
};
//retweets
exports.makeTweets = function (req, res) {
    var user = req.checkLoggedIn();
    UserService.makeTweet(req.body.tweet, user)
        .on(EventName.DONE, function (user) {
            res.end('go check your tweets!');
        })
        .on(EventName.ERROR, function (err) {
            log.error(err);
            res.end('bad stuff happened, none tweetage');
        })
        .on(EventName.NOT_FOUND, function () {
            res.end('User not found ');
        });
}

exports.getTweets = function (req, res) {
    var user = req.checkLoggedIn();
    var tweets;
    UserService.getUserTweets(user)
        .on(EventName.DONE, function(data) {
            res.send(JSON.parse(data));
        })
        .on(EventName.ERROR, function (err) {
            log.error(err);
            res.send(err);
        })
        .on(EventName.NOT_FOUND, function () {
            res.send(null);
        });

}
exports.getSpecificUserTimelineTweet = function (req, res) {
    var user = req.checkLoggedIn();
    var tweets;
    data={id: req.param('user_id'),screen_name: req.param('screen_name')};
//    log.info(data,'params.....',req.param('screen_name'));
    UserService.getSpecificTweets(user,data)
        .on(EventName.DONE, function(data) {
            console.log('data in controller........',data);
            res.send(data);
        })
        .on(EventName.ERROR, function (err) {
            log.error(err);
            res.send(err);
        })
        .on(EventName.NOT_FOUND, function () {
            res.send(null);
        });

}
exports.searchTweets = function (req, res) {
    var user = req.checkLoggedIn();
    data={text: req.param('text')};
    UserService.searchTweets(user,data)
        .on(EventName.DONE, function(data) {
            console.log('search Tweets:........',data);
            res.send(JSON.parse(data));
        })
        .on(EventName.ERROR, function (err) {
            log.error(err);
            res.send(err);
        })
        .on(EventName.NOT_FOUND, function () {
            res.send(null);
        });

}
exports.getFriendList = function (req, res) {
    log.info('getFriendList method called');
    var user = req.checkLoggedIn();
    var tweets;
    UserService.getUserFriendList(user)
        .on(EventName.DONE, function(data) {
            console.log('data in controller........',data);
            try{
                data=JSON.parse(data);
                res.send(data);
            }
            catch(e){
                log.error(e);
                res.send(null);
            }

        })
        .on(EventName.ERROR, function (err) {
            log.error(err);
            res.send(err);
        })
        .on(EventName.NOT_FOUND, function () {
            res.send(null);
        });

}
exports.getUserByName = function (req, res) {
    log.info('getUserBy Name method called');
    var user = req.checkLoggedIn();
    var tweets;
    UserService.getUserByName(user,{name:req.param("name")})
        .on(EventName.DONE, function(data) {
            log.info('user by name in controller........',data);
            try{
                data=JSON.parse(data);
                res.send(data);
            }
            catch(e){
                log.error(e);
                res.send(null);
            }

        })
        .on(EventName.ERROR, function (err) {
            log.error(err);
            res.send(err);
        })
        .on(EventName.NOT_FOUND, function () {
            res.send(null);
        });

}
exports.reTweet = function (req, res) {
    var user = req.checkLoggedIn();
    console.log('id:' + req.body.id);
    UserService.reTweets(user, req.body.id)
        .on(EventName.DONE, function (data) {
            res.send(data);
        })
        .on(EventName.ERROR, function (err) {
            log.error(err);
            res.send(null);
        })
        .on(EventName.NOT_FOUND, function () {
            res.send(null);
        });
}
exports.makeFavourite = function (req, res) {
    var user = req.checkLoggedIn();
    if (user) {
        UserService.favourite(user, req.body.tweet)
            .on(EventName.DONE, function (data) {
                res.send(data);
            })
            .on(EventName.ERROR, function (err) {
                log.error(err);
                res.send(null);
            });
    }
    else {
        res.send(null);
    }
}
//get favorite tweets from DB....
exports.getFavouriteTweets = function (req, res) {
    var user = req.checkLoggedIn();
    if (user) {
        User.findOne({_id: user._id}, function (err, userDetails) {
            if (err) {
                console.log('errrrrrror', err);
                res.send(null);
            }
            else {
                Tweet.find({twitterId: userDetails.twitterId}, function (err, tweets) {
                    if (err) {
                        console.log('errrrrrror', err);
                        res.send(null)
                    }
                    else {
//                        console.log('got favourite tweets', tweets);
                        res.send(tweets);
                    }
                });
            }
        });
    }
}
exports.verifyEmail = function (req, res) {
    log.info('verfication Code is executed', req.params.verificationCode);
    UserService.verifyEmailService(req.params.verificationCode)
        .on(EventName.DONE, function (data) {
            log.info('Your Email has been verified.');
        })
        .on(EventName.ERROR, function (err) {
            log.error(err);
        })
        .on(EventName.NOT_FOUND, function (data) {
            log.info('You have a verified Email.');
            res.redirect('/');
        });
}
exports.followUser = function (req, res) {
    var user = req.checkLoggedIn();
    UserService.follow(req.body.data, user)
        .on(EventName.DONE, function (user) {
            res.end(user);
        })
        .on(EventName.ERROR, function (err) {
            log.error(err);
            res.send(null);
        })
        .on(EventName.NOT_FOUND, function () {
            res.end('User not found ');
        });
}
exports.unFollowUser = function (req, res) {
    var user = req.checkLoggedIn();
    UserService.unFollow(req.body.data, user)
        .on(EventName.DONE, function (user) {
            res.end(user);
        })
        .on(EventName.ERROR, function (err) {
            log.error(err);
            res.send(null);
        })
        .on(EventName.NOT_FOUND, function () {
            res.end('User not found ');
        });
}
