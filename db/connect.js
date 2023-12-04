
const admin = require('firebase-admin');

var serviceAccount = require("../serviceAccountKey");

const connectDB = (url) => {
  // console.log(url);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: url
  });
  
}

module.exports = connectDB