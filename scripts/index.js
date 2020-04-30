//!Goal 1: Show the array of students on screen!
//!Goal 2: Add a Student to the array of students!
//!Goal 3: Click a Student to increase their age by one year
let examRef = firebase.database().ref('active-exams');

let clickHandler = function(student, studentKey){
  let ageRef = studentRef.child(studentKey).child('age');
  ageRef.remove(parseInt(student.age) + 1);
};

let callback = function(snapshot){
  $("#nameshere").html('');
  let data = snapshot.val();
  Object.keys(data).map(
    studentkey => {
      let student = data[studentkey];
      let $li = $(`<li>
<span>${student.name} is ${student.age} years old.</span>
</li>`);
      $li.on('click', clickHandler.bind(this, student, studentkey));
      $("#nameshere").append($li);
    }
  );
};

studentRef.on('value', callback);

$("#createnewstudent").on('click', evt=>{
  let name = $("#studentname").val();
  let age = parseInt($("#studentage").val());
  let newStudentRef = studentRef.push();
  newStudentRef.set({
    name, age
  }).then(
    function(){
      console.log("the future");
      $("#studentname").val('');
      $("#studentage").val('');
    }
  );
  console.log("the past");
});
