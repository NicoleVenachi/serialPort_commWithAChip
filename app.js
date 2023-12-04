// Import dependencies

const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline/dist');

// Defining the serial port
const serialport = new SerialPort({ 
  path: 'COM6', 
  baudRate: 9600 }
);
// serialport.write('WELCOME')

// Add The Serial port parser
const parser = new ReadlineParser();
serialport.pipe(parser);

// Read the data from the serial port 

parser.on("data", (line) => {
  console.log(line)
  // serialport.write("0");
});


// Write the data to the serial port (to open or close the grifo)
let open = "1"
setInterval(() => {

  // console.log('asd');
  open = open=== "1" ? "0" : "1"
  // console.log(open);
  serialport.write(open);  
}, 2000);

