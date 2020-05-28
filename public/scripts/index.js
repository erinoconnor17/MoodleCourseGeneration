// The following few functions hide the other screens when one is displaying
// It's ugly code but it works
let clickHandler = function() {
	var a = document.getElementById("instruct-screen");
	var b = document.getElementById("create-screen");
	var x = document.getElementById("contact-screen");
	var y = document.getElementById("main-grid");
	var z = document.getElementById("about-screen");
	if (y.style.display === "none") {
	document.getElementById("active").className = "active";
	document.getElementById("create").className = "";
	document.getElementById("instruct").className = "";
	document.getElementById("about").className = "";
	document.getElementById("contact").className = "";
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
	document.getElementById("create").className = "active";
	document.getElementById("active").className = "";
	document.getElementById("instruct").className = "";
	document.getElementById("about").className = "";
	document.getElementById("contact").className = "";
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
	document.getElementById("about").className = "active";
	document.getElementById("active").className = "";
	document.getElementById("create").className = "";
	document.getElementById("instruct").className = "";
	document.getElementById("contact").className = "";
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
	  document.getElementById("instruct").className = "active";
	  document.getElementById("active").className = "";
	  document.getElementById("create").className = "";
	  document.getElementById("contact").className = "";
	  document.getElementById("about").className = "";
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
	  document.getElementById("contact").className = "active";
	  document.getElementById("active").className = "";
	  document.getElementById("create").className = "";
	  document.getElementById("instruct").className = "";
	  document.getElementById("about").className = "";
	  x.style.display = "grid";
	  y.style.display = "none";
	  z.style.display = "none";
	  a.style.display = "none";
	  b.style.display = "none";
	} 
}


let fileUploaded = function() {
	console.log("button switcharoo");
	$('#submit').toggle();
	$('#upload').toggle();
}


let showActiveExams = function(){
	console.log("in showActiveExams");
	$("#activeExams").empty();
	const url = "http://64.225.15.171:2020/containers";
	fetch (url, {method: 'GET'})
	.then ( (res) => res.json())
	.then ( (containers) => {
		containers.map ( data => {
			let $li = $(`<div class="item">Course: <b>${data.course}</b> <br>Exam: <b>${data.exam}</b><br>Port: <b>${data.port}</b><div class="center">
			<div class="select-button" onclick="sendEndMessage('${data.course}','${data.exam}', '${data.port}')">Stop</div></div></div>`);
			$("#activeExams").append($li);
			console.log($li);
		});
	});
};

let uploadFile = function() {
	let $dots = $(`<div id="uploadtext"><span class="disabled loading">Uploading<em>.</em><em>.</em><em>.</em></span></div>`);
	$("#uploadtext").replaceWith($dots)
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
	.then (() => { let $upload = $(`<span class="away" id="uploadExam"> Exam Uploaded </span>`); //i'm so sorry for this hacky nonsense
	$("#uploadExam").replaceWith($upload);
})
.then (() => fileUploaded())
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
		$("#coursenumber").val(''); //feel free to clean this code up
		$("#examname").val(''); //is janky
		$("#portnumber").val('');
		$("#timedexam").val('');
		$("#examminutes").val('');
		$("#myFile").val('');
		let $upload = $(`<div id="uploadtext">
									<span class="away">Upload File</span>
									<span class="over">Upload File</span>
									</div>`); //i'm so sorry for this hacky nonsense
		$("#uploadtext").replaceWith($upload);
		fileUploaded();
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