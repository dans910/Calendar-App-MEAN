var app = angular.module('calendarApp', ['ngRoute']).run(function($rootScope, $location){
    $rootScope.auth = false;//change to false once done testing
    $rootScope.c_user = 'Guest';
    $rootScope.c_user_id = '';
    $rootScope.c_user_calendar = '';
    $rootScope.groupId = '';
    //for testing
    $rootScope.logout = function () {  
        $rootScope.auth = false;
        $rootScope.c_user = 'Guest';
        $rootScope.c_user_id = '';
        $rootScope.c_user_calendar = '';
        $rootScope.groupId ='';
    }
    $rootScope.goHome = function(){
        if($location.path() != "/"){
            // console.log('lol')
            $location.path('/');
        }      
    }
    $rootScope.UserCalendar = function () {  
        $location.path('/user');
    }
});

app.config(function($routeProvider){
  $routeProvider
    //the home about page
    .when('/', {
      templateUrl: 'home.html',
      controller: 'mainController'
    })
    //the user calendar and list of groups
    .when('/user', {
      templateUrl: 'myCalendar.html',
      controller: 'todayController'
    })
    //the group calendar
    .when('/group', {
      templateUrl: 'groupCalendar.html',
      controller: 'groupController'
    });
});
/**
 * temporary user auth
 */
//used for user auth
app.controller('mainController', function($scope, $rootScope, $http, $location){
    $scope.user = {username: '', password:''};
    $scope.username = ''; 
    $scope.invalid = false;

    $scope.login = function (method) { 
        // console.log(method)
        if($scope.username != ''){
            if(method == "signin"){
                $http.get('/api/getUser/' + $scope.username).then(function (data) {
                    if(data.data != ""){
                        $scope.invalid = false;
                        $rootScope.c_user = data.data.username;
                        $rootScope.c_user_id = data.data.id;
                        $rootScope.c_user_calendar = data.data.calendar_id;
                        $rootScope.auth = true;
                        // console.log(data);
                        $location.path('/user');
                    }else{//console.log('runs query')
                        $scope.invalid = true;
                    }
                });
            }
            if(method == 'register'){
                // console.log("clicked register")
                $http.post('/api/getuser', {"username": $scope.username}).then(function(data){
                    // console.log(data)s
                    //user is taken, register failed
                    if(data.data.userTaken == "true"){
                        $scope.invalid = true;
                    }  
                    else{//username is valid and registerd
                        $scope.invalid = false;
                        $rootScope.c_user = data.data.userId.username;
                        $rootScope.c_user_id = data.data.userId.id;
                        $rootScope.c_user_calendar = data.data.userId.calendar_id;
                        $rootScope.auth = true;
                        $location.path('/user');
                    }
                })
            }

        }else{//console.log('does not runs query')
            $scope.invalid = true;
        }
    }

})
//controller to get and display 'today's' events'
//need to implement users and only get those users events
app.controller('todayController', function ($scope, $rootScope, $http, $location) { 
    //client side "auth" for testing
    if(!$rootScope.auth){
        $location.path('/')
    }
    var d = new Date();
    var count = 0;
    var groupCount = 0;
    var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    $scope.today = d.getDate() + ' ' + months[d.getMonth()] + ', ' + d.getFullYear();
    $scope.todaysEvents = [];
    $scope.groups = [];
    //get groups from db
    $http.get('/api/myGroups/' + $rootScope.c_user_id).then(function (groups) {  
        if(groups.data != ""){
            groups.data.forEach(function (group) {  
                // console.log(group)
                $scope.groups.push(group);
                groupCount++;
            })
        }else{
            $scope.noGroups = true;
        }

    })
    //get calendar from db
    $http.get('/api/myCalendar/' + $rootScope.c_user_id).then(function (data) {  
        //when we change the date, refresh the events for the day
        $scope.$watch('today', function(){
            count = 0;
            $scope.todaysEvents = [];
            data.data.forEach(function (todayEvent) { 
                if(todayEvent.UserEvent[0].date == $scope.today){
                    $scope.todaysEvents.push(todayEvent.UserEvent[0]);
                    count++;
                    // console.log("event added")
                }

            })
            // console.log($scope.todaysEvents);
            // console.log('changed date');
            if(count==0){
                $("#noEvents").show();
                // console.log('noEvents')
            }else{
                $("#noEvents").hide();
            }
        })
    });


    $scope.goToCalendar = function (groupId) { 
        $rootScope.groupId = groupId;
        $location.path('/group');
        // console.log(groupId);
     }

     $scope.eventTitle = '';
     $scope.eventDes = '';
     $scope.invalidEvent = false;
     $scope.addEvent = function(){
        //  console.log($scope.eventTitle + ' ' + $scope.eventDes)

         //add event to database usiing an http request
         if($scope.eventTitle != '' && $scope.eventDes != ''){
            $http.post('/api/myCalendar/' + $rootScope.c_user_calendar, {"name": $scope.eventTitle, "description": $scope.eventDes, "date": $scope.today}).then(function(){
                //update the events for user
                $http.get('/api/myCalendar/' + $rootScope.c_user_id).then(function (data) {  
                    //when we change the date, refresh the events for the day
                    $scope.$watch('today', function(){
                        count = 0;
                        $scope.todaysEvents = [];
                        data.data.forEach(function (todayEvent) { 
                            if(todayEvent.UserEvent[0].date == $scope.today){
                                $scope.todaysEvents.push(todayEvent.UserEvent[0]);
                                count++;
                                // console.log("event added")
                            }

                        })
                        if(count==0){
                            $("#noEvents").show();
                            // console.log('noEvents')
                        }else{
                            $("#noEvents").hide();
                        }
                
                    })
                });
            })

            //clear event details
            $scope.eventTitle = '';
            $scope.eventDes = '';
            $("#addModal").modal('close')
            $scope.invalidEvent = false;
         }else{
             $scope.invalidEvent = true;
         }

     }
     $scope.createGroupName = '';
     $scope.invalidGroup = false;
     $scope.createGroup = function () {  
         if($scope.createGroupName != ''){
            //  console.log($scope.createGroupName);
            //make http request to database to createGroup or join and existing
            $http.post("/api/myGroups/" + $rootScope.c_user_id, {"name": $scope.createGroupName}).then(function(){
                //once we have joined a group, we update our group list
                $scope.groups = [];
                $http.get('/api/myGroups/' + $rootScope.c_user_id).then(function (groups) {  
                    if(groups.data != ""){
                        groups.data.forEach(function (group) {  
                            // console.log(group)
                            $scope.groups.push(group);
                            groupCount++;
                        })
                    }else{
                        $scope.noGroups = true;
                    }

                })
            })

             //if succesful
             $scope.createGroupName = '';
             $("#createGroup").modal('close')
             $scope.invalidGroup = false;

         }else{
             $scope.invalidGroup = true;
         }

     }

    if(groupCount == 0){
        $("#noGroups").show();
    }else{
        $("#noGroups").hide();
    }
})
//controller to get and display 'today's' events'
app.controller('groupController', function ($scope, $rootScope, $http, $location) { 
    //client side "auth" for testing
    if(!$rootScope.auth){
        $location.path('/')
    }
    var d = new Date();
    var count = 0;
    var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    $scope.today = d.getDate() + ' ' + months[d.getMonth()] + ', ' + d.getFullYear();
    $scope.todaysEvents = [];
    $scope.users = [];
    //get data from db, events and members
    $http.get('/api/groupCalendar/' + $rootScope.groupId).then(function(data){
        //get calendar members if there are no events
        if(data.data.length == 0){
            //get only the members
            $http.get("/api/getMembers/" + $rootScope.groupId).then(function(data){
                data.data[0].GroupCalendar.members.forEach(function (user) {
                    $scope.users.push(user);
                })

            })

        }else{

        
        $scope.calendar = data.data[0];
        // console.log(data.data);

        //need to populate users with group users
        $scope.calendar.GroupCalendar.members.forEach(function (user) {
            $scope.users.push(user);
        })


        //when we change the date, refresh the events for the day
        $scope.$watch('today', function(){
            // console.log($rootScope.groupId);
            count = 0;
            $scope.todaysEvents = [];
            data.data.forEach(function (todayEvent) { 
                if(todayEvent.GroupEvent[0].date == $scope.today){
                    $scope.todaysEvents.push(todayEvent.GroupEvent[0]);
                    count++;
                    // console.log("event added")
                }

            })
            // console.log($scope.todaysEvents);
            // console.log('changed date');
            if(count==0){
                $("#noEvents").show();
                // console.log('noEvents')
            }else{
                $("#noEvents").hide();
            }
        })
        }
    });
    $scope.eventTitle = '';
    $scope.eventDes = '';
    $scope.invalidEvent = false;
    $scope.addEvent = function(){
        //get calendar from db
        
         //add event to database usiing an http request
         if($scope.eventTitle != '' && $scope.eventDes != ''){

            $http.post('/api/myCalendar/' + $rootScope.groupId, {"name": $scope.eventTitle, "description": $scope.eventDes, "date": $scope.today}).then(function(){
                //update the events for user
                $http.get('/api/groupCalendar/' + $rootScope.groupId).then(function (data) {  
                    //when we change the date, refresh the events for the day
                    $scope.$watch('today', function(){
                        // console.log($rootScope.groupId);
                        count = 0;
                        $scope.todaysEvents = [];
                        data.data.forEach(function (todayEvent) { 
                            if(todayEvent.GroupEvent[0].date == $scope.today){
                                $scope.todaysEvents.push(todayEvent.GroupEvent[0]);
                                count++;
                                // console.log("event added")
                            }

                        })
                        // console.log($scope.todaysEvents);
                        // console.log('changed date');
                        if(count==0){
                            $("#noEvents").show();
                            // console.log('noEvents')
                        }else{
                            $("#noEvents").hide();
                        }
                    })
                });
            })

            //clear event details
            $scope.eventTitle = '';
            $scope.eventDes = '';
            $("#addModal").modal('close')
            $scope.invalidEvent = false;
         }else{
             $scope.invalidEvent = true;
         }

     }

})