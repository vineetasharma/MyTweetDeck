var EventName = require("../src/enum/EventName");
var fs = require('fs');

exports.sendMailService = function (mailData) {
    var emitter = this;
    var file = fs.readFileSync(_process.cwd() + '/web-app/dev/views/mailMessage.ejs', "utf8");
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
        to: _config.mailService.email,
        subject: 'Message from ' + mailData.name,
        html: html
    };
    transport.sendMail(options, function (err, res) {

        if (err) {
            log.info('in User service  err ', err.message);
            emitter.emit(EventName.ERROR, err);
        }
        else {
            emitter.emit(EventName.DONE, res);
        }

    });
}.toEmitter();