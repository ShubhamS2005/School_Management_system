const mongoose = require("mongoose");

const studentScheema = new mongoose.Schema({
    schoolname: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    schoolcode: {
        type: String,
        required: true
    },
    schoolid: {
        type: String,
        required: true
    },
    class: {
        type: String,
        required: true
    },
    Roll_No: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    admission_no:{
        type: String,
        required: true
    },
    password:{
        type: String,
    },
    session_start:{
        type: String,
        requied:true
    },
    session_end:{
        type: String,
        requied:true
    },
    is_admin: {
        type: Number,
        required: true
    },
    is_teacher: {
        type: Number,
        default: 0
    },
    is_verified: {
        type: Number,
        default: 0
    },
    token:{
        type: String,
        default:''
    }
});

module.exports=mongoose.model('student',studentScheema);
