// Users


var user1 = {
	"username": "steve", 
	"password_hash": "", 
	"group_id": ["3"],
	"calendar_id": "1"
};

var user2 = {
	"username": "samuel", 
	"password_hash": "", 
	"group_id1": ["1", "3"],
	"calendar_id":"2"
};

var user3 = {
	"username": "lee", 
	"password_hash": "", 
	"group_id": ["2"], 
	"calendar_id": "3"
};

var user4 = {
	"username": "will", 
	"password_hash": "", 
	"group_id": ["2"], 
	"calendar_id": "4"
};

var user5 = {
	"username": "matt", 
	"password_hash": "", 
	"group_id": ["1"], 
	"calendar_id": "5"
};
var users = [user1, user2, user3, user4, user5];

// Groups


var group1 = {
	"id": "1",
	"name": "Discrete Math",
	"calendar_id": "6"
};

var group2 = {
	"id": "2",
	"name": "Networks",
	"calendar_id": "7"
};

var group3 = {
	"id": "3",
	"name": "Language",
	"calendar_id": "8"
};
var groups = [group1, group2, group3];

// Calendars
var calendars = [calendar1, calendar2, calendar3, calendar4, calendar5, calendar6, calendar7, calendar8];

var calendar1 = {
	"id": "1",
	"event_id": ["1", "3"]
};

var calendar2 = {
	"id": "2",
	"event_id": []
};

var calendar3 = {
	"id": "3",
	"event_id": ["2"]
};

var calendar4 = {
	"id": "4",
	"event_id": ["4", "5"]
};

var calendar5 = {
	"id": "5",
	"event_id": []
};

var calendar6 = {
	"id": "6",
	"event_id": ["6", "7"]
};

var calendar7 = {
	"id": "7",
	"event_id": ["8", "9", "10"]
};

var calendar8 = {
	"id": "8",
	"event_id": ["11"]
};

// Events
//var events = [event1, event2, event3, event4];//, event5, event6, event7, event8, event9, event10, event11];

var event1 = {
	"id": "1",
	"name": "Meeting",
	"date": "6 December, 2016",
	"time": "9:00 a.m.",
	"description": "Meeting with professor Winslow about final exams."
};
var event4 = {
	"id": "4",
	"name": "Meeting 4",
	"date": "6 December, 2016",
	"time": "9:00 a.m.",
	"description": "Meeting with professor Winslow about final exams."
};

var event2 = {
	"id": "2",
	"name": "Study Session",
	"date": "5 January, 2017",
	"time": "12:00 p.m.",
	"description": "Get together at the Student Union."
};

var event3 = {
	"id": "3",
	"name": "Meeting 2",
	"date": "19 January, 2016",
	"time": "9:00 a.m.",
	"description": "Meeting with professor Winslow about final exams."
};

var events = [event1, event2, event3, event4]//, event5, event6, event7, event8, event9, event10, event11];
