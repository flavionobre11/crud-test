const mongoose = require('../../database')


const ClientSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    surname:{
        type: String, 
        required: true
    },
    contact:{
        type: String,
        required: true,
        unique: true
    },
    address:{
        zip: Number,
        state: {
            type: String,
            uppercase: true
        },
        city: String,
        street: String,
        houseNumber: String
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employer',
        require: true
    }
})

const Client = mongoose.model('Client', ClientSchema)
module.exports = Client;