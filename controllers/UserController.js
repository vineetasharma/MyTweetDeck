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
    console.log(accessToken,'accessToken');
    console.log(refreshToken,'refreshToken');
    console.log(done,'done');
    UserService.findOrCreateTwitterAccountService(accessToken,refreshToken,profile)
        .on("success", function (user) {
            console.log(user,'user>>>>>>>>>>..');
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
exports.getProfile=function(req,res){
    var user = req.checkLoggedIn();
    if(user){
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
exports.getTweets=function (req, res) {
    var user=req.checkLoggedIn();
    makeTweet(user,function (error, data) {
        if(error) {
            console.log(require('sys').inspect(error));
            res.end('bad stuff happened, none tweetage');
        } else {
            console.log(data);
            res.end('go check your tweets!');
        }
    });
}
/*initTwitterOauth=function () {
    _oa = new _OAuth(
        "https://twitter.com/oauth/request_token"
        , "https://twitter.com/oauth/access_token"
        , _config.twitterAuth.consumerKey
        , _config.twitterAuth.consumerSecret
        , "1.0A"
        , "http://localhost:9092/twitter/auth/callback"
        , "HMAC-SHA1"
    );
}*/
makeTweet=function (user,cb) {
    if(user){
        User.findOne({_id: user._id}, function (err, data) {
            if (err) {
                console.log('error',err);
            }
            else{
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
exports.makeDm=function (sn, cb) {
    var user=req.checkLoggedIn();
    if(user){
        User.findOne({_id: user._id}, function (err, data) {
            if (err) {
                console.log('error',err);
            }
            else{
                new _OAuth(
                    "https://twitter.com/oauth/request_token"
                    , "https://twitter.com/oauth/access_token"
                    , _config.twitterAuth.consumerKey
                    , _config.twitterAuth.consumerSecret
                    , "1.0A"
                    , "http://localhost:9092/twitter/auth/callback"
                    , "HMAC-SHA1"
                ).post(
                    "https://api.twitter.com/1.1/direct_messages/new.json"
                    , data.accessToken
                    , data.refreshToken
                    , {"screen_name": sn, text: "test message via nodejs twitter api. pulled your sn at random, sorry."}
                    , cb
                );
            }
        });

    }
}
//find tweets
exports.findTweets=function(req,res){
    var user=req.checkLoggedIn();
    if(user){
        User.findOne({_id: user._id}, function (err, data) {
            if (err) {
                console.log('error',err);
            }
            else{
                new _twit({
                        consumer_key:_config.twitterAuth.consumerKey
                        , consumer_secret:_config.twitterAuth.consumerSecret
                        , access_token:data.accessToken
                        , access_token_secret:data.refreshToken
                    })
                    .get('search/tweets', { q: 'Tweet since:2014-09-11', count: 5 }, function(err, data, response) {
                    console.log('serrtf',data,'?????????????????????????')
                });
            }
        });

    }
}
