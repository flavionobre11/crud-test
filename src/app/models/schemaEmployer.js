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
        select: false
    },
    resetPasswordToken:{
        type: String,
        select: false
    },
    resetPasswordTime:{
        type: Date,
        select: false
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

EmployerSchema.pre('save', async function(next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
})

const Employer = mongoose.model('Employer', EmployerSchema)
module.exports = Employer;