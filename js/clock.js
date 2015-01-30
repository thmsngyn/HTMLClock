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

getTemp();
getTime();