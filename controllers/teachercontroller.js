const School=require('../models/schoolmodel');
const Teacher=require('../models/teachermodel');
const Student=require('../models/studentmodel');
const Class=require('../models/classmodel');
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
// forget password Teacher
const loadforget=async(req,res)=>{
    try {
       res.render("forget.pug");
    } catch (error) {
        console.log(error.message);
    }
}
const sendresetpasswordmail=async(schoolcode,email,token)=>{
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
            html:'<p>Hii Teacher of schoolcode,'+schoolcode+',this email is send to reset your password,please click here to <a href="http://127.0.0.1:8000/Forget-passwordteacher?token='+token+'">Reset</a> your password.</p>'
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
        const userData=await Teacher.findOne({schoolcode:schoolcode});
        
        if(userData){ 
            if(userData.email===email){
                if(userData.is_verified===0){
                    res.render('forget.pug',{message:'Your email is not verified please verify it'});
                }
                else{
                    const randomstring= Randomstring.generate();
                    const updateData=await Teacher.updateOne({email:email},{$set:{token:randomstring}});
                    sendresetpasswordmail(userData.schoolcode,userData.email,randomstring);
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
       const tokendata=await Teacher.findOne({token:token});
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
        const updatedata= await Teacher.findByIdAndUpdate({_id:user_id},{$set:{password:secrure_password,token:''}})
        res.redirect("/login");
    } catch (error) {
        console.log(error.message);
    }
}
// Dashboard
const loadliveclass=async(req,res)=>{
    try {
        const userdata=await Teacher.findById({_id:req.session.teacher_id});
        const classes= await Class.find({teacherid:userdata._id});
        res.render("liveclasslist.pug",{teacher:userdata,classes:classes});
     } catch (error) {
         console.log(error.message);
     }
}
const addclass=async(req,res)=>{
    try {
        const Classname=new Class({
            schoolcode:req.body.schoolcode,
            schoolname:req.body.schoolname,
            class:req.body.class,
            schoolid:req.body.schoolid,
            section:req.body.section,
            teacherid:req.body.teacherid,
            subject:req.body.subject
        })
        const classdata= await Classname.save();
        res.redirect('/liveclasslist');
    } catch (error) {
        console.log(error)
    }
}
const loadclass=async(req,res)=>{
    try {
        const userdata=await Teacher.findById({_id:req.session.teacher_id});
        res.render("liveclass.pug",{teacher:userdata});
     } catch (error) {
         console.log(error.message);
     }
}

module.exports={
    teacherlogin,
    loadteacher,
    teacherlogout,
    loadforget,
    verifyforget,
    forgetpasswordload,
    resetpassword,
    loadliveclass,
    addclass,
    loadclass
}