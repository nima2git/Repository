var express = require('express'),
    router = express.Router(),
    logger = require('../../config/logger'),
    mongoose = require('mongoose'),
    Member = mongoose.model('Member'),
    asyncHandler = require('express-async-handler'),
    passportService = require('../../config/passport'),
    passport = require('passport');


var requireLogin = passport.authenticate('local', { session: false });
var requireAuth = passport.authenticate('jwt', { session: false });


module.exports = function (app, config) {
    app.use('/api', router);            // the '/api' adds an api to every URL that gets passed in


    
    router.get('/members',requireAuth, asyncHandler(async (req, res) => {
        logger.log('info', 'Get all members');
        let query = Member.find();
        query.sort(req.query.order)
        await query.exec().then(result => {
            res.status(200).json(result);
        })
    }));


    router.get('/members/:id',requireAuth, asyncHandler(async (req, res) => {
        logger.log('info', 'Get members %s', req.params.id);
        await Member.findById(req.params.id).then(result => {
            res.status(200).json(result);
        })
    }));


    router.post('/members', asyncHandler(async (req, res) => {
        logger.log('info', 'Creating member');
        var member = new Member(req.body);
        await member.save()
            .then(result => {
                res.status(201).json(result);
            })

    }));

    router.put('/members', requireAuth, asyncHandler(async (req, res) => {
        logger.log('info', 'Updating members');
        await members.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true })
            .then(result => {
                res.status(200).json(result);
            })
    }));


    router.put('/members/password/:memberId', requireAuth, function (req, res, next) {
        logger.log('Update member ' + req.params.memberId, 'verbose');
        dById(req.params.memberId)
            .exec()
            .then(function (member) {
                if (req.body.password !== undefined) {
                    member.password = req.body.password;
                }
                member.save()
                    .then(function (member) {
                        res.status(200).json(member);
                    })
                    .catch(function (err) {
                        return next(err);
                    });
            })
            .catch(function (err) {
                return next(err);
            });
    }); 
    

    

router.delete('/members/:id', requireAuth, asyncHandler(async (req, res) => {
    logger.log('info', 'Deleting member %s', req.params.id);
    await Member.remove({ _id: req.params.id })
        .then(result => {
            res.status(200).json(result);
        })
}));


router.route('/members/login').post(requireLogin, login);


};
