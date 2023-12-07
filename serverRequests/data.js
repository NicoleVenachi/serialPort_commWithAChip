//*****Firebase */
const admin = require('firebase-admin');

//***** Router */
const database = admin.database();
const dataRef = database.ref('/DATA');


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


module.exports = {
    get
}
