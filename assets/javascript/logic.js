// Initialize Firebase


// var freqPoint = 30
// var firstTime = '06:30'

var dateNow = moment().format('MM/DD/YYYY')

console.log()



var config = {
    apiKey: "AIzaSyBCmWZmNvybwdyqdgejkxzxO3S37S9MShU",
    authDomain: "bootcamp-train-assignment.firebaseapp.com",
    databaseURL: "https://bootcamp-train-assignment.firebaseio.com",
    projectId: "bootcamp-train-assignment",
    storageBucket: "bootcamp-train-assignment.appspot.com",
    messagingSenderId: "4992845849"
};
firebase.initializeApp(config);

var database = firebase.database();

database.ref().on("child_added", function(snapshot) {
    var sv = snapshot.val();

    var minDiff = moment().diff(dateNow + ' ' + sv.trainTime , 'minutes')
    var nextArrivalMinutes = Math.abs(minDiff%sv.trainFrequency-sv.trainFrequency)

    var newRow = $('<tr>').attr( 'id' , snapshot.key);
    var trainName = $('<td>').text(sv.trainName);
    var trainDestination = $('<td>').text(sv.trainDestination);
    var trainFrequency = $('<td>').text(sv.trainFrequency);
    var nextArrival = $('<td>').text(moment().add(nextArrivalMinutes , 'minutes').format('HH:mm'));
    var minutesAway = $('<td>').text(nextArrivalMinutes);
    var removeButton = $('<button>').addClass('remove-button').val(snapshot.key).text('remove')
    var removeButtonBox = $('<td>').append(removeButton);

    $(removeButton).on('click' , function(){
        database.ref().child(this.value).remove();
        $('#'+this.value).remove();
    });
    
    newRow.append(trainName , trainDestination , trainFrequency , nextArrival , minutesAway , removeButtonBox);
    $('#train-table').append(newRow);


// If any errors are experienced, log them to console.
}, function(errorObject) {
console.log("The read failed: " + errorObject.code);
});


$("#train-submit").on("click", function(event) {
    // Prevent form from submitting
    event.preventDefault();

    var userTrainName = $("#train-name").val();
    var userDestination = $('#destination').val();
    var userFirstTrainTime = $('#first-train-time').val();
    var userFrequency = $('#frequency').val();

    re = /^\d{1,2}:\d{2}([ap]m)?$/;

    if(userTrainName == ""){
        $('#name-validate').text('Please Enter a Name');
    }else if(userDestination == ""){
        $('#name-validate').text('');
        $('#destination-validate').text('Please Enter a Destination');


    }else if(!userFirstTrainTime.match(re)){
        $('#destination-validate').text('');
        $('#time-validate').text('Please Enter a Valid Time');

    }else if(isNaN(userFrequency)||userFrequency==""){
        $('#time-validate').text('');
        $('#frequency-validate').text('Please Enter a Number');
    }else{
        database.ref().push({
            trainName: userTrainName,
            trainDestination: userDestination,
            trainTime: userFirstTrainTime,
            trainFrequency: userFrequency,
        })

        $('#name-validate').text('');
        $('#destination-validate').text('');
        $('#time-validate').text('');
        $('#frequency-validate').text('');
    
        $("#train-name").val('');
        $('#destination').val('');
        $('#first-train-time').val('');
        $('#frequency').val('');
    }

    

});