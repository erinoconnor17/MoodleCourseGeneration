let today = new Date();
let time = today.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true});
let hours = today.getHours();
let month = today.getMonth();
let day = today.getUTCDate();
let year = today.getFullYear();

let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

document.getElementById('time').innerHTML = time;
document.getElementById('date').innerHTML = months[month] + " "+ day + ", " + year;

function displayGreeting() {
  if (hours < 11) {
    return 'good morning';
  } if ( hours > 17) {
    return 'good evening';
  } else {
    return 'good afternoon';
  }
}

document.getElementById('greeting').innerHTML = displayGreeting();