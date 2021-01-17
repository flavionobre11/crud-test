const mongoose = require('../../database')


const ClientSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

const Client = mongoose.model('Client', ClientSchema)
module.exports = Client;