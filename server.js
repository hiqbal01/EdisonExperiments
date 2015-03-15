// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');
var mraa = require('mraa'); //require mraa
var request = require('request');
var LCD = require('jsupm_i2clcd');

app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 8080; // set our port

// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/hello', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });	
});

router.get('/blink', function(req, res) {
	console.log('Starting Blink Now')
    blink()
    res.json({message: "started blinking"})
});
router.get('/stopblink', function(req, res) {
	console.log('Stopping Blink Now')
    stopBlink()
    res.json({message: "stopped blinking"})
});
router.get('/buzz', function(req, res) {
	console.log('Starting Buzz Now')
    buzz()
    res.json({message: "started buzzing"})
});
router.get('/stopbuzz', function(req, res) {
	console.log('Stopping Buzz Now')
    stopBuzz()
    res.json({message: "stopped buzzing"})
});
router.get('/lcd/color/:color', function(req, res) {
    var color = req.params.color
    console.log('LCD color '+ color)
    var r = parseInt(color.split(",")[0])
    var g = parseInt(color.split(",")[1])
    var b = parseInt(color.split(",")[2])
    lcdColor(r,g,b)
    res.json({color: req.params.color})
});
router.get('/lcd/print/:message', function(req, res) {
    console.log('LCD Message '+ req.params.message)
    lcdMessage(req.params.message)
    res.json({message:req.params.message})
});
router.get('/temperature/:state/:city', function(req,res){
    var url = "http://api.wunderground.com/api"
    var api_key = “ADDYOUROWN”
    request({
        url: url + "/" + api_key + "/conditions/q/" + req.params.state + "/" + req.params.city +".json",
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            lcdMessage("Temperature: " +body.current_observation.temperature_string)
            res.json({temperature:body.current_observation.temperature_string})
        }
        else{
            res.json({error:"Something Bad Happened"})
        }
    });
})
router.get('/humidity/:state/:city', function(req,res){
    var url = "http://api.wunderground.com/api"
    var api_key = "3f651b59a29eca3c"
    request({
        url: url + "/" + api_key + "/conditions/q/" + req.params.state + "/" + req.params.city +".json",
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            lcdMessage("Humidity: " +body.current_observation.relative_humidity)
            res.json({humidity:body.current_observation.relative_humidity})
        }
        else{
            res.json({error:"Something Bad Happened"})
        }
    });
})
// REGISTER OUR ROUTES -------------------------------
app.use('/', router);
setInterval(checkTouch, 1000);
// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port)

var myOnboardLed = new mraa.Gpio(13); //LED hooked up to digital pin 13 (or built in pin on Galileo Gen2)
myOnboardLed.dir(mraa.DIR_OUT); //set the gpio direction to output
var ledState = true; //Boolean to hold the state of Led
var blinkTimeout = null;
var myLcd = new LCD.Jhd1313m1 (0, 0x3E, 0x62);
var touch = new mraa.Gpio(6);
touch.dir(mraa.DIR_IN);
function blink(){
    myOnboardLed.write(ledState?1:0)
    ledState = !ledState
    blinkTimeout = setTimeout(blink,1000)
}
function stopBlink(){
    if(blinkTimeout) clearTimeout(blinkTimeout)
    myOnboardLed.write(0)
}
function buzz(){
    var myBuzzer = new mraa.Gpio(4);
    myBuzzer.dir(mraa.DIR_OUT);
    myBuzzer.write(1)
}
function stopBuzz(){
    var myBuzzer = new mraa.Gpio(4);
    myBuzzer.dir(mraa.DIR_OUT);
    myBuzzer.write(0)
}
function lcdColor(r,g,b){
    myLcd.setColor(r,g,b);
}
function lcdMessage(message){
    // Initialize Jhd1313m1 at 0x62 (RGB_ADDRESS) and 0x3E (LCD_ADDRESS) 
    var myLcd = new LCD.Jhd1313m1 (0, 0x3E, 0x62);
    if(message.length < 16){
        myLcd.setCursor(0,0);
        myLcd.write(message);  
        myLcd.close();
    }else{
        var m1 = message.substr(0, 16)
        var m2 = message.substr(16, 32)
        myLcd.setCursor(0,0);
        myLcd.write(m1); 
        myLcd.setCursor(1,0);
        myLcd.write(m2); 
        myLcd.close();
    }
}
function checkTouch() {
    var touchVal = touch.read(); //read the digital value of the pin
    console.log(touchVal)
    if (touchVal) {
        lcdMessage("I am so touched");
    }
}
