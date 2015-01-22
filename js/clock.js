document.onload = getTime();
function getTime() {
	var clockElement = document.getElementById("time");
	var date = new Date();
	clockElement.innerHTML = date.toLocaleTimeString();
	setTimeout(function() {getTime()}, 1000);
}