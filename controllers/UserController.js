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
    makeTweet(user, function (error, data) {
        if (error) {
            console.log(require('sys').inspect(error));
            res.end('bad stuff happened, none tweetage');
        } else {
            console.log(data);
            res.end('go check your tweets!');
        }
    });
}
makeTweet = function (user, cb) {
    if (user) {
        User.findOne({_id: user._id}, function (err, data) {
            if (err) {
                console.log('error', err);
            }
            else {
                new _OAuth(
                    "https://twitter.com/oauth/request_token"
                    , "https://twitter.com/oauth/access_token"
                    , _config.twitterAuth.consumerKey
                    , _config.twitterAuth.consumerSecret
                    , "1.0A"
                    , "http://localhost:9092/twitter/auth/callback"
                    , "HMAC-SHA1"
                ).post(
                    "https://api.twitter.com/1.1/statuses/update.json"
                    , data.accessToken
                    , data.refreshToken
                    , {"status": " Second Tweet using node modules....." }
                    , cb
                );
            }
        });

    }
}
exports.getTweets = function (req, res) {
    var user = req.checkLoggedIn();
    getUserTweets(user, function (error, data) {
        if (error) {
            console.log(require('sys').inspect(error));
            res.end('bad stuff happened, none tweetage');
        } else {
            console.log(data);
            res.send(JSON.parse(data));
        }
    });
}
getUserTweets = function (user, cb) {
    if (user) {
        User.findOne({_id: user._id}, function (err, data) {
            if (err) {
                console.log('error', err);
            }
            else {
                new _OAuth(
                    "https://twitter.com/oauth/request_token"
                    , "https://twitter.com/oauth/access_token"
                    , _config.twitterAuth.consumerKey
                    , _config.twitterAuth.consumerSecret
                    , "1.0A"
                    , "http://localhost:9092/twitter/auth/callback"
                    , "HMAC-SHA1"
                ).get(
                        "https://api.twitter.com/1.1/statuses/home_timeline.json?count=10"
                        , data.accessToken
                        , data.refreshToken
                        , cb
                    );
            }
        });

    }
}

exports.reTweet = function (req, res) {
    console.log('metooooooooooooooooooooooooddddddddddddddddddddddddddddddddddddddddddd callllllllllllllllldedddddddddddddd');
    var user = req.checkLoggedIn();
    console.log('iddddddddddddddddd>>>>>>>>>>>' + req.body.id);
    reTweets(user, req.body.id, function (error, data) {
        console.log('callback called');
        if (error) {
            console.log(require('sys').inspect(error));
            res.end('bad stuff happened, none tweetage');
        } else {
            console.log(data);
            res.send(data);
        }
    });
}
reTweets = function (user, id, cb) {
    if (user) {
        User.findOne({_id: user._id}, function (err, data) {
            if (err) {
                console.log('error', err);
            }
            else {
                console.log('auth/////');
                var request = new _OAuth(
                    "https://twitter.com/oauth/request_token"
                    , "https://twitter.com/oauth/access_token"
                    , _config.twitterAuth.consumerKey
                    , _config.twitterAuth.consumerSecret
                    , "1.0A"
                    , "http://localhost:9092/twitter/auth/callback"
                    , "HMAC-SHA1"
                ).post(
                        "https://api.twitter.com/1.1/statuses/retweet/" + id + ".json"
                        , data.accessToken
                        , data.refreshToken
                    );
                var data = "";
                request.addListener('response', function (response) {
                    response.setEncoding('utf8');
                    response.addListener('data', function (chunk) {
                        data=data+chunk;
                        console.log(chunk);
                    });
                    response.addListener('end', function () {
                        console.log('--- END ---',data);
                    });
                });
                request.end();
            }
        });

    }
}
exports.makeFavourite = function (req, res) {
    var user = req.checkLoggedIn();
    if (user) {
        User.update({_id: user._id}, {$push: {favouriteTweets: req.body.tweet}}, function (err, data) {
            if (err) {
                console.log('errrrrrror', err);
                res.send(null);
            }
            else {
                console.log('data updated');
                res.send(data);
            }
        });
    }
}