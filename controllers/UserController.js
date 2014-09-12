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
    if (user) {
        User.findOne({_id: user._id}, function (err, data) {
            if (err) {
                console.log('error', err);
            }
            else {
                var obj = {
                    consumer_key: _config.twitterAuth.consumerKey,
                    consumer_secret: _config.twitterAuth.consumerSecret,
                    access_token_key: data.accessToken,
                    access_token_secret: data.refreshToken,

                    headers: {
                        'Accept': '*/*',
                        'Connection': 'close',
                        'User-Agent': 'node-twitter/' + '0.2.12'
                    },

                    request_token_url: 'https://api.twitter.com/oauth/request_token',
                    access_token_url: 'https://api.twitter.com/oauth/access_token',
                    authenticate_url: 'https://api.twitter.com/oauth/authenticate',
                    authorize_url: 'https://api.twitter.com/oauth/authorize',
                    callback_url: null,

                    rest_base: 'https://api.twitter.com/1.1',
                    stream_base: 'https://stream.twitter.com/1.1',
                    search_base: 'https://api.twitter.com/1.1/search',
                    user_stream_base: 'https://userstream.twitter.com/1.1',
                    site_stream_base: 'https://sitestream.twitter.com/1.1',
                    filter_stream_base: 'https://stream.twitter.com/1.1/statuses',

                    secure: false, // force use of https for login/gatekeeper
                    cookie: 'twauth',
                    cookie_options: {},
                    cookie_secret: null
                };
                var T = _twitter(obj);
                T.getHomeTimeline(function (data) {
                    console.log('data', data);
                    res.send(data);

                });

            }
        });

    }
}
exports.getMention = function (req, res) {
    var user = req.checkLoggedIn();
    if (user) {
        User.findOne({_id: user._id}, function (err, data) {
            if (err) {
                console.log('error', err);
            }
            else {
                var obj = {
                    consumer_key: _config.twitterAuth.consumerKey,
                    consumer_secret: _config.twitterAuth.consumerSecret,
                    access_token_key: data.accessToken,
                    access_token_secret: data.refreshToken,

                    headers: {
                        'Accept': '*/*',
                        'Connection': 'close',
                        'User-Agent': 'node-twitter/' + '0.2.12'
                    },

                    request_token_url: 'https://api.twitter.com/oauth/request_token',
                    access_token_url: 'https://api.twitter.com/oauth/access_token',
                    authenticate_url: 'https://api.twitter.com/oauth/authenticate',
                    authorize_url: 'https://api.twitter.com/oauth/authorize',
                    callback_url: null,

                    rest_base: 'https://api.twitter.com/1.1',
                    stream_base: 'https://stream.twitter.com/1.1',
                    search_base: 'https://api.twitter.com/1.1/search',
                    user_stream_base: 'https://userstream.twitter.com/1.1',
                    site_stream_base: 'https://sitestream.twitter.com/1.1',
                    filter_stream_base: 'https://stream.twitter.com/1.1/statuses',

                    secure: false, // force use of https for login/gatekeeper
                    cookie: 'twauth',
                    cookie_options: {},
                    cookie_secret: null
                };
                var T = _twitter(obj);
                T.getMentions(function (data) {
                    console.log('data', data.length);

                });

            }
        });

    }
}
exports.getUserTimeLine = function (req, res) {
    var user = req.checkLoggedIn();
    if (user) {
        User.findOne({_id: user._id}, function (err, data) {
            if (err) {
                console.log('error', err);
            }
            else {
                var obj = {
                    consumer_key: _config.twitterAuth.consumerKey,
                    consumer_secret: _config.twitterAuth.consumerSecret,
                    access_token_key: data.accessToken,
                    access_token_secret: data.refreshToken,

                    headers: {
                        'Accept': '*/*',
                        'Connection': 'close',
                        'User-Agent': 'node-twitter/' + '0.2.12'
                    },

                    request_token_url: 'https://api.twitter.com/oauth/request_token',
                    access_token_url: 'https://api.twitter.com/oauth/access_token',
                    authenticate_url: 'https://api.twitter.com/oauth/authenticate',
                    authorize_url: 'https://api.twitter.com/oauth/authorize',
                    callback_url: null,

                    rest_base: 'https://api.twitter.com/1.1',
                    stream_base: 'https://stream.twitter.com/1.1',
                    search_base: 'https://api.twitter.com/1.1/search',
                    user_stream_base: 'https://userstream.twitter.com/1.1',
                    site_stream_base: 'https://sitestream.twitter.com/1.1',
                    filter_stream_base: 'https://stream.twitter.com/1.1/statuses',

                    secure: false, // force use of https for login/gatekeeper
                    cookie: 'twauth',
                    cookie_options: {},
                    cookie_secret: null
                };
                var T = _twitter(obj);
                T.getUserTimeline(data.twitterId,function (data) {
                    console.log('data', data.length);

                });

            }
        });

    }
}
exports.getReweeted_to_me = function (req, res) {
    var user = req.checkLoggedIn();
    if (user) {
        User.findOne({_id: user._id}, function (err, data) {
            if (err) {
                console.log('error', err);
            }
            else {
                var obj = {
                    consumer_key: _config.twitterAuth.consumerKey,
                    consumer_secret: _config.twitterAuth.consumerSecret,
                    access_token_key: data.accessToken,
                    access_token_secret: data.refreshToken,

                    headers: {
                        'Accept': '*/*',
                        'Connection': 'close',
                        'User-Agent': 'node-twitter/' + '0.2.12'
                    },

                    request_token_url: 'https://api.twitter.com/oauth/request_token',
                    access_token_url: 'https://api.twitter.com/oauth/access_token',
                    authenticate_url: 'https://api.twitter.com/oauth/authenticate',
                    authorize_url: 'https://api.twitter.com/oauth/authorize',
                    callback_url: null,

                    rest_base: 'https://api.twitter.com/1.1',
                    stream_base: 'https://stream.twitter.com/1.1',
                    search_base: 'https://api.twitter.com/1.1/search',
                    user_stream_base: 'https://userstream.twitter.com/1.1',
                    site_stream_base: 'https://sitestream.twitter.com/1.1',
                    filter_stream_base: 'https://stream.twitter.com/1.1/statuses',

                    secure: false, // force use of https for login/gatekeeper
                    cookie: 'twauth',
                    cookie_options: {},
                    cookie_secret: null
                };
                var T = _twitter(obj);
                T.getRetweetedToMe(function (data) {
                    console.log('data', data.length);

                });

            }
        });

    }
}
exports.getRetweets = function (req, res) {
    var user = req.checkLoggedIn();
    if (user) {
        User.findOne({_id: user._id}, function (err, data) {
            if (err) {
                console.log('error', err);
            }
            else {
                var obj = {
                    consumer_key: _config.twitterAuth.consumerKey,
                    consumer_secret: _config.twitterAuth.consumerSecret,
                    access_token_key: data.accessToken,
                    access_token_secret: data.refreshToken,

                    headers: {
                        'Accept': '*/*',
                        'Connection': 'close',
                        'User-Agent': 'node-twitter/' + '0.2.12'
                    },

                    request_token_url: 'https://api.twitter.com/oauth/request_token',
                    access_token_url: 'https://api.twitter.com/oauth/access_token',
                    authenticate_url: 'https://api.twitter.com/oauth/authenticate',
                    authorize_url: 'https://api.twitter.com/oauth/authorize',
                    callback_url: "http://localhost:9092/twitter/auth/callback",

                    rest_base: 'https://api.twitter.com/1.1',
                    stream_base: 'https://stream.twitter.com/1.1',
                    search_base: 'https://api.twitter.com/1.1/search',
                    user_stream_base: 'https://userstream.twitter.com/1.1',
                    site_stream_base: 'https://sitestream.twitter.com/1.1',
                    filter_stream_base: 'https://stream.twitter.com/1.1/statuses',

                    secure: false, // force use of https for login/gatekeeper
                    cookie: 'twauth',
                    cookie_options: {},
                    cookie_secret: null
                };
                var T = _twitter(obj);
                console.log('id:',data.twitterId);
                T.getRetweets('509457288717819904',function (data) {
                    console.log(arguments,'argumnts');
                    console.log('data', data);

                });

            }
        });

    }
}
exports.getReweeted_of_me = function (req, res) {
    var user = req.checkLoggedIn();
    if (user) {
        User.findOne({_id: user._id}, function (err, data) {
            if (err) {
                console.log('error', err);
            }
            else {
                var obj = {
                    consumer_key: _config.twitterAuth.consumerKey,
                    consumer_secret: _config.twitterAuth.consumerSecret,
                    access_token_key: data.accessToken,
                    access_token_secret: data.refreshToken,

                    headers: {
                        'Accept': '*/*',
                        'Connection': 'close',
                        'User-Agent': 'node-twitter/' + '0.2.12'
                    },

                    request_token_url: 'https://api.twitter.com/oauth/request_token',
                    access_token_url: 'https://api.twitter.com/oauth/access_token',
                    authenticate_url: 'https://api.twitter.com/oauth/authenticate',
                    authorize_url: 'https://api.twitter.com/oauth/authorize',
                    callback_url: null,

                    rest_base: 'https://api.twitter.com/1.1',
                    stream_base: 'https://stream.twitter.com/1.1',
                    search_base: 'https://api.twitter.com/1.1/search',
                    user_stream_base: 'https://userstream.twitter.com/1.1',
                    site_stream_base: 'https://sitestream.twitter.com/1.1',
                    filter_stream_base: 'https://stream.twitter.com/1.1/statuses',

                    secure: false, // force use of https for login/gatekeeper
                    cookie: 'twauth',
                    cookie_options: {},
                    cookie_secret: null
                };
                var T = _twitter(obj);
                T.getRetweetsOfMe(function (err,data) {
                    console.log(err,'data', data);

                });

            }
        });

    }
}
exports.getReweeted_to_user = function (req, res) {
    var user = req.checkLoggedIn();
    if (user) {
        User.findOne({_id: user._id}, function (err, data) {
            if (err) {
                console.log('error', err);
            }
            else {
                var obj = {
                    consumer_key: _config.twitterAuth.consumerKey,
                    consumer_secret: _config.twitterAuth.consumerSecret,
                    access_token_key: data.accessToken,
                    access_token_secret: data.refreshToken,

                    headers: {
                        'Accept': '*/*',
                        'Connection': 'close',
                        'User-Agent': 'node-twitter/' + '0.2.12'
                    },

                    request_token_url: 'https://api.twitter.com/oauth/request_token',
                    access_token_url: 'https://api.twitter.com/oauth/access_token',
                    authenticate_url: 'https://api.twitter.com/oauth/authenticate',
                    authorize_url: 'https://api.twitter.com/oauth/authorize',
                    callback_url: null,

                    rest_base: 'https://api.twitter.com/1.1',
                    stream_base: 'https://stream.twitter.com/1.1',
                    search_base: 'https://api.twitter.com/1.1/search',
                    user_stream_base: 'https://userstream.twitter.com/1.1',
                    site_stream_base: 'https://sitestream.twitter.com/1.1',
                    filter_stream_base: 'https://stream.twitter.com/1.1/statuses',

                    secure: false, // force use of https for login/gatekeeper
                    cookie: 'twauth',
                    cookie_options: {},
                    cookie_secret: null
                };
                var T = _twitter(obj);
                T.getRetweetedToUser(data.twitterId,function (err,data) {
                    console.log(err,'err','data', data);

                });

            }
        });

    }
}
exports.showStatus = function (req, res) {
    var user = req.checkLoggedIn();
    if (user) {
        User.findOne({_id: user._id}, function (err, data) {
            if (err) {
                console.log('error', err);
            }
            else {
                var obj = {
                    consumer_key: _config.twitterAuth.consumerKey,
                    consumer_secret: _config.twitterAuth.consumerSecret,
                    access_token_key: data.accessToken,
                    access_token_secret: data.refreshToken,

                    headers: {
                        'Accept': '*/*',
                        'Connection': 'close',
                        'User-Agent': 'node-twitter/' + '0.2.12'
                    },

                    request_token_url: 'https://api.twitter.com/oauth/request_token',
                    access_token_url: 'https://api.twitter.com/oauth/access_token',
                    authenticate_url: 'https://api.twitter.com/oauth/authenticate',
                    authorize_url: 'https://api.twitter.com/oauth/authorize',
                    callback_url: null,

                    rest_base: 'https://api.twitter.com/1.1',
                    stream_base: 'https://stream.twitter.com/1.1',
                    search_base: 'https://api.twitter.com/1.1/search',
                    user_stream_base: 'https://userstream.twitter.com/1.1',
                    site_stream_base: 'https://sitestream.twitter.com/1.1',
                    filter_stream_base: 'https://stream.twitter.com/1.1/statuses',

                    secure: false, // force use of https for login/gatekeeper
                    cookie: 'twauth',
                    cookie_options: {},
                    cookie_secret: null
                };
                var T = _twitter(obj);
                T.showStatus(data.twitterId,function (err,data) {
                    console.log(err,'err','data', data);

                });

            }
        });

    }
}


/* var user = req.checkLoggedIn();
 getUserTweets(user, function (error, data) {
 if (error) {
 console.log(require('sys').inspect(error));
 res.end('bad stuff happened, none tweetage');
 } else {
 console.log(data);
 res.send(JSON.parse(data));
 }
 });*/
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
    var user = req.checkLoggedIn();
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
                        data = data + chunk;
                        console.log(chunk);
                    });
                    response.addListener('end', function () {
                        console.log('--- END ---', data);
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
        favourite(user, req.body.tweet, function (err, result) {
            if (err) {
                console.log('errrrrrrr', err);
                res.send(null);
            }
            else
                res.send(result);

        });
    }
}
favourite = function (user, tweet, cb) {
    User.findOne({_id: user._id}, function (err, data) {
        if (err) {
            console.log('error', err);
            cb(err, null);
        }
        else {
            var request = new _OAuth(
                "https://twitter.com/oauth/request_token"
                , "https://twitter.com/oauth/access_token"
                , _config.twitterAuth.consumerKey
                , _config.twitterAuth.consumerSecret
                , "1.0A"
                , "http://localhost:9092/twitter/auth/callback"
                , "HMAC-SHA1"
            ).post(
                    "https://api.twitter.com/1.1/favorites/create.json?id=" + tweet.id_str
                    , data.accessToken
                    , data.refreshToken
                );
            var data = "";
            request.addListener('response', function (response) {
                response.setEncoding('utf8');
                response.addListener('data', function (chunk) {
                    data = data + chunk;
                    console.log(chunk);
                });
                response.addListener('end', function () {
                    new Tweet({
                        twitterId: data.twitterId,
                        tweet: tweet
                    }).save(function (err, tweet) {
                            if (err) {
                                log.error(err);
                                cb(err, null);
                            }
                            else {
                                console.log('favourite tweet inserted into DB....');
                                cb(null, 'success');
                            }
                        });
                    console.log('--- END ---', data);
                });
            });
            request.end();
        }
    });
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
                        console.log('got favourite tweets');
                        res.send(tweets);
                    }
                });
            }
        });
    }
}