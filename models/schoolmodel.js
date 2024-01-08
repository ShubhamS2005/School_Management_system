const mongoose = require("mongoose");

const schoolScheema = new mongoose.Schema({
    schoolname: {
        type: String,
        required: true
    },
    schoolcode: {
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
    board: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    state: {
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
    is_verified: {
        type: Number,
        default: 0
    },
    token:{
        type: String,
        default:''
    }
});

module.exports=mongoose.model('School',schoolScheema);
