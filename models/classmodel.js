const mongoose = require("mongoose");

const classScheema = new mongoose.Schema({
    schoolname: {
        type: String,
        required: true
    },
    schoolcode: {
        type: String,
        required: true
    },
    class: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    schoolid: {
        type: String,
        required: true
    },
    teacherid: {
        type: String,
        required: true
    }
});

module.exports=mongoose.model('Class',classScheema);
