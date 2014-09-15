/**
 * Home Controller
 *
 * Handles the routes responsible for public facing pages (non-logged in pages)
 *
 * */

var EventName = require("../src/enum/EventName");
var HttpStatusCode = require("../src/enum/HttpStatusCode");

/**
 * Handles the route which renders the home page
 * @url "/"
 * */
/*exports.index = function (req, res) {
    //explicitly check for logged in user in the non secured route.
    req.user = req.checkLoggedIn();
    if (req.user) res.redirect("/dashboard");
    else res.render('index', {error: null});
};*/

exports.index = function (req, res) {
    console.log('req.user',req.user);
    if (req.user) {
        console.log('req.user',req.user);
        res.loginUser(req.user._id, req.user.username, ['user']);
    }
    var user = req.checkLoggedIn();
    console.log('user>>>>>>>>>>>>>>>>.',user);
    if(user){
        User.findOne({_id: user._id}, function (err, data) {
            if (err) {
                res.render('index', {user: null});
                console.log('error',err);
            }
            else{
                res.render('index', {user: data.username});
                console.log('data',data);
            }
        });

    }
    else{
        res.render('index', {user:req.user?req.user.username:null});
        console.log('>>>>??>>>>>>>>>>>');
    }

};
exports.sendMail = function (req, res) {
    HomeService.sendMailService(req.body)
        .on(EventName.ERROR, function (err) {
            log.error(err);
            res.sendErrorAPIResponse(err.message, HttpStatusCode.SERVER_ERROR);
        })
        .on(EventName.DONE, function (data) {
            log.info(data, 'in contact controller');
            res.sendSuccessAPIResponse(data, HttpStatusCode.SUCCESS_READ_OPERATION_PERFORMED);
        });
};