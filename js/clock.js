var userId = -1;
var name = "";

$(document).ready(function() {
	getTime();
	getTemp();
});

function signinCallback(authResult) {
    if (authResult['status']['signed_in']) {
    	document.getElementById('signinButton').setAttribute('style', 'display: none');
        gapi.client.load('plus', 'v1', loaded);
      } else {
        console.log('Sign-in state: ' + authResult['error']);
        name = "";
      }
}

function loaded() {
    var request = gapi.client.plus.people.get({'userId' : 'me'});
    request.execute(function(result) {
        name = result.displayName;
        userId = result.id;
        $(".smallText").after("<h2> Welcome " + name + "!</h2>");
        $(this).load(getAllAlarms(userId));
    });
}

function getTime() {
	var clockElement = document.getElementById("time");
	var date = new Date();
	clockElement.innerHTML = date.toLocaleTimeString();
	setTimeout(function() {getTime()}, 1000);
}

function setBackground(result) {
	var curr = result['daily'].temperatureMax; 
	var backgroundColor;

	if (curr >= 90)
		backgroundColor = 'hot';
	else if (curr >= 80 && curr < 90) 
		backgroundColor = 'warm';
	else if (curr >= 70 && curr < 80) 
		backgroundColor = 'nice';
	else if (curr >= 60 && curr < 70) 
		backgroundColor = 'chilly';
	else
		backgroundColor = 'cold';

	$('body').addClass(backgroundColor);
}

function getTemp() {
	var url = 'https://api.forecast.io/forecast/b3a91db20d6fb3b39564802beb223871/35.300399,-120.662362?callback=?';
	$(document).ready(
		function() {
			$.getJSON (url, 
				function(result) {
					$('#forecastLabel').html(result['daily'].summary);			
					$('#forecastIcon').attr('src', 'img/'+result['daily'].icon+'.png');
					setBackground(result);
			    }
			);
		}
	);
}

function getAllAlarms(userId) {
	Parse.initialize("6hPUirhRABNbFZE05GsiC0seoeeclDcBYlFN6hpe", "wYz6fLumch0WDVaj867jvVfo3Qs1eGpsYtTUJyDE");
	
	var AlarmObject = Parse.Object.extend("Alarm");
    var query = new Parse.Query(AlarmObject);
    query.find({
        success: function(results) {
        	for (var i = 0; i < results.length; i++) { 
          		if (userId == results[i]["attributes"]["user"])
          			insertAlarm(results[i].get("time"), results[i].get("alarmName"), results[i].id);
          	}
        }
    });
}

function addAlarm() {
	var hours = $('#hours option:selected').text();
    var mins = $('#mins option:selected').text();
    var ampm = $('#ampm option:selected').text();
    var time = hours + ":" + mins + " " + ampm;
    var alarmName = $('#alarmName').val();

	var AlarmObject = Parse.Object.extend("Alarm");
    var alarmObject = new AlarmObject();

    alarmObject.save({"time": time,"alarmName": alarmName, "user": userId}, {
    	success: function(object) {
            insertAlarm(time, alarmName, alarmObject.id);
			hideAlarmPopup();
       	}
    });
}

function deleteAlarm(object) {
    var AlarmObject = Parse.Object.extend("Alarm");
    var query = new Parse.Query(AlarmObject);
    
    query.get(object.data.id, {
        success: function(result) {
           result.destroy({});
           $('#' + object.data.id).remove();
        }
    });
}

function insertAlarm(time, alarmName, id) {
	var newdiv = $('<div></div>');
	newdiv.attr('id', id);

	newdiv.addClass('flexable');
	newdiv.append("<img src='img/SmallX.gif'></div>").click({id: id}, deleteAlarm);
	newdiv.append("<div class='name'>" + " " + alarmName + ":  </div>");
	newdiv.append("<div class='time'>" + " " + time + "</div>");


	$("#alarms").append(newdiv);
}

function hideAlarmPopup() {
	$('#mask').addClass('hide');
	$('#popup').addClass('hide');
}

function showAlarmPopup() {
	$('#mask').removeClass('hide');
	$('#popup').removeClass('hide');
}