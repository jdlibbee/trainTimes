// Initialize Firebase
var config = {
    apiKey: "AIzaSyBdqIc1bBKtpYZHS2xyqUuZsXfEcYDCP4c",
    authDomain: "libbee-s-station.firebaseapp.com",
    databaseURL: "https://libbee-s-station.firebaseio.com",
    projectId: "libbee-s-station",
    storageBucket: "libbee-s-station.appspot.com",
    messagingSenderId: "510228856053"
};
firebase.initializeApp(config);

var database = firebase.database();
var trainName = "";
var destination = "";
var firstTrain = "";
var frequency;
//adding train to schedule
$('#submitButton').on('click', function (event) {
    event.preventDefault();
    trainName = $('#trainName').val().trim();
    destination = $('#destination').val().trim();
    firstTrain = $('#firstTrain').val().trim();
    frequency = $('#frequency').val().trim();
    console.log("info" + trainName + destination + firstTrain + frameElement);
    database.ref().push({
        train: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
    });
    $('#trainName').attr('placeholder', 'Train').val("");
    $('#destination').attr('placeholder', 'Destination').val("");
    $('#firstTrain').attr('placeholder', '00:00').val("");
    $('#frequency').attr('placeholder', '0 min').val("");


})
database.ref().on('child_added', function (snapshot) {
    console.log(snapshot.val());
    var sv = snapshot.val();
    var newName = (sv.train);
    var newDestination = (sv.destination);
    var newTime = (sv.firstTrain);
    var newRate = (sv.frequency);


    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(newTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % newRate;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = newRate - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    console.log(newName);
    console.log(newDestination);
    console.log(newTime);
    console.log(newRate);
    $('#trainData').append($(`<tr><td>${newName}</td><td>${newDestination}</td><td>${newRate}</td><td>${newTime}</td><td>${tMinutesTillTrain}</td></tr>`));
}, function (errorObject) {

    console.log("Errors handled: " + errorObject.code);

});
