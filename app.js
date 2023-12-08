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

    // -- reading last register (or all registers) data (125 reales)---
    const {get:getData} = require('./serverRequests/data')
    let sensorsData = await getData(null);

    const database = admin.database();
    // console.log(sensorsData.meanTemperature['-Nl6Qgp-YDr1iZtRtH7z']);
    

    let temRef = database.ref(`/DATA/a`);
    temRef.set({
      "e":5
    })

    // find elements to clean (125 para arriba)
    let humidityData = {...sensorsData.meanHumidity};
    let keysToClean = Object.keys(humidityData).filter((_id, id) => id>124);


    // delete dta for these object registers
    for (const [key,value] of Object.entries(humidityData)) {

      if (keysToClean.includes(key)) {
        delete humidityData[key];
      }

    }

    const ref = database.ref(`/DATA/meanHumidity`);
    ref.set(
      humidityData
    )


    console.log(Object.keys(sensorsData.meanHumidity).length);
    console.log(Object.keys(sensorsData.meanLuxP).length);
    console.log(Object.keys(sensorsData.meanTemperature).length);

  } catch (err) {
    console.error('No connection established to the database');
    throw new Error(err)
  }
}

start()

// // imports
// const {get:getRiegoManual, update:updateRiegoManual} = require('./serverRequests/riego')
// const {get:getRiegoAuto} = require('./serverRequests/riegoAuto')

// const {get:getData, pushNewData} = require('./serverRequests/data')


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

// parser.on("data", async (line) => {
//   let humidity = Number(line)
//   console.log(humidity) // readed humidity

//   endTime = performance.now()
//   // console.log(endTime-startTime);

//   if ((endTime - startTime) > 20000 ) {
//     startTime = performance.now();

//     let newData = await pushNewData(humidity);

//     // console.log('uploading....');
//     console.log('uploading.... \t', newData);

//   }
  
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

//   // let sensorsData = await getData(null);
//   // console.log(sensorsData);

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

