// The following few functions hide the other screens when one is displaying
// It's ugly code but it works
let clickHandler = function() {
	var a = document.getElementById("instruct-screen");
	var b = document.getElementById("create-screen");
	var x = document.getElementById("contact-screen");
	var y = document.getElementById("main-grid");
	var z = document.getElementById("about-screen");
	if (y.style.display === "none") {
	  y.style.display = "grid";
	  x.style.display = "none";
	  z.style.display = "none";
	  a.style.display = "none";
	  b.style.display = "none";
	}
}
var ccount = 0;
var acount = 0;
var icount = 0;
var crcount = 0;
let createClickHandler = function() {
	var a = document.getElementById("instruct-screen");
	var b = document.getElementById("create-screen");
	var x = document.getElementById("contact-screen");
	var y = document.getElementById("main-grid");
	var z = document.getElementById("about-screen");
	if (b.style.display === "none" || crcount == 0) {
		crcount++;
	  b.style.display = "grid";
	  y.style.display = "none";
	  z.style.display = "none";
	  a.style.display = "none";
	  x.style.display = "none";
	} 
}

let aboutClickHandler = function() {
	var a = document.getElementById("instruct-screen");
	var b = document.getElementById("create-screen");
	var x = document.getElementById("contact-screen");
	var y = document.getElementById("main-grid");
	var z = document.getElementById("about-screen");
	if (z.style.display === "none" || acount == 0) {
		acount++;
	  z.style.display = "grid";
	  x.style.display = "none";
	  y.style.display = "none";
	  a.style.display = "none";
	  b.style.display = "none";
	} 
}
let instructClickHandler = function() {
	var a = document.getElementById("instruct-screen");
	var b = document.getElementById("create-screen");
	var x = document.getElementById("contact-screen");
	var y = document.getElementById("main-grid");
	var z = document.getElementById("about-screen");
	if (a.style.display === "none" || icount == 0) {
		icount++;
	  a.style.display = "grid";
	  x.style.display = "none";
	  y.style.display = "none";
	  z.style.display = "none";
	  b.style.display = "none";
	}
}
let contactClickHandler = function() {
	var a = document.getElementById("instruct-screen");
	var b = document.getElementById("create-screen");
	var x = document.getElementById("contact-screen");
	var y = document.getElementById("main-grid");
	var z = document.getElementById("about-screen");
	if (x.style.display === "none" || ccount == 0) {
		ccount++;
	  x.style.display = "grid";
	  y.style.display = "none";
	  z.style.display = "none";
	  a.style.display = "none";
	  b.style.display = "none";
	} 
}

//!Goal 1: Show the array of courses on screen!
//!Goal 2: Add a course to the array of courses!
//!Goal 3: Click a course to increase their age by one year
//var firebase = require('firebase/app');


// fyi posting api keys to a public github repo is not good
// read them from a config.js file in you're .gitignore in the future

let showActiveExams = function(){
	
	$("#activeExams").empty();
	const url = "http://64.225.15.171:2020/containers";
	fetch (url, {method: 'GET'})
	.then ( (res) => res.json())
	.then ( (containers) => {
		containers.map ( data => {
			let $li = $(`<div class="item">Course: <b>${data.course}</b> <br>Exam: <b>${data.exam}</b><br>Port: <b>${data.port}</b><div class="center">
			<div class="select-button" onclick="sendEndMessage('${data.course}','${data.exam}', '${data.port}')">Stop</div></div></div>`);
			$("#activeExams").append($li);
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

// Checks if user wants to create exam
function sendCreateMessage(){
	var r = confirm("Are you sure you'd like to create this exam?");
	if (r == true) {
		  createExam();
		  clickHandler();
	} 
}
// Checks if user wants to end exam
function sendEndMessage(course, exam, port){
	
	var r = confirm("Are you sure you'd like to end " + course + " " + exam + " listening on port " + port + "?");
	if (r == true) {
		endExam(course, exam, port)
	} 
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

$(function(){
	function list(){
		$('.grid span').removeClass('active');
		$('.list span').addClass('active');
		$('.wrapper').removeClass('grid').addClass('list');
	}	
	
	function grid(){
		$('.list span').removeClass('active');
		$('.grid span').addClass('active');
		$('.wrapper').removeClass('list').addClass('grid');
	}	
	
	$('.list').click(list);
	$('.grid').click(grid);
});
//Im sorry
showActiveExams();