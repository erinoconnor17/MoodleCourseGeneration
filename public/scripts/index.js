//!Goal 1: Show the array of courses on screen!
//!Goal 2: Add a course to the array of courses!
//!Goal 3: Click a course to increase their age by one year
//var firebase = require('firebase/app');


// fyi posting api keys to a public github repo is not good
// read them from a config.js file in you're .gitignore in the future

let clickHandler = function() {
	console.log("switching screens");
	$('#start-page').toggle();
	$('#courseScreen').toggle();
}


let showActiveExams = function(){
	// There are better ways to do this.. move fast/break things
	
	$("#activeExams").empty();
	const url = "http://64.225.15.171:2020/containers";
	fetch (url, {method: 'GET'})
	.then ( (res) => res.json())
	.then ( (containers) => {
		containers.map ( data => {
			let $li = $(`<li><span>${data.course} ${data.exam} is active</span></li>`);
			let $button = $(`<button onclick="endExam('${data.course}','${data.exam}', '${data.port}')">End Exam</button>`);
			// I'm not sure why this was bound twice
			//$button.on('click', endExam.bind(this, data.course, data.exam, data.port));
			$("#activeExams").append($li).append($button);
		});
	});
};

let uploadFile = function() {
	let course = $("#coursenumber").val();
	let exam = $("#examname").val();
	let port = $('#portnumber').val();
	
	let file = document.getElementById('myFile').files[0];
	let formData = new FormData();
	formData.append('course', file);
	const url = `http://64.225.15.171:2020/uploadCourse?course=${course}&exam=${exam}&port=${port}`;
	fetch (url, {
		method: 'POST',
		body: formData})
	.then ( res => res.text())
	.then ( () => console.log("uploaded?"));
}


let createExam = function() {
	let course = $("#coursenumber").val();
	let exam = $("#examname").val();
	let port = $('#portnumber').val();

	const url = `http://64.225.15.171:2020/create?course=${course}&exam=${exam}&port=${port}`;
	fetch (url, {method: 'GET'})
	.then ( res => res.text())
	.then ( body => console.log(body))
	.then ( () => {
		clickHandler();
		showActiveExams();
	});
}

let endExam = function(course, exam, port) {
	console.log(`deleting ${exam} from ${course} running on ${port}`);
	
	const url = `http://64.225.15.171:2020/delete?course=${course}&exam=${exam}&port=${port}`;
	fetch (url, {method: 'GET'})
	.then ( res => res.text())
	.then ( body => console.log(body))
	.then ( () => showActiveExams());

	// For now this actually destroys the container. We should seperate 'stop' and 'delete' eventually
	
}

function timeLimit() {
	// Get the checkbox
	var checkBox = document.getElementById("time");
	var text = document.getElementById("timelimit");

	// If the checkbox is checked, display the output text
	if (checkBox.checked == true){
		text.style.display = "block";
	}
	else {
		text.style.display = "none";
	}
}

//Im sorry
showActiveExams();
