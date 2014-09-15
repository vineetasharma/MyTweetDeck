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
                profileData: {
                    Birthday: "",
                    Gender: "",
                    Mobile: "",
                    CurrentCity: "",
                    Address: {
                        Hometown: "",
                        City: "",
                        State: "",
                        Country: "",
                        pin: ""
                    }
                },
                email: {
                    emailId: "",
                    validationCode: "",
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
        }
    });
}.toEmitter();

