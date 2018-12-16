var express = require('express'),
    router = express.Router(),
    logger = require('../../config/logger'),
    mongoose = require('mongoose')
TaskManager = mongoose.model('TaskManager'),
    TaskManagerTask = mongoose.model("TaskManagerTask")
asyncHandler = require('express-async-handler'),
    passport = require('passport'),
    multer = require('multer'), 
    mkdirp = require('mkdirp'); 


var requireAuth = passport.authenticate('jwt', { session: false });

module.exports = function (app, config) {
    app.use('/api', router);




  
    router.get('/taskManagers', requireAuth, asyncHandler(async (req, res) => {
        logger.log('info', 'Get all TaskManagers');
        let query = TaskManager.find();
        query
            .sort(req.query.order)
            .populate({ path: 'personId', model: 'Member', select: 'lastName firstName fullName' })
            .populate({ path: 'ownerId', model: 'Member', select: 'lastName firstName fullName' });

        if (req.query.status) {
            if (req.query.status[0] == '-') {
                query.where('status').ne(req.query.status.substring(1));
            } else {
                query.where('status').eq(req.query.status);
            }
        }
        await query.exec().then(result => {
            res.status(200).json(result);
        })
    }));

 
    router.get('/taskMangers/:id', requireAuth, asyncHandler(async (req, res) => {
        logger.log('info', 'Get a taskManager', req.params.id);
        await TaskManager.findById(req.params.id).then(result => {
            res.status(200).json(result);
        })
    }));



    router.put('/taskManagers', asyncHandler(async (req, res) => {
        logger.log('info', 'Updating TaskManager');
        console.log(req.body)
        await TaskManager.findOneAndUpdate({ _id: req.body.taskManager._id }, req.body.taskManager, { new: true })
            .then(result => {
                if (req.body.task) {
                    req.body.task.taskManagerId = result._id;
                    var taskManagerTask = new TaskManagerTask(req.body.task);
                    taskManagerTask.save()
                        .then(task => {
                            res.status(201).json({taskID: task._id});
                        })
                } else {
                    res.status(200).json(result);
                }
            })
    }));



 
    router.delete('/taskManagers/:id', requireAuth, asyncHandler(async (req, res) => {
        logger.log('info', 'Deleting member %s', req.params.id);
        await TaskManager.remove({ _id: req.params.id })
            .then(result => {
                res.status(200).json(result);
            })
    }));


    router.post('/taskManagers', asyncHandler(async (req, res) => {
        logger.log('info', 'Creating TaskManager');
        var taskManager = new TaskManager(req.body.taskManager);
        console.log(taskManager)
        await taskManager.save()
            .then(result => {
                req.body.task.taskManagerId = result._id;
                var taskManagerTask = new TaskManagerTask(req.body.task);
                taskManagerTask.save()
                    .then(task => {
                        res.status(201).json({taskID: task._id});
                    })
            })
    }));


    router.get('/taskManagerTasks/taskManager/:id', asyncHandler(async (req, res) => {
        logger.log('info', 'Getting a TaskManagers Task');
        let query = TaskManagerTask.find({ taskManagerId: req.params.id })
            .sort('-dateCreated')
            .populate({ path: 'personId', model: 'Member', select: 'lastName firstName fullName' })

        await query.exec().then(result => {
            res.status(200).json(result);
        })
    }));



var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var path = config.uploads + '/taskManagers';
        mkdirp(path, function (err) {
            if (err) {
                res.status(500).json(err);
            } else {
                cb(null, path);
            }
        });
    },
    filename: function (req, file, cb) {
        file.fileName = file.originalname;
        cb(null, file.fieldname + '-' + Date.now());
    }
});


var upload = multer({ storage: storage });


router.post('/taskManagerTasks/upload/:id', upload.any(), asyncHandler(async (req, res) => {
    logger.log('info', 'Uploading files');
    await TaskManagerTask.findById(req.params.id).then(result => {
        for (var i = 0, x = req.files.length; i < x; i++) {
            var file = {
                originalFileName: req.files[i].originalname,
                fileName: req.files[i].filename
            };
            result.file = file;
        }
        result.save().then(result => {
            res.status(200).json(result);
        });
    })
}));

};

