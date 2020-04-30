//!Goal 1: Show the array of courses on screen!
//!Goal 2: Add a course to the array of courses!
//!Goal 3: Click a course to increase their age by one year
let firebaseRef = firebase.database().ref('active-exams');

let clickHandler = function(course, courseKey){
  let courseRef = firebaseRef.child(courseKey).child('exam');
  courseRef.remove(course.exam);
};

let callback = function(snapshot){
  $("#activeExams").html('');
  let data = snapshot.val();
  Object.keys(data).map(
    courseKey => {
      let course = data[courseKey];
      let $li = $(`<li>
<span>${course.exam} in ${course.courseNumber} is active</span>
</li>`);
      $li.on('click', clickHandler.bind(this, course, courseKey));
      $("#activeExams").append($li);
    }
  );
};

firebaseRef.on('value', callback);

$("#createnewcourse").on('click', evt=>{
  let courseNumber = $("#coursenumber").val();
  let exam = $("#examname").val();
  let newfirebaseRef = firebaseRef.push();
  newfirebaseRef.set({
    courseNumber, exam
  }).then(
    function(){
      console.log("the future");
      $("#coursenumber").val('');
      $("#examname").val('');
    }
  );
  console.log("the past");
});
