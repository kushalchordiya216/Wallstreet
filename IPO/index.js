const express = require("express");
const bodyparser = require('body-parser')
const path = require('path')
require('./Database/connect')
const ipo = require('./routers/ipo')

//Only First time the server runs
//require('./Database/init')

// decalre constants
const server = express();
const PORT = process.env.PROFILE_PORT || 3001;


const publicDirectoryPath = path.join(__dirname,'DATA')
//console.log(publicDirectoryPath)
var urlencodedparser = bodyparser.urlencoded({extended:false})
server.use(urlencodedparser)
server.use(express.static(publicDirectoryPath))
// configure server
server.use(express.json())
server.use(ipo)

server.listen(PORT, () => {
  console.log(`Profile srver listening on port ${PORT} ....`);
});
