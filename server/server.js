var Docker = require('dockerode');
var express = require('express');

var app = express()
var docker = new Docker({socketPath: '/var/run/docker.sock'});


// Need to discuss what this sends
app.get('/containers', (req, res) => {
	data = [];
	docker.listContainers( (err, containers) => {
		res.send(containers);
	});


});


app.listen(2020, () => console.log("Listening"));

//file upload button
const realFileBtn = document.getElementById("real-file");
const customBtn = document.getElementById("custom-button");
const customTxt = document.getElementById("custom-text");

customBtn.addEventListener("click", function(){
	realFileBtn.click();
});
/*
realFileBtn.addEventListener("change", function(){
	if(realFileBtn.value) {
		customTxt.innerHTML = realFileBtn.value.match(
			/[\/\\]([\w\d\s\.\-\(\)]+)$/
		)[1];
	} else{
		customTxt.innerHTML = "No file chosen, yet.";
	}
});
*/
