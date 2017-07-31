// Initialize Firebase
var config = {
    apiKey: "AIzaSyCpBGXfmPPKZUew4vZ8Xoi0rQdHPTN0PN8",
    authDomain: "this-project-is-okay.firebaseapp.com",
    databaseURL: "https://this-project-is-okay.firebaseio.com",
    projectId: "this-project-is-okay",
    storageBucket: "this-project-is-okay.appspot.com",
    messagingSenderId: "764492224710"
};
firebase.initializeApp(config);

var database = firebase.database(),
    currentTime, updateTime;
var htmlNow = $("#now")



function setupTimers() {
    //Load and update the current time down to the second
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
    //calculate amount of time remaining until the next minute, in seconds
    currentTime = moment();
    updateTime = moment(currentTime).seconds();
    updateTime = 60 - updateTime;
    console.log(updateTime);
    //set a Timeout to begin at the start of the new minute.  On Timeout, run updateAll() once per minute
    setTimeout(function() {
        setInterval(updateAll, 60000);
    }, updateTime * 1000);
};

function updateCurrentTime() {
    htmlNow.text("Current Time: " + moment().format("HH:mm:ss"));
};

function updateAll() {
};

//Event Handlers

$(document).ready(function() {
    setupTimers();
});

$("#submitNewTrain").on("click", function() {
    // Don't refresh the page!
    event.preventDefault();
    var name = $("#nameInput").val().trim();
    var destination = $("#destinationInput").val().trim();
    var frequency = $("#frequencyInput").val().trim();
    var firstArrival = $("#firstArrivalInput").val();
    console.log("FA: " + firstArrival);
    //Derived values
    database.ref().push({
        name: name,
        destination: destination,
        frequency: frequency,
        firstArrival: firstArrival,
    });

});


//Loads all existing child nodes into HTML and calculates derivatives
database.ref().on("child_added", loadChildren);


//this handles all the child loads
function loadChildren (childSnapshot, prevChildKey) {
    //get train's first arrival time
    var tempMoment = moment(childSnapshot.val().firstArrival, 'HH:mm');
    var dataChildKey = childSnapshot.key;
    var nextArrival = tempMoment;
    var minutesAway = moment(tempMoment).diff(moment(), 'minutes');
    var tempMinutes = minutesAway;
    //Handles first arrival times already in the past - figures the number of frequency intervals and adds the difference to the next arrival and calculates minutes away
    if (minutesAway < 0) {
        var increments = Math.abs(minutesAway),
            remainder = 0;
        remainder = increments % childSnapshot.val().frequency;
        increments = Math.floor(increments / childSnapshot.val().frequency) + 1;
        nextArrival = moment(nextArrival).add(increments * childSnapshot.val().frequency, 'minutes');
        minutesAway = childSnapshot.val().frequency - remainder;
    };
    console.log("Key: " + dataChildKey);
    $("#trainTable").append("<tr class='trainListing'><td>" + childSnapshot.val().name + "</td><td>" + childSnapshot.val().destination + "</td><td>" + childSnapshot.val().frequency + "</td><td>" + nextArrival.format('HH:mm') + "</td><td>" + minutesAway + "</td><td><button class='deleteBtn' data-childKey=" + dataChildKey + ">Delete</button></td>");
}
//Removes all references, database and HTML, to the train tied to the delete button.  Uses a confirm popup to ... confirm the delete!
$(document).on("click", ".deleteBtn", function() {
    if (confirm("Are you sure you wish to delete this train?")) {
        //remove the database entry
        var remKey = $(this).data('childkey');
        database.ref().child(remKey).remove();
        //remove the entire train from the HTML table
        $(this).parent().parent().remove();
    };
});