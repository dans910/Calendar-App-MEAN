var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
//models
var User = mongoose.model('User');
var Group = mongoose.model('Group');
var Calendar = mongoose.model('Calendar');
var Event = mongoose.model('Event');

//this route will deal with group calendar and all events
router.route('/groupCalendar')
    .get(function (req, res) {
        //this get request will return all the events for the day
        res.send({message: "get calendar events"})

      })
    .post(function(req, res){
        //this will edit or save an event
        res.send({message: "edit or add new event"})
    })

//this route specific event
router.route('/groupCalendar/:id')
    .get(function(req, res){
        //this will return all posts from a group day
        // res.send({message: "event with id" + req.params.id })
        Calendar.aggregate([{ "$match": { "id": req.params.id } }, {  
            $lookup: {
                "localField": "id",
                "from": "Group",
                "foreignField": "calendar_id",
                "as": "GroupCalendar"
            }
        }, { "$unwind" : "$GroupCalendar" }, 
        { "$unwind": "$event_id" }, {
            $lookup : {
                "localField": "event_id",
                "from": "Event",
                "foreignField": "id",
                "as": "GroupEvent"
            }
        },{ "$project": {
            "GroupEvent": 1,
            "GroupCalendar.members": 1
        }}], function(err, groupC){
            if(err){
                return res.status(500).send(err);
            }
            return res.status(200).send(groupC);
        })
    })
    .put(function(req, res) {
        //add the member who joined to the group 
        res.send({message: "edit event with id" + req.params.id })
    })
    .post(function(req, res){
        //create new group
        res.send({message: "delete event with id" + req.params.id })
        
    })

//this route will deal with user calendar and all events
router.route('/myCalendar')
    .get(function (req, res) {
        //this get request will return all the events for the day
        res.send({message: "get calendar events"})

      })
    .post(function(req, res){
        //this will edit or save an event
        res.send({message: "edit or add new event"})
    })

//this route specific calendar
router.route('/myCalendar/:id')
    .get(function(req, res){
        //this will return all posts from a group day
        // res.send({message: "event with id" + req.params.id })
        Calendar.aggregate([{ "$match": { "id": req.params.id } }, {  
            $lookup: {
                "localField": "id",
                "from": "User",
                "foreignField": "calendar_id",
                "as": "UserCalendar"
            }
        }, { "$unwind" : "$UserCalendar" }, 
        { "$unwind": "$event_id" }, {
            $lookup : {
                "localField": "event_id",
                "from": "Event",
                "foreignField": "id",
                "as": "UserEvent"
            }
        },{ "$project": {
            "UserEvent": 1
        }}], function(err, groupC){
            if(err){
                return res.status(500).send(err);
            }
            return res.status(200).send(groupC);
        })
    })
    .put(function(req, res) {
        // add the group id of a a new group or event
        res.send({message: "edit event with id" + req.params.id })
    })
    .post(function(req, res){
        // save new event and add it to the the calendar
        // var calendarId = "";
        // User.findOne({"id": req.params.id}, function(err, user){
        //     console.log(user);
        //     calendarId = user.calendar_id;
        //     console.log(calendarId)
        // })

        Event.find().count({},function (err, count) {  
            if(err){
                return res.status(500).send(err)
            }
            //new id for new event
            var newId = count + 1;
            //declare new event using the post data
            var insertEvent = new Event();
            insertEvent.id = newId;
            insertEvent.name = req.body.name;
            insertEvent.date = req.body.date;
            insertEvent.description = req.body.description;
            //insert new event to Event collection
            Event.create(insertEvent);
            //Update Calendar Events by adding new event id to array
            Calendar.findOne({"id": req.params.id}, function (err, temp) {  
                if(!err){
                    temp.event_id.push(insertEvent.id);
                    temp.save();
                }
            })
            return res.status(200).send(insertEvent)
        });
        
    })
//this route will deal with groups
router.route('/myGroups')
    .get(function (req, res) {
        //this get request will return all the events for the day
        res.send({message: "get groups"})

      })
    .post(function(req, res){
        //this will edit or save an event
        res.send({message: "edit or add new group"})
    })

//this route specific user's groups
router.route('/myGroups/:id')
    .get(function(req, res){
        //this will return all posts from a group day
        User.aggregate([{ "$match": { "id": req.params.id } }, 
        { "$unwind": "$group_id" },{
            $lookup: {
                "localField": "group_id",
                "from": "Group",
                "foreignField": "id",
                "as": "UserGroup"
            }
        }, { $project: {
            "group_id": 1,
            "UserGroup.name": 1,
            "UserGroup.members": 1,
            "UserGroup.calendar_id": 1
        } }]
        , function(err, UserGroups){
            if(err){
                return res.status(500).send(err);
            }
            return res.status(200).send(UserGroups);
        })
    })
    .post(function(req, res){
        // res.send({message: "add group to user groups" + req.params.id })
        Group.findOne({"name": req.body.name}, function (err, group) {  
            if(err){
                return res.status(500).send(err)
            }//if group doesn't exist, create new group
            if(!group){
                var newGroupId;
                Group.find().count(function(error, count){
                    if(error){
                            return res.status(500).send(err)
                    }  
                    newGroupId = count + 1;
                    
                    console.log(newGroupId);
                    var insertGroup = new Group();
                    insertGroup.id = "" + newGroupId;
                    insertGroup.name = req.body.name
                    insertGroup.members = [];
                    // return res.send({message: "new groupd id: " + newGroupId})
                    //find the user creating and joining a group and update it's group array
                    User.findOne({"id": req.params.id}, function(err, user){
                        if(err){
                            return res.status(500).send(err)
                        }
                        //add creating user to members array of group
                        insertGroup.members.push(user.username)
                        //find new id for new calendar and insert it
                        Calendar.find().count(function(err, count){
                            if(err){
                                return res.status(500).send(err)
                            }
                            //update new group with new calendar id
                            var newCalId = count + 1;
                            insertGroup.calendar_id = "" + newCalId;
                            var insertCalendar = new Calendar();
                            insertCalendar.id = insertGroup.calendar_id;
                            insertCalendar.event_id = [];
                            //insert new calendar and new group to db
                            Calendar.create(insertCalendar);
                            Group.create(insertGroup); 
                            //update groups on user and save
                            user.group_id.push(insertGroup.id);
                            user.save();
                            return res.status(200).send(user)
                        })
                    })
                });

            }else{//group does exist, so join the room
                User.findOne({"id": req.params.id}, function(err, user){
                    if(err){
                        return res.status(500).send(err)
                    }//add user to memebers and add group to user
                    group.members.push(user.username);
                    group.save();
                    user.group_id.push(group.id);
                    user.save()
                    return res.status(200).send({message: user.username + " has joined " + group.name})
                })
            }
        })
        


    })

router.route('/getUser')
    .get(function (req, res) {
        //this get request will return all the events for the day
        res.send({message: "get groups"})

      })//register new User
    .post(function(req, res){
        // res.send({message: "edit or add new group"})
        var UserName = req.body.username;
        User.findOne({"username": UserName}, function(err, user){
            if(err){
                return res.status(500).send(err)
            }//if username no taken, create new user
            if(!user){//initialize user
                var insertUser = new User();
                insertUser.username = UserName;
                insertUser.password_hash = "";
                insertUser.group_id = [];
                //get new user id and new create new calendar for user
                Calendar.find().count(function(err, count){
                    if(err){
                        return res.status(500).send(err)
                    }
                    var newCalId = count +1;
                    var insertCalendar = new Calendar();
                    insertCalendar.id = '' + newCalId;
                    insertCalendar.event_id = [];
                    //insert new calendar
                    Calendar.create(insertCalendar);
                    //add calendar to user
                    insertUser.calendar_id = insertCalendar.id;
                    //get the id for new user
                    User.find().count(function(err, userCount){
                        if(err){
                            return res.status(500).send(err)
                        }
                        var newuserId = count +1;
                        insertUser.id = ''+newuserId;
                        User.create(insertUser);
                        return res.send({userTaken: "false", userId: insertUser})
                    })
                })

                
            }else{//Username taken
                return res.send({userTaken: "true", userId: "-1"})
            }
        })
    })

router.route('/getUser/:name')
    .get(function(req, res){
        //this will return all posts from a group day
        User.findOne({'username': req.params.name} , function(err, user){
            if(err){
                return res.status(500).send(err);
            }
            return res.status(200).send(user);
        })
    })
    .put(function(req, res) {
        res.send({message: "edit event with id" + req.params.id })
    })
    .delete(function(req, res){
        res.send({message: "delete event with id" + req.params.id })
    })
//getMembers
router.route('/getMembers/')
router.route('/getMembers/:id')
    .get(function(req, res){
        Calendar.aggregate([{ "$match": { "id": req.params.id } }, {  
            $lookup: {
                "localField": "id",
                "from": "Group",
                "foreignField": "calendar_id",
                "as": "GroupCalendar"
            }
        }, { "$unwind" : "$GroupCalendar" }, { "$project": {
            "GroupEvent": 1,
            "GroupCalendar.members": 1
        }}], function(err, group){
            if(err){
                return res.status(500).send(err)
            }
            return res.status(200).send(group)
        })
    })

module.exports = router;