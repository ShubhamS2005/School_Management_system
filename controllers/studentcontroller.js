const Teacher=require('../models/teachermodel');
const User=require('../models/schoolmodel');
const Student=require('../models/studentmodel');
const bcrypt=require('bcrypt');
const nodemailer=require('nodemailer');
const Randomstring=require('randomstring');
const config=require('../config/config');

const secrurepassword=async(password)=>{
    try{
        const passwordhash= await bcrypt.hash(password,10);
        return passwordhash;
    }catch(error) {
        console.log(error.message);
    }
}
const sendmail=async(schoolname,email,schoolcode,password,name)=>{
    try {
        const transpoter=nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:465,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.passwordUser
            }
        });
        const mailoptions={
            from:config.emailUser,
            to:email,
            subject:'Student Account Created On GyanMandir Platform',
            html:'<p>Hii,'+name+',this email is send to inform you that your school ,'+schoolname+', with ,'+schoolcode+', has made an account of your as a Student with password ,'+password+', it is advised to change your password as soon as possible and Thank You for using our Services</p>'
        }
        transpoter.sendMail(mailoptions,function(error,info){
            if(error){
                console.log(error);
            }
            else{
                console.log("Email has been sent:- ",info.response);
            }
        })
    } catch (error) {
        console.log(error.message);
    }
}
// student Login
const studentlogin=async(req,res)=>{
    try {
        const email=req.body.email;
        const password=req.body.password;
        const schoolcode=req.body.schoolcode;
        const studentdata=await Student.findOne({email:email});
        if(studentdata){
            const passwordmatch=await bcrypt.compare(password,studentdata.password);
            if(passwordmatch){
                if(schoolcode===studentdata.schoolcode){
                    req.session.student_id=studentdata._id;
                    res.redirect('/student')
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
//student home

const loadstudenthome=async(req,res)=>{
    try {
        const studentdata=await Student.findById({_id:req.session.student_id});
        res.render("student.pug",{student:studentdata});
    } catch (error) {
        console.log(error.message);
    }
}
// forget password Teacher
const loadforget=async(req,res)=>{
    try {
       res.render("forget.pug");
    } catch (error) {
        console.log(error.message);
    }
}
// reset password
const sendresetpasswordmail=async(schoolcode,email,token,name)=>{
    try {
        const transpoter=nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:465,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.passwordUser
            }
        });
        const mailoptions={
            from:config.emailUser,
            to:email,
            subject:'For Reset of password in GyanMandir',
            html:'<p>Hii '+name+' of schoolcode,'+schoolcode+',this email is send to reset your password,please click here to <a href="http://127.0.0.1:8000/Forget-passwordstudent?token='+token+'">Reset</a> your password.</p>'
        }
        transpoter.sendMail(mailoptions,function(error,info){
            if(error){
                console.log(error);
            }
            else{
                console.log("Email has been sent:- ",info.response);
            }
        })
    } catch (error) {
        console.log(error.message);
    }
}
const verifyforget=async(req,res)=>{
    try {
        const email=req.body.email;
        const schoolcode=req.body.schoolcode;
        const userData=await Student.findOne({schoolcode:schoolcode});
        
        if(userData){ 
            if(userData.email===email){
                if(userData.is_verified===0){
                    res.render('forget.pug',{message:'Your email is not verified please verify it'});
                }
                else{
                    const randomstring= Randomstring.generate();
                    const updateData=await Student.updateOne({email:email},{$set:{token:randomstring}});
                    sendresetpasswordmail(userData.schoolcode,userData.email,randomstring,userData.name);
                    res.render('forget.pug',{message:'please check your mail to reset your password'});
                }
                                      
            }
            else{
                res.render('forget.pug',{message:'Your email or schoolcode is incorrect'});
            }         
        }
        else{
            res.render('forget.pug',{message:'Your email or schoolcode is incorrect'});
        }
    }
    catch (error) {
        console.log(error.message);
    }
}
const forgetpasswordload=async(req,res)=>{
    try {
       const token=req.query.token;
       const tokendata=await Student.findOne({token:token});
       if(tokendata){
        res.render('Forget-password',{user_id:tokendata._id});
       }
       else{
            res.render('404',{message:'Token Is Inavalid'})
       } 
    } catch (error) {
        console.log(error.message);
    }

}
const resetpassword=async(req,res)=>{
    try {
        const password=req.body.password;
        const user_id=req.body.user_id;
        const secrure_password=await secrurepassword(password);
        const updatedata= await Student.findByIdAndUpdate({_id:user_id},{$set:{password:secrure_password,token:''}})
        res.redirect("/login");
    } catch (error) {
        console.log(error.message);
    }
}
const studentlogout=async(req,res)=>{
    try {
       req.session.destroy();
       res.redirect('/login');
    } catch (error) {
        console.log(error.message);
    }
}
module.exports={
    loadstudenthome,
    studentlogin,
    loadforget,
    verifyforget,
    resetpassword,
    forgetpasswordload,
    studentlogout
} 