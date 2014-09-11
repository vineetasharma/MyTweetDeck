var EventName = require("../src/enum/EventName");


exports.findOrCreateTwitterAccountService = function (accessToken,refreshToken,profile) {
    console.log('tweets',profile._json.status.entities.user_mentions[0].indices,"l>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>ength",profile._json.status.retweeted_status.length);
    console.log('tweets',profile,"l>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>............");
    var emitter = this;
    User.findOne({twitterId: profile.id}, function (err, data) {
        if (err) {
            emitter.emit("error", err);
        } else if (!data) {
            new User({
                accessToken:accessToken,
                refreshToken:refreshToken,
                username: profile.displayName,
                twitterId: profile.id,
                profilePicUrl: profile.photos[0].value,
                profileData: {
                    Birthday: "",
                    Gender: "",
                    Mobile: "",
                    CurrentCity: ""
                },
                email:{
                    emailId:"",
                    validationCode:"",
                    emailValid:false
                },
                favouriteTweets:[]
            }).save(function (err, user) {
                    if (err) {
                        log.error(err);
                        emitter.emit('error', err);
                    }
                    else {
                        emitter.emit('success', user);
                    }
                });
        }
        if (data) {
            emitter.emit('success', data);
        }
    })
}.toEmitter();

exports.getUserDetails = function (id) {
    var emitter = this;
    User.findOne({_id:id}, function (err, data) {
        if (err) {
            emitter.emit("error", err);
        } else {
            emitter.emit("success",data);
        }
    })
}.toEmitter();

