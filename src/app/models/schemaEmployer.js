const mongoose = require('../../database')
const bcrypt = require('bcryptjs')


const EmployerSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true,
    },
    resetPasswordToken:{
        type: String,
        select: false
    },
    resetPasswordTime:{
        type: Date,
        select: false
    },
    lastReset:{
        type: Date
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

EmployerSchema.pre('save', async function(next) {
    console.log(this)
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
})

const Employer = mongoose.model('Employer', EmployerSchema)
module.exports = Employer;