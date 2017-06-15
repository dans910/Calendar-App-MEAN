var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
    id: String,
    username: String,
    password_hash: String, 
    group_id: [ { type: String, ref: 'Group' } ],
    calendar_id: { type: String, ref: 'Calendar' }
});
var groupsSchema = new mongoose.Schema({
    id: String,
    name: String,
    calendar_id: { type: String, ref: 'Calendar' },
    members: [ { type: String, ref: 'User' } ]
});

var eventsSchema = new mongoose.Schema({
    id: String,
    name: String,
    date: String,
    description: String
});
var calendarSchema = new mongoose.Schema({
    id: String,
    event_id: [ { type: String, ref: 'Event' } ]
});

mongoose.model('User', userSchema, 'User');
mongoose.model('Group', groupsSchema, 'Group');
mongoose.model('Event', eventsSchema, "Event");
mongoose.model('Calendar', calendarSchema, 'Calendar');