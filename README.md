### On/OFf Test

This is a small program to test the use of the On/Off node package for reading
I/O on the Raspberry Pi.  To use the package:

1. git clone https://github.com/rbultman/on-off-test.git
2. cd one-off-test
3. npm install
4. gpio -g mode 17 input
5. gpio -g mode 17 up
6. gpio -g mode 18 output
7. gpio export 17 input
8. gpio export 18 output
9. node on-off-test.js

_Notes:_

1. You may need to run node as root.
2. It is assumed that an LED is connected to port 18 (pin 12 on the PI header) 
of the Pi with a suitable current-limiting resistor to ground.
3. It is assumed that a push button switch is connected between port 17 (pin 
11 on the Pi header) and ground.



