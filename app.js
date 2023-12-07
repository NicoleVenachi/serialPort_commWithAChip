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

    const {get:getData} = require('./serverRequests/data')
    let sensorsData = await getData(null);
    console.log(Object.keys(sensorsData.meanHumidity).length);
    console.log(Object.keys(sensorsData.meanLuxP).length);
    console.log(Object.keys(sensorsData.meanTemperature).length);

    // const database = admin.database();
    // const dataRef = database.ref('/DATA/meanHumidity');
    // const humRef = admin.firestore().collection('DATA').doc('meanHumidity')

    // console.log(dataRef);
    // dataRef.push({
    //   author: 'gracehop',
    //   title: 'Announcing COBOL, a New Programming Language'
    // })
    // console.log();

    // dataRef.push(100)

  } catch (err) {
    console.error('No connection established to the database');
    throw new Error(err)
  }
}

start()

// imports
const {get:getRiegoManual, update:updateRiegoManual} = require('./serverRequests/riego')
const {get:getRiegoAuto} = require('./serverRequests/riegoAuto')

const {get:getData, pushNewData} = require('./serverRequests/data')

pushNewData(100)
  .then(a => console.log(a))
  .catch(err => console.error(err))
// // Defining the serial port
// const serialport = new SerialPort({ 
//   path: 'COM6', 
//   baudRate: 9600 }
// );
// // serialport.write('WELCOME')

// // Add The Serial port parser
// const parser = new ReadlineParser();
// serialport.pipe(parser);

// // Read the data from the serial port 

// let startTime = performance.now()
// let endTime;

// parser.on("data", (line) => {
//   // console.log(line)

//   endTime = performance.now()
//   // console.log(endTime-startTime);

//   if ((endTime - startTime) > 20000 ) {
//     startTime = performance.now();
//     console.log('uploading....');
//   }
  

//   // const {get:getData} = require('./serverRequests/data')
//   // let sensorsData = await getData(null);
//   // serialport.write("0");
// });


// // Write the data to the serial port (to open or close the grifo)
// let openauto = "0"
// let openmanual = "0"

// setInterval(async () => {

//   // --- check on manual irrigation ---

//   let openmanualNew = await getRiegoManual() === true ? '1': '0';

//   openmanualNew === '1' ? updateRiegoManual(false) : void 0; // si es true, que la vuelva a cerrar

//   // openmanual = openmanual=== "1" ? "0" : "1"

//   // --- check on automated  irrigation ---

//   let openautoNew = await getRiegoAuto() === true ? '1': '0';

//   // -- reading last register data ---

//   let sensorsData = await getData(null);
//   console.log(sensorsData);

//   // --- writing on serial port --- 

//   // just write on serial port when the value changes on the DB, avoiding 'delays' issues on Arduino due to sending to much data
//   if ((openauto != openautoNew) || (openmanual != openmanualNew)) {
//     // console.log('changes');

//     //updating, then writing new values

//     openmanual = openmanualNew;
//     openauto = openautoNew;

//     serialport.write(openmanual);
//     serialport.write(openauto);
//   }

  
  
// }, 2000);

