const mongoose = require('mongoose')

mongoose.Promise = global.Promise;

// connect to atlas mongodb
mongoose.connect('mongodb+srv://admin:admin@node-crud-api.e5pul.mongodb.net/crud-api?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})


module.exports = mongoose;