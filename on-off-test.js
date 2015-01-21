// Configuration
var blinkRate=500;

// Internal vars
var buttonPressedValue = 0;
var buttonReleasedValue = 1;
var buttonPressed = false;
var buttonLongPress = false;
var buttonLongPressTimerId = 0;

// I/O setup
var Gpio = require('onoff').Gpio;
var button = new Gpio(17, 'in', 'both', 100);
var led = new Gpio(18, 'out');

// Exit cleanup code
function exit() {
	console.log("Exiting the application.");
	button.unexport();
	led.unexport();
	process.exit();
}

process.on('SIGINT', exit);

// What to do on a long press
function longPressTimeout() {
	console.log("Long press detected!");
	buttonLongPress = true;
	buttonLongPressTimerId = 0;
	led.flashOff();
}

// Add flashing capability to the led
if (led.flashOn || led.flashOff || led.flashState || led.flashTimerId) {
	console.log("Looks like led already has flash stuff going on.");
} else {
	led.flashState = false;
	led.flashOn = function(rate) {
		if (led.flashState === false) {
			led.flashState = true;
			led.writeSync(1);
			led.flashTimerId = setInterval(function() {
					led.writeSync(led.readSync() == 0 ? 1 : 0);
			}, 500);
		}
	};
	led.flashOff = function() {
		if (led.flashState === true) {
			clearInterval(led.flashTimerId);
			led.writeSync(0);
			led.flashState = false;
		}
	};
}

// listen for button events
button.watch(function(err, val) {
	if (err) {
		console.log("Some error occurred.");
	} else {
		if (val == buttonPressedValue) {
			console.log("Button pressed.");
			led.flashOn();
			if (buttonLongPressTimerId == 0) {
				buttonLongPressTimerId = setTimeout(longPressTimeout, 5000);
			}
		} else {
			console.log("Button released.");
			buttonPressed = false;
			if (buttonLongPressTimerId != 0) {
				clearTimeout(buttonLongPressTimerId);
				buttonLongPressTimerId = 0;
			} 
		}
	}
});

// Do an initial read to get power-on button state and start the long-press
// timer, if necessary.
button.read(function(err, val) {
	if (err) {
		console.log("Error reading the button.");
	} else {
		console.log("Button value is " + val);
		led.writeSync(0);
		if (val == buttonPressedValue) {
			buttonPressed = true;
			buttonLongPressTimerId = setTimeout(longPressTimeout, 5000);
		}
	}
});

console.log("Program should be ready.");
	
