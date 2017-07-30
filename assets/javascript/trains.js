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

var database = firebase.database();


//Event Handlers

$(document).ready(function() {


});

$("#submitNewTrain").on("click", function() {
    // Don't refresh the page!
    event.preventDefault();
    var name = $("#nameInput").val().trim();
    var destination = $("#destinationInput").val().trim();
    var frequency = $("#frequencyInput").val().trim();
    var firstArrival = $("#firstArrivalInput").val().trim();
    //Derived values

    database.ref().push({
        name: name,
        destination: destination,
        frequency: frequency,
        firstArrival: firstArrival,
    });

});

/*childSnapshot.val().firstArrival*/

database.ref().on("child_added", function(childSnapshot, prevChildKey) {
    var nextArrival = childSnapshot.val().firstArrival;
    var minutesAway = moment().diff(nextArrival);
    console.log(nextArrival);
    $("#trainTable").append("<tr><td>" + childSnapshot.val().name + "</td><td>" + childSnapshot.val().destination + "</td><td>" + childSnapshot.val().frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td>")
});

/*    var randomDate = "02/23/1999";

    // Using scripts from moment.js write code below to complete each of the following.
    // Console.log to confirm the code changes we made worked.
    console.log(moment(randomDate).format("ddd MM YYYY"));
    console.log(moment(randomDate).format("DD MM YYYY"));
    console.log(moment(randomDate).format("d MM YYYY"));
    console.log("From Now " + moment(randomDate).diff(moment(), 'days'));

    // 2 ...to determine the time in years, months, days between today and the randomDate
    // 3 ...to determine the number of days between the randomDate and 02/14/2001
    // 4 ...to convert the randomDate to unix time (be sure to look up what unix time even is!!!)
    // 5 ...to determine what day of the week and what week of the year this randomDate falls on.

    // If you finish early...
    // Start creating HTML inputs and then redisplay the dates using moment.js elsewhere on the page.
*/
