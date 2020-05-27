
// fyi posting api keys to a public github repo is not good
// read them from a config.js file in you're .gitignore in the future

let clickHandler = function() {
	console.log("switching screens");
	$('#start-page').toggle();
	$('#courseScreen').toggle();
}

let fileUploaded = function() {
	console.log("button switcharoo");
	$('#submit').toggle();
	$('#upload').toggle();
	//$("#uploadExam").replaceWith(" Upload Exam ");
}


let showActiveExams = function(){
	// There are better ways to do this.. move fast/break things
	console.log("in showActiveExams");
	$("#activeExams").empty();
	const url = "http://64.225.15.171:2020/containers";
	fetch (url, {method: 'GET'})
	.then ( (res) => res.json())
	.then ( (containers) => {
		containers.map ( data => {
			let $li = $(`<li><span>${data.course} ${data.exam} is active</span></li>`);
			let $button = $(`<type="button" class="endButton" onclick="endExam('${data.course}','${data.exam}', '${data.port}')">End Exam</button>`);
			// I'm not sure why this was bound twice
			//$button.on('click', endExam.bind(this, data.course, data.exam, data.port));
			$("#activeExams").append($li).append($button);
			console.log($li);
		});
	});
};

let uploadFile = function() {
	let $dots = $(`<span class="button-text loading" id="uploadExam">Uploading<span> .</span><span> .</span><span> .</span></span>`);
	$("#uploadExam").replaceWith($dots)
	//$("#uploadButton").addClass("disabled");
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
	.then ( () => console.log("uploaded?"))
	.then (() => { let $upload = $(`<span class="button-text" id="uploadExam"> Upload Exam </span>`); //i'm so sorry for this hacky nonsense
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
		  //titleScreen();
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

//Im sorry
showActiveExams();
