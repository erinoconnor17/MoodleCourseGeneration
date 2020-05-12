const Docker = require('dockerode');
const express = require('express');
const fileupload = require('express-fileupload');
const fs = require('fs');
const shell = require('shelljs');
const path = require ('path');

const app = express()
app.use (fileupload());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const docker = new Docker({socketPath: '/var/run/docker.sock'});

const root_path = "/home/chenstev/root/";

let parse_container = (c) => {
	let name = c.Names[0];
	let fields = name.split('_');
	if (fields[0] === '/server') {
		return {
			"course": `${fields[1]}`,
			"exam": `${fields[2]}`,
			"port": `${fields[3]}`
		};
	}
	else {
		return;
	}
};

app.get('/containers', (req, res) => {
	data = [];
	docker.listContainers( (err, containers) => {
		res.send (containers.map(parse_container).filter( (x) => x));
	});

});

let makeSession = (name, port) => {
	let id = name + '_' + port;
	let net_name = 'net_' + id;
	let db_name = 'db_' + id;
	let server_name = 'server_' + id;

	let course_path = root_path + name + '/course';
	let server_container;
	return docker.createNetwork({name : net_name})

		.then(function(network) {
			return docker.createContainer({Image: 'moodle_db:0.1', 
				name: db_name, 
				HostConfig: {NetworkMode: net_name}
			});
		})
		.then(function(container) {
			container.start();
			return docker.createContainer({Image: 'moodle_server:0.2', 
				name: server_name, 
				Env: ["MARIADB_HOST="+db_name], 
				HostConfig: {
					NetworkMode: net_name ,
					PortBindings: {"80/tcp": [{ "HostPort": port}]},
					Binds: [ `${course_path}:/course` ]
				}});
		})
		.then( (container) => {
			return container.start();

		})
		.catch( (e) => console.log(e));
};

let deleteSession = (name, port) => {
	let id = name + '_' + port;
	let net_name = 'net_' + id;
	let db_name = 'db_' + id;
	let server_name = 'server_' + id;

	let server = docker.getContainer(server_name);
	let db = docker.getContainer(db_name);
	let net = docker.getNetwork(net_name);

	return server.stop()
		.then(function(data) {
			return db.stop();
		})
		.then (function(data) {
			return server.remove();
		})
		.then (function(data) {
			return db.remove();
		})
		.then (function(data) {
			return net.remove();
		});
};

app.get('/create', (req, res) => {
	let name = req.query.course;
	let exam = req.query.exam;
	let port = req.query.port;

	let message;

	if (!name || !exam || !port) {
		res.send("missing query parameters");
		return;
	}
	else {
		let id = `${name}_${exam}`;
		makeSession(id, port)
		.then ( data => res.send(data)); 
	}
});

app.get('/delete', (req, res) => {
	let name = req.query.course;
	let exam = req.query.exam;
	let port = req.query.port;
	let message;

	if (!name || !exam || !port) {
		res.send("exam does not exist");
		return;
	}
	else {
		let id = `${name}_${exam}`;
		deleteSession(id,port)
		.then( (data) => res.send("Success"));
	}
});

app.post('/uploadCourse', (req, res) => {
	let course = req.files.course;
	let name = req.query.course;
	let exam = req.query.exam;
	let port = req.query.port;
	let path = `${root_path}${name}_${exam}/course/`;
	
	// this is apparently known not to work... i hate javascript
	//fs.mkdirSync(path, {recursive: true});
	
	shell.mkdir('-p', path);

	course.mv(path+'backup.mbz', (error) => {
		if (error) {
			console.log(error);
			res.send("Failed to upload");
			return;
		}
		res.send("Probably uploaded");
	});
});


app.use(express.static(path.join(__dirname, '../public')));

app.listen(2020, () => console.log("Listening"));
