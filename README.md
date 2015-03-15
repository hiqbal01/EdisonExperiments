# Building a RESTful API in Node and Express on the Intel Edison 

- Have services to change the color of the Grove LCD /lcd/color/r,g,b
- Have services to output a message to the LCD /lcd/print/hello
- Have a touch sensor 
- Have a a service to blink an LED /blink
- Have a service to stop blinking the LED /stopblink
- Have a service to set off a buzzer /buzz
- Have a service to stop the buzzer /stopbuzz
- Have services to get weather conditions from the underground api onto the device /temperature/state(uppercase abbrev)/city, /humidity/state/city
- Have a service to upload files /files/upload/sample.txt
	use /upload.html to upload files to device
- Have a service to view uploaded files to device in the files folder /files
- Have a service to download file from the device /files/view/sample.txt
- Have a service to delete files on the device in the files folder /files/delete/sample.txt
- Have a service to text numbers /text/+18888888888
- Have a service to email people /email/blah@gmail.com


## Requirements

- Node and npm
- Intel Edison
- Seed Studio Grove sensors and actuators

###Modules used

- mraa
- upm
- express
- twilio
- busboy-connect
- nodemailer
- request
- morgan
- body-parser


