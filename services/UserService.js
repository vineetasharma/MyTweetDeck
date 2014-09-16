var EventName = require("../src/enum/EventName");
var fs = require('fs');

exports.findOrCreateTwitterAccountService = function (accessToken, refreshToken, profile) {
    log.info('Twitter profile:', profile, "User profile");
    var emitter = this;
    User.findOne({twitterId: profile.id}, function (err, data) {
        if (err) {
            emitter.emit("error", err);
        } else if (!data) {
            new User({
                accessToken: accessToken,
                refreshToken: refreshToken,
                username: profile.displayName,
                twitterId: profile.id,
                profilePicUrl: profile.photos[0].value,
                email: {
                    emailValid: false
                }
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
    User.findOne({_id: id}, function (err, data) {
        if (err) {
            emitter.emit("error", err);
        } else {
            emitter.emit("success", data);
        }
    })
}.toEmitter();
exports.updateUserDetails = function (id, data) {
    var emitter = this;

    var updateDetails = {
        username: data.Name,
        profileData: {
            Birthday: data.Birthday,
            Gender: data.Gender,
            Mobile: data.Mobile,
            Address: {
                Hometown: data.HomeTown,
                City: data.City,
                State: data.State,
                Country: data.Country,
                pin: data.Pin
            }
        },
        email: {
            emailId: data.Email,
            emailValid: false
        }

    }
    log.info('udateUserDetails service called data:', updateDetails);
    User.update({_id: id}, {$set: updateDetails}, function (err, data) {
        if (err) {
            emitter.emit("error", err);
        } else {
            emitter.emit("success", data);
        }
    })
}.toEmitter();
exports.sendEmailVerificationLink = function (id,name,email) {
    log.info('sendEmailVerificationLink called',id,name,email);
    var date=new Date();
    console.log(id,name,email);
    var mailData={
        link:id+"="+date.getTime(),
        name:name
    };
    var emitter = this;
    var file = fs.readFileSync(_process.cwd() + '/web-app/dev/views/EmailVarify.ejs', "utf8");
    var html = _ejs.render(file, mailData);
    var transport = _nodemailer.createTransport({
        service: _config.mailService.service,
        auth: {
            user: _config.mailService.email,
            pass: _config.mailService.pass
        }
    });
    var options = {
        from: _config.mailService.email,
        to: email,
        subject: 'Message from NinjaTweetDeck',
        html: html
    };
    transport.sendMail(options, function (err, res) {

        if (err) {
            log.info('in User service  err ', err.message);
            emitter.emit(EventName.ERROR, err);
        }
        else {
            User.update({_id:id},{$set:{'email.validationCode':mailData.link}},function (err, data) {
                if (err) {
                    emitter.emit(EventName.ERROR, err);
                } else {
                    emitter.emit(EventName.DONE, res);
                }
            });
           // emitter.emit(EventName.DONE, res);
        }

    });

}.toEmitter();

exports.verifyEmailService = function (verifyCode,callback) {
    var emitter = this;
    var id=verifyCode.split('=')[0];
    log.info('id:',id);
    User.findOne({_id:id},function(err,data){
        if(err){
            emitter.emit(EventName.ERROR, err);
        }
        else{
            if(verifyCode==data.email.validationCode){
                User.update({_id:id},{$set:{'email.validationCode':'','email.email_valid':true}},function (err, data) {
                    if (err) {
                        emitter.emit(EventName.ERROR, err);
                    } else {
                        log.info('Email verified');
                        emitter.emit(EventName.DONE, data);
                    }
                });

            }
            emitter.emit(EventName.NOT_FOUND,null);
        }
    });
}.toEmitter();
exports.makeTweet = function (status,user,cb) {
    var emitter = this;
    if (user) {
        User.findOne({_id: user._id}, function (err, data) {
            if (err) {
                log.error('error when compose a new Tweet', err);
                emitter.emit(EventName.ERROR,err);
            }
            else {
                _oauth.post(
                    "https://api.twitter.com/1.1/statuses/update.json"
                    , data.accessToken
                    , data.refreshToken
                    , {"status": status }
                    ,cb
                );
                emitter.emit(EventName.DONE,'success');
            }
        });

    }
    emitter.emit(EventName.NOT_FOUND,null);

}.toEmitter();
exports.reTweets = function (user, id,cb) {
    var emitter = this;
    if (user) {
        User.findOne({_id: user._id}, function (err, data) {
            if (err) {
                log.error('error', err);
                emitter.emit(EventName.ERROR,err);

            }
            else {
                var request = _oauth.post(
                    "https://api.twitter.com/1.1/statuses/retweet/" + id + ".json"
                    , data.accessToken
                    , data.refreshToken
                );
                var data = "";
                request.addListener('response', function (response) {
                    response.setEncoding('utf8');
                    response.addListener('data', function (chunk) {
                        data = data + chunk;
                        //console.log(chunk);
                    });
                    response.addListener('end', function () {
                        log.info('--- END ---', data);
                    });
                });
                request.end();
                emitter.emit(EventName.DONE,data);

            }
        });

    }
    else{
        emitter.emit(EventName.NOT_FOUND,null);
    }
}.toEmitter();
exports.favourite = function (user, tweet, cb) {
    var emitter = this;
    User.findOne({_id: user._id}, function (err, data) {
        if (err) {
            log.error('error', err);
            emitter.emit(EventName.ERROR,err);
        }
        else {
            var request = _oauth.post(
                "https://api.twitter.com/1.1/favorites/create.json?id=" + tweet.id_str
                , data.accessToken
                , data.refreshToken
            );
            var data1 = "";
            request.addListener('response', function (response) {
                response.setEncoding('utf8');
                response.addListener('data', function (chunk) {
                    data1 = data1 + chunk;
                    log.info(chunk);
                });
                response.addListener('end', function () {
                    new Tweet({
                        twitterId:data.twitterId,
                        tweet:tweet
                    }).save(function (err, tweet) {
                            if (err) {
                                log.error(err);
                                emitter.emit(EventName.ERROR,err);
                            }
                            else {
                                log.info('favourite tweet inserted into DB....',tweet);
                                emitter.emit(EventName.DONE,tweet);
                            }
                        });
                    log.info('--- END ---', data1);
                });
            });
            request.end();
        }
    });

}.toEmitter();
exports.getUserTweets = function (user) {
    var emitter = this;
    var tweets;
    var cb=function(err,data){
        if(!err){
            tweets=data;
            emitter.emit(EventName.DONE,tweets);
        }
        else{
            emitter.emit(EventName.ERROR,err);
        }

    };
    if (user) {
        User.findOne({_id: user._id}, function (err, data) {
            if (err) {
                log.error('error', err);
                emitter.emit(EventName.ERROR,err);
            }
            else {
                _oauth.get(
                    "https://api.twitter.com/1.1/statuses/home_timeline.json?count=10"
                    , data.accessToken
                    , data.refreshToken
                    ,cb
                );

            }
        });

    }
    else {
        emitter.emit(EventName.NOT_FOUND,null);
    }
}.toEmitter();

