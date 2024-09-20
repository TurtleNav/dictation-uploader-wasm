const recordButton = document.getElementById("record-button");
const pauseButton = document.getElementById("pause-button");
const resumeButton = document.getElementById("resume-button");
const stopButton = document.getElementById("stop-button");
const timer = document.getElementById("timer");
const timerLabel = document.getElementById("timer-label");

const recordButtonLabel = document.getElementById("record-button-label");
const resumeButtonLabel = document.getElementById("resume-button-label");
const pauseButtonLabel = document.getElementById("pause-button-label");
const stopButtonLabel = document.getElementById("stop-button-label");

resumeButton.style.display = 'none';
resumeButtonLabel.style.display = 'none';
pauseButton.style.display = 'none';
pauseButtonLabel.style.display = 'none';
stopButton.style.display = 'none';
stopButtonLabel.style.display = 'none';

let startTime;
let currentTime;
let intervalID;
let clockRunning = false;
let isPaused = false;
let milliseconds = 0;
let seconds = 0;
let minutes = 0;
let pauseTime = 0;


function startTimer() {
	if (!clockRunning) {
		startTime = new Date().getTime();
		intervalID = setInterval(updateTimer, 10);
		clockRunning = true;
		timer.hidden = false;
		isPaused = false;
	}
	if (isPaused) {
		pauseTimer();
	}
	recordButton.style.display = 'none';
	recordButtonLabel.style.display = 'none';
	pauseButton.style.display = 'flex';
	pauseButtonLabel.style.display = 'flex';
	stopButton.style.display = 'flex';
	stopButtonLabel.style.display = 'flex';
}

function stopTimer() {
	clearInterval(intervalID);
	timer.hidden = true;
	clockRunning = false;
	isPaused = false;
	timer.innerHTML = "00:00:00";
	timerLabel.innerHTML = "";
	pauseTime = 0;
	milliseconds = 0;
	seconds = 0;
	minutes = 0;
	recordButton.style.display = 'flex';
	recordButtonLabel.style.display = 'flex';
	pauseButton.style.display = 'none';
	pauseButtonLabel.style.display = 'none';
	resumeButton.style.display = 'none';
	resumeButtonLabel.style.display = 'none';
	stopButton.style.display = 'none';
	stopButtonLabel.style.display = 'none';
}

function pauseTimer() {
	if (!clockRunning) {
		return;
	}
	const currentTime = new Date().getTime();
	if (isPaused) {
		pauseTime += currentTime;
		isPaused = false;
		// recordButton.classList.remove('hidden');
		//recordButton.style.display = 'flex';

		pauseButton.style.display = 'flex';
		pauseButtonLabel.style.display = 'flex';
		resumeButton.style.display = 'none';
		resumeButtonLabel.style.display = 'none';

	} else {
		pauseTime -= currentTime;
		isPaused = true;
		// recordButton.classList.add('hidden');
		//recordButton.style.display = 'none';

		resumeButton.style.display = 'flex';
		resumeButtonLabel.style.display = 'flex';
		pauseButton.style.display = 'none';
		pauseButtonLabel.style.display = 'none';

	}
}

function updateTimer() {
	const tDelta = new Date().getTime() - startTime - pauseTime;
	let milliseconds = Math.floor((tDelta % 1000) / 10);
	let seconds = Math.floor((tDelta / 1000) % 60);
	let minutes = Math.floor((tDelta / (1000 * 60)) % 60);

	// Zero pad the numbers if less than 10
	if (milliseconds < 10) {
		milliseconds = "0" + milliseconds;
	}
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	if (isPaused) {
		timerLabel.innerHTML = "Paused at";
	} else {
		timerLabel.innerHTML = "Recording - ";
		timer.innerHTML = minutes + ":" + seconds + ":" + milliseconds;
	}
}

function setTimerText() {
	if (isPaused) {
		timerLabel.innerHTML = "Paused at";
	} else {
		timerLabel.innerHTML= "Recording -";
	}
}	

recordButton.addEventListener('click', function() {
	fetch('/start_recording', {method: 'POST'})
		.then(response => response.json())
		.then(data => {
			console.log(data);
			//.innerText = data.feedback;
		});
	this.classList.toggle('recording');
	startTimer();
});

pauseButton.addEventListener('click', function() {
	fetch('/pause_recording', {method: 'POST'})
		.then(response => response.json())
		.then(data => {
			console.log(data);
		});
	pauseTimer();
	this.hidden = true;
	resumeButton.hidden = false;
});

resumeButton.addEventListener('click', function() {
	fetch('/resume_recording', {method: 'POST'})
		.then(response => response.json())
		.then(data => {
			console.log(data);
			//.innerText = data.feedback;
		});
	pauseTimer();
	this.hidden = true;
	pauseButton.hidden = false;
});

stopButton.addEventListener('click', function() {
	fetch('/stop_recording', {method: 'POST'})
		.then(response => response.json())
		.then(data => {
			console.log(data);
			//.innerText = data.feedback;
		});
	stopTimer();
});
