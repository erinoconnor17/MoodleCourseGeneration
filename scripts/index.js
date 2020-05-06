//!Goal 1: Show the array of courses on screen!
//!Goal 2: Add a course to the array of courses!
//!Goal 3: Click a course to increase their age by one year
//var firebase = require('firebase/app');

//64.225.15.171:2020/create?course=ciscTEST&exam=exam2&port=8000

var firebaseConfig = {
    apiKey: "AIzaSyDmIv2A_bZpOvvLC72Vj7zOVoLlviMoDLM",
    authDomain: "moodle-92a91.firebaseapp.com",
    databaseURL: "https://moodle-92a91.firebaseio.com",
    projectId: "moodle-92a91",
    storageBucket: "moodle-92a91.appspot.com",
    messagingSenderId: "108875363124",
    appId: "1:108875363124:web:78afb905166d42c89dab61"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

let firebaseRef = firebase.database();

/*service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}*/

/*let startExam = function (){
    $("#start-page").hide();
}*/

let clickHandler = function() {
  console.log("switching screens");
  $('#start-page').toggle();
  $('#courseScreen').toggle();
}

/*let clickHandler = function(course, courseKey){
  let courseRef = firebaseRef.child(courseKey).child('exam');
  courseRef.remove(course.exam);
};*/

let callback = function(snapshot){
  $("#activeExams").html('');
  let data = snapshot.val();
  Object.keys(data).reverse().map(
    courseKey => {
      let course = data[courseKey];
      if(course.courseNumber) {
        let $li = $(`<li><span>${course.courseNumber} ${course.exam} is active</span></li>`);
        if(course.examminutes){
          let $min = $(`<br><span>Time Limit: ${course.examminutes} minutes</span>`)
          $li = $li.append($min);
        }
        let $button = $(`<button onclick="endExam('${courseKey}', '${course.courseNumber}', '${course.exam}')">End Exam</button>`);
        $button.on('click', endExam.bind(this, courseKey, course.courseNumber, course.exam));
        $("#activeExams").append($li).append($button);
      }
    }
  );
};

firebaseRef.ref('active-exams').on('value', callback);

let createExam = function() {
  let courseNumber = $("#coursenumber").val();
  let exam = $("#examname").val();
  let examminutes = $("#examminutes").val();
  let newfirebaseRef = firebaseRef.ref('active-exams').push();
  newfirebaseRef.set({
    courseNumber, exam, examminutes
  }).then(
    function(){
      console.log("the future");
      $("#coursenumber").val('');
      $("#examname").val('');
      $("#examminutes").val();
    }
  );
  clickHandler();
  console.log("the past");
}

let endExam = function(courseKey, courseNumber, exam, examminutes) {
  console.log("deleting " + exam + " for " + courseNumber + " " + courseKey);
  let newfirebaseRef = firebaseRef.ref('past-exams').push();
  newfirebaseRef.set({
    courseNumber, exam, examminutes
  }).then(
    function(){
      let courseRef = firebaseRef.ref('active-exams').child(courseKey);
      courseRef.remove();
      console.log("removed " + courseNumber + " " + exam);
      $("#coursenumber").val('');
      $("#examname").val('');
      $("#examminutes").val('');
    }
  );
  console.log("the past");

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