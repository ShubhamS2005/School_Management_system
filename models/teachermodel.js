const mongoose = require("mongoose");

const teacherScheema = new mongoose.Schema({
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
    subject: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    is_admin: {
        type: Number,
        required: true
    },
    is_teacher: {
        type: Number,
        default: 1
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

module.exports=mongoose.model('teacher',teacherScheema);
