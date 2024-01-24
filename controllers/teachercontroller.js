const School=require('../models/schoolmodel');
const Teacher=require('../models/teachermodel');
const Student=require('../models/studentmodel');
const bcrypt=require('bcrypt');
const nodemailer=require('nodemailer');
const Randomstring=require('randomstring');
const config=require('../config/config');

// Teacher Usage
const secrurepassword=async(password)=>{
    try{
        const passwordhash= await bcrypt.hash(password,10);
        return passwordhash;
    }catch(error) {
        console.log(error.message);
    }
}
// Teacher Login
const teacherlogin=async(req,res)=>{
    try {
        const email=req.body.email;
        const password=req.body.password;
        const schoolcode=req.body.schoolcode;
        const teacherdata=await Teacher.findOne({email:email});
        if(teacherdata){
            const passwordmatch=await bcrypt.compare(password,teacherdata.password);
            if(passwordmatch){
                if(schoolcode===teacherdata.schoolcode){
                    req.session.teacher_id=teacherdata._id;
                    res.redirect('/teacher')
                }
                else{
                    res.render('login.pug',{message:'email ,password or schoolcode is incorrect'});
                }
            }
            else{
                res.render('login.pug',{message:'email ,password or schoolcode is incorrect'});
            }
        }
        else{
            res.render('login.pug',{message:'email ,password or schoolcode is incorrect'});
        }
           
    } catch (error) {
        console.log(error.message);
    }
}

const loadteacher=async(req,res)=>{
    try {
        const userdata=await Teacher.findById({_id:req.session.teacher_id});
        res.render("teacherhome.pug",{teacher:userdata});
    } catch (error) {
        console.log(error.message);
    }
}

const teacherlogout=async(req,res)=>{
    try {
       req.session.destroy();
       res.redirect('/login');
    } catch (error) {
        console.log(error.message);
    }
}

module.exports={
    teacherlogin,
    loadteacher,
    teacherlogout
}