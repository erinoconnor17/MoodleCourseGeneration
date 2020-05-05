var Docker = require('dockerode');
var express = require('express');

var app = express()
var docker = new Docker({socketPath: '/var/run/docker.sock'});

var root_path = "/home/chenstev/root/";

// Need to discuss what this sends
app.get('/containers', (req, res) => {
	data = [];
	docker.listContainers( (err, containers) => {
		res.send(containers);
	});


});

let makeSession = (name, port) => {
	let id = name + '_' + port;
	let net_name = 'net_' + id;
	let db_name = 'db_' + id;
	let server_name = 'server_' + id;

	let course_path = root_path + name + '/course';
	// Network
	docker.createNetwork({name : net_name})

	.then(function(network) {
		return docker.createContainer({Image: 'moodle_db:0.1', 
					name: db_name, 
					HostConfig: {NetworkMode: net_name}
					});
	})
	.then(function(container) {
		container.start();
		return docker.createContainer({Image: 'moodle_server:0.1', 
					name: server_name, 
					Env: ["MARIADB_HOST="+db_name], 
					HostConfig: {
						NetworkMode: net_name ,
						PortBindings: {"80/tcp": [{ "HostPort": port}]},
						Binds: [ `${course_path}:/course` ]
					}});
	})
	.then( (container) => container.start())
	.catch( (e) => console.log(e));
};

app.get('/create', (req, res) => {
	let name = "course_test";
	let port = "8090";
	makeSession(name, port);
	docker.getContainer('server_'+name+'_'+port).inspect( (err, data) => res.send(data));
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
