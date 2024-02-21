//*****Firebase */
const admin = require('firebase-admin');

const database = admin.database();
const dataRef = database.ref('/DATA');

const humRef = database.ref('/DATA/meanHumidity');
const luxRef = database.ref('/DATA/meanLuxP');
const temRef = database.ref('/DATA/meanTemperature');

//********* CRUD  */

//leer riego
function get(lastFilter) {

    return new Promise((resolve, reject) => {
      dataRef.orderByKey().on('value', (snapshot) => {
        let dataRes = {};
        if (lastFilter == null){
          dataRes = snapshot.val();
          resolve(dataRes)
        }
        else {
           //json to data
          mH = Object.values(snapshot.val().meanHumidity)
          mL = Object.values(snapshot.val().meanLuxP)
          mT = Object.values(snapshot.val().meanTemperature)
        
          lastH = mH[mH.length -1]
          lastL = mL[mL.length -1]
          lastT = mT[mT.length -1]

          dataRes = {
            meanHumidity: lastH,
            meanLuxP: lastL,
            meanTemperature: lastT
          }
          resolve(dataRes)
        }
        reject('Error')
      });
    })
}

async function pushNewData(humidity, meanLuxP, meanTemperature) {

  return new Promise(async (resolve, reject) => {
    // console.log('aaaaaaaaaaaa');
    try {

      // -- reading last register data ---
      // let {meanLuxP, meanTemperature} = await get(true)

      // simulate the light and temperature changes
      // let randomNumber = Number(Math.random().toFixed(2))
      // meanLuxP +=  randomNumber> 0.5 ? 3*randomNumber: -3*randomNumber;
    
      // randomNumber = Number(Math.random().toFixed(2))
      // meanTemperature +=  randomNumber> 0.5 ? 2*randomNumber: -2*randomNumber;
  
      // resolve('aaaa')
      // console.log(humidity, meanLuxP, meanTemperature);
      humRef.push(Number(humidity))
      luxRef.push(Number(meanLuxP.toFixed(1)))
      temRef.push(Number(meanTemperature.toFixed(1)))

      resolve({meanHumidity: humidity, meanLuxP, meanTemperature})
    } catch (error) {
      reject('Error')
    }
  })

}

async function restartData() { //delete false data, just the first 125 rgisters are real

  return new Promise(async (resolve, reject) => {
    try {

      // -- reading all registers data ---
      let sensorsData = await get(null);
      
      // delete
      replaceInnerRegister({...sensorsData.meanHumidity}, 'meanHumidity') //send a copy of the data to clean
      replaceInnerRegister({...sensorsData.meanLuxP}, 'meanLuxP')
      replaceInnerRegister({...sensorsData.meanTemperature}, 'meanTemperature')

      //prin number of registers
      sensorsData = await get(null);
      console.log(Object.keys(sensorsData.meanHumidity).length);
      console.log(Object.keys(sensorsData.meanLuxP).length);
      console.log(Object.keys(sensorsData.meanTemperature).length);

    } catch (error) {
      reject('Error')
    }
  })

}

//update con push de nuevos valores

module.exports = {
    get,
    pushNewData,
    restartData
}

function replaceInnerRegister (sensorData, _idName) {

   // find elements to clean (125 para arriba)
   let keysToClean = Object.keys(sensorData).filter((_id, id) => id>124);

   // delete dta for these object registers
   for (const key in sensorData) {

     if (keysToClean.includes(key)) { 
       delete sensorData[key]; 
     }

   }

   //update collection without cleanead data
   const ref = database.ref(`/DATA/${_idName}`);
   ref.set(
    sensorData
   )

}