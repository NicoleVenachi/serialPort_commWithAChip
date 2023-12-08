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

async function pushNewData(humidity) {

  return new Promise(async (resolve, reject) => {
    try {

      // -- reading last register data ---
      let {meanLuxP, meanTemperature} = await get(true)

      // simulate the light and temperature changes
      let randomNumber = Number(Math.random().toFixed(2))
      meanLuxP +=  randomNumber> 0.5 ? 3*randomNumber: -3*randomNumber;
    
      randomNumber = Number(Math.random().toFixed(2))
      meanTemperature +=  randomNumber> 0.5 ? 2*randomNumber: -2*randomNumber;
      
      humRef.push(humidity)
      luxRef.push(Number(meanLuxP.toFixed(5)))
      temRef.push(Number(meanTemperature.toFixed(5)))

      resolve({meanHumidity: humidity, meanLuxP, meanTemperature})
    } catch (error) {
      reject('Error')
    }
  })

}

//update con push de nuevos valores

module.exports = {
    get,
    pushNewData
}
