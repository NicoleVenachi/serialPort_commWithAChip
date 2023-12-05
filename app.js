// Import dependencies

const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline/dist');

require('dotenv').config()

const connectDB = require('./db/connect')

const admin = require('firebase-admin');

// db connection
const start = async () => {
  try {
    connectDB(process.env.FIREBASE_URL)

    //db connection
    console.log('Succesfully connected to the db ...');

    // getRiegoManual()
    // .then((data) => console.log(data))
    // .catch((err) => console.error('[Error]: On fetching the manual irriagation state'))

    // updateRiegoManual(true)
    //   .then((data) => console.log(data))
    //   .catch((err) => console.error('[Error]: On updating the manual irriagation state'))

    // getRiegoManual()
    //   .then((data) => console.log(data))
    //   .catch((err) => console.error('[Error]: On fetching the manual irriagation state'))


    // const database = admin.database();
    // const dataRef = database.ref('/DATA');

    // dataRef.orderByKey().on('value', (snapshot) => {
    //   let dataRes = {};
    //   let lastFilter = 1;
    //   if (lastFilter == null){
    //     dataRes = snapshot.val();
    //   }
    //   else {
    //      //json to data
    //     mH = Object.values(snapshot.val().meanHumidity)
    //     mL = Object.values(snapshot.val().meanLuxP)
    //     mT = Object.values(snapshot.val().meanTemperature)
      
    //     lastH = mH[mH.length -1]
    //     lastL = mL[mL.length -1]
    //     lastT = mT[mT.length -1]

    //     dataRes = {
    //       meanHumidity: lastH,
    //       meanLuxP: lastL,
    //       meanTemperature: lastT
    //     }
    //   console.log(dataRes);

    //   }
    // });

  } catch (err) {
    console.error('No connection established to the database');
    throw new Error(err)
  }
}

start()

// 
const {get:getRiegoManual, update:updateRiegoManual} = require('./serverRequests/riego')

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
let openauto = "0"
let openmanual = "0"

setInterval(async () => {

  // --- check on manual irrigation ---

  openauto = await getRiegoManual() === true ? '1': '0';

  openauto === '1' ? updateRiegoManual(false) : void 0; // si es true, que la vuelva a cerrar

  // openmanual = openmanual=== "1" ? "0" : "1"


  // --- writing on serial port --- 
  serialport.write(openmanual);  

  serialport.write(openauto);
}, 2000);

