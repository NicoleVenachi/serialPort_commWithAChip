//*****Firebase */
const admin = require('firebase-admin');

const database = admin.database();
const riegoRef = database.ref('/RIEGOAUTO');


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


module.exports = {
    get
    //getMsgParticular
    //update
    //delte
}
