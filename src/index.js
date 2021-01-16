const express = require('express')
const bodyParser = require('body-parser')

const app = express()

// setting body-parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// passando app como parametro para os controllers
require('./app/controllers/auth')(app);
require('./app/controllers/tokenController')(app);


// run api 🔥🔥🔥🔥🔥

app.listen(3001, () =>{
    console.log("🔥 Server listen on port 3001 🔥")
})