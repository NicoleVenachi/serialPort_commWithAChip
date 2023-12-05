//*****Firebase */
const admin = require('firebase-admin');

const database = admin.database();
const riegoRef = database.ref('/RIEGO');


//********* CRUD  */

//leer riego
function get() {

  return new Promise((resolve, reject) => {
      riegoRef.once('value', (data)=>{
          readedData = data._delegate._node.value_;
          resolve(readedData)
          reject('Error')
    })
  })
}

function update(newData) {

  return new Promise((resolve, reject) => {
      riegoRef.transaction((currentData) =>{
        resolve(newData)
        reject('Error')
        return newData
      })
  })

}

module.exports = {
    get,
    update,
}
