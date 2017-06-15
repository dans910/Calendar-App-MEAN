// var editId;
// var eventCtr = 0;
//Bring up add event or create new group modal
$("#addBtn").click(function(){

    //home tab is selected, add new event to calender
    $("#modalTitle").text("Add Event")
    $("#groupdiv").hide()
    $("#eventdiv").show()
    
    $("#addModal").modal()

})
$("#createGroupbtn").click(function(){
    $("#createGroup").modal()
})


  $('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 5 // Creates a dropdown of 15 years to control year
  });

  function gohome(){
      $("#homeContent").show();
      $("#groupContent").hide();
  }
  function gogroup(){
      $("#homeContent").hide();
      $("#groupContent").show();
  }
//stuff we don't need
  // $("#submitEvent").click(function(){
    // var title = $("#eventTitle").val()
    // var description = $("#description").val()

    // if(title != "" || description != ""){
    //     if($("#modalTitle").text() == "Edit Event"){
    //         //update the db
    //         var event = {date : 'day', name : title, description : description}
    //         updateEvent(event, editId)
    //         updateWeek()
    //         $("#addModal").modal('close')
    //     }else{
    //         //save to the db
    //         var event = {date : 'day', name : title, description : description}
    //         addEvent(event)
    //         updateWeek()
    //         $("#addModal").modal('close')
    //     }
    // }
    //  $("#eventTitle").val('')
    //  $("#description").val('')

// })
//functoin to add event takes an event as parameter
// function addEvent(event){//copy card from tamplate and change those card details accordingly   
//     eventCtr = eventCtr + 1; 
//     var newEvent = $("#eventtemplate").clone(true)
//     newEvent.find("#day").text(event.date)
//     newEvent.find(".card-title").text(event.name)
//     newEvent.find("#des").append('<i class="material-icons right">close</i>')
//     newEvent.find(".card-reveal p").text(event.description)
//     newEvent.attr('id', "event" + eventCtr)
//     $("#todayEvents").append(newEvent)
// }
// function updateEvent(event, currentId){//copy card from tamplate and change those card details accordingly
//     var newEvent = $("#" + currentId)
//     newEvent.find("#day").text(event.date)
//     newEvent.find(".card-title").text(event.name)
//     newEvent.find("#des").append('<i class="material-icons right">close</i>')
//     newEvent.find(".card-reveal p").text(event.description)
//     $("#todayEvents").append(newEvent)
// }
// function addEmptyEvent(){
//     var newEvent = $("#eventtemplate").clone(true)

//     $("#todayEvents").append(newEvent)
// }
// // //update the week view
// function updateWeek(){

// }
// $(".edit").click(function(e){
//     $("#modalTitle").text("Edit Event")
//     //console.log($(e.currentTarget).parent().parent().parent().attr('id'))
//     editId = $(e.currentTarget).parent().parent().parent().attr('id')
//     var title = $(e.currentTarget).parent().parent().find(".card-content span").text()
//     var des = $(e.currentTarget).parent().parent().find(".card-reveal p").text()
//     $("#eventTitle").val(title)
//     $("#description").val(des)
//     $("#eventdiv").show()
//     $("#addModal").modal()
// })