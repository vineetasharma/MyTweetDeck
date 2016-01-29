/**
 * URL Mappings are done in this file.
 *
 * "_app" is the express app object. Rest is all express.
 * */

//Require Controllers
var controllers = {
    cluster: require("../controllers/ClusterController"),
    user: require("../controllers/UserController"),
    home: require("../controllers/HomeController")
};


//Cluster API
_app.get("/cluster/worker/list", controllers.cluster.list);

//Home/Auth URL Mappings
_app.get('/',controllers.home.index);

//User routes
_app.post('/', controllers.user.loginHandler);
_app.get('/logout', controllers.user.logout);
_passport.use(new _twitterStrategy({
    consumerKey: _config.twitterAuth.consumerKey,
    consumerSecret: _config.twitterAuth.consumerSecret,
    callbackURL: _config.twitterAuth.callbackURL
}, controllers.user.findOrCreateTwitterAccount));

// Redirect the user to Twitter for authentication.  When complete, Twitter
// will redirect the user back to the application at
//   /auth/twitter/callback
_app.get('/auth/twitter', _passport.authenticate('twitter'));

// Twitter will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
_app.get('/auth/twitter/callback',
    _passport.authenticate('twitter', { successRedirect: '/',
        failureRedirect: '/' }));
_app.get('/getProfileData',controllers.user.getProfile);
_app.post('/updateProfile',controllers.user.updateProfile);
// new tweets
_app.post('/makeTweet', controllers.user.makeTweets);
//tweets
_app.get('/getTweets',controllers.user.getTweets);
//retweet
_app.post('/reTweet',controllers.user.reTweet);
//make favourite tweet
_app.post('/favouriteTweet',controllers.user.makeFavourite);
//get favourite tweets from DB
_app.get('/getfavouriteTweets',controllers.user.getFavouriteTweets);
_app.post('/sendMail',controllers.home.sendMail);
_app.get('/verifyEmail/:verificationCode',controllers.user.verifyEmail);
_app.get('/getUserTimeLine',controllers.user.getSpecificUserTimelineTweet);
_app.get('/searchTweets',controllers.user.searchTweets);
_app.get('/getFriendList',controllers.user.getFriendList);
_app.get('/getUserByName',controllers.user.getUserByName);
_app.post('/follow',controllers.user.followUser);
_app.post('/unFollow',controllers.user.unFollowUser);