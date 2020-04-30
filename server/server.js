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
