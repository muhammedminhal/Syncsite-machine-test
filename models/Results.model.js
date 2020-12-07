const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true, 
      },
    registerNo:{
        type: Number,
        required: true,
        trim: true,
    },
    Subject1:{
        type:String,
        required:true
    },
    Subject2:{
        type:String,
        required:true
    },
    Subject3:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('Result',studentSchema)