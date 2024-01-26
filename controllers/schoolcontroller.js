const School=require('../models/schoolmodel');
const Teacher=require('../models/teachermodel');
const Student=require('../models/studentmodel');
const bcrypt=require('bcrypt');
const nodemailer=require('nodemailer');
const Randomstring=require('randomstring');
const config=require('../config/config');

//register
const loadregister=async(req,res)=>{
    try {
       res.render("signup.pug");
    } catch (error) {
        console.log(error.message);
    }
 
}
const secrurepassword=async(password)=>{
    try{
        const passwordhash= await bcrypt.hash(password,10);
        return passwordhash;
    }catch(error) {
        console.log(error.message);
    }
}

// Staff Usage
// for send mail
const sendverifymail=async(schoolname,email,user_id)=>{
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
            subject:'For Verification of GyanMandir',
            html:'<p>Hii,'+schoolname+', this mail is send to remind your school to confirm your email,please click here to <a href="http://127.0.0.1:8000/verify?id='+user_id+'">verify</a> your email id.</p>'
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
// insert school
const insertschool=async(req,res)=>{
    try {
        const spassword=await secrurepassword(req.body.password)
        const school=new School({
            schoolname:req.body.schoolname,
            email:req.body.email,
            phone:req.body.phone,
            schoolcode:req.body.schoolcode,
            board:req.body.board,
            country:req.body.country,
            state:req.body.state,
            password:spassword,
            is_admin:0
        })
        const schooldata= await school.save();

        if(schooldata){
            sendverifymail(req.body.schoolname,req.body.email,schooldata._id);
            res.render('signup.pug',{message:'Your form is submited please verify your email'});
        }
        else{
            res.render('signup.pug',{message:'Your form is not submited '});
        }
    } catch (error) {
        console.log(error.message);
    }
}
const verifymail=async(req,res)=>{
    try {
        const updateinfo=await School.updateOne({_id:req.query.id},{$set:{is_verified:1}});
        console.log(updateinfo);
        res.render("email-verified.pug");
    } catch (error) {
        console.log(error.message);
    }
}

// for login user
const loadlogin=async(req,res)=>{
    try {
       res.render("login.pug");
    } catch (error) {
        console.log(error.message);
    }
}
const verifylogin=async(req,res)=>{
    try {
        const email=req.body.email;
        const password=req.body.password;
        const schoolcode=req.body.schoolcode;
        const userData=await School.findOne({schoolcode:schoolcode});
        
        if(userData){ 
            if(userData.email===email){          
                const passwordmatch=await bcrypt.compare(password,userData.password);
                if(passwordmatch){
                    if(userData.is_verified===0){
                        res.render('login.pug',{message:'Your email is not verified'});
                    }
                    else{
                        req.session.user_id=userData._id;
                        res.redirect('/schoolhome');
                    }
                }
                else{
                    res.render('login.pug',{message:'Your email,schoolcode or password is incorect'});
                }  
            }
            else{
                res.render('login.pug',{message:'Your email,schoolcode or password is incorrect'});
            }         
        }
        else{
            res.render('login.pug',{message:'Your email,schoolcode or password is incorrect'});
        }
    }
    catch (error) {
        console.log(error.message);
    }
}
//user home
const loadschoolhome=async(req,res)=>{
    try {
        const userdata=await School.findById({_id:req.session.user_id});
        res.render("schoolhome.pug",{school:userdata});
    } catch (error) {
        console.log(error.message);
    }
}
const schoollogout=async(req,res)=>{
    try {
       req.session.destroy();
       res.redirect('/login');
    } catch (error) {
        console.log(error.message);
    }
}

// reset password
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
            html:'<p>Hii user of schoolcode,'+schoolcode+',this email is send to reset your password,please click here to <a href="http://127.0.0.1:8000/Forget-password?token='+token+'">Reset</a> your password.</p>'
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
// forget password 
const loadforget=async(req,res)=>{
    try {
       res.render("forget.pug");
    } catch (error) {
        console.log(error.message);
    }
}
const verifyforget=async(req,res)=>{
    try {
        const email=req.body.email;
        const schoolcode=req.body.schoolcode;
        const schoolData=await School.findOne({schoolcode:schoolcode});
        
        if(schoolData){ 
            if(schoolData.email===email){
                if(schoolData.is_verified===0){
                    res.render('forget.pug',{message:'Your email is not verified please verify it'});
                }
                else{
                    const randomstring= Randomstring.generate();
                    const updateData=await School.updateOne({email:email},{$set:{token:randomstring}});
                    sendresetpasswordmail(schoolData.schoolcode,schoolData.email,randomstring);
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
       const tokendata=await School.findOne({token:token});
       if(tokendata){
        res.render('Forget-password.pug',{user_id:tokendata._id});
       }
       else{
            res.render('404.pug',{message:'Token Is Inavalid'})
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
        const updatedata= await School.findByIdAndUpdate({_id:user_id},{$set:{password:secrure_password,token:''}})
        res.redirect("/login");
    } catch (error) {
        console.log(error.message);
    }
}


// Staff Handling different operations
// Add Teacher 
const Addteacherlogin=async(req,res)=>{
    try {
        const id=req.query.id;
        const userdata = await School.findById({_id:id});     
        if(userdata){
            res.render('addteacher.pug',{school:userdata});
        }
        else{
            res.redirect('/userhome');
        }
    } catch (error) {
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
            subject:'Teacher Id created on GyanMandir Platform',
            html:'<p>Hii,'+name+',this email is send to inform you that your school ,'+schoolname+', with ,'+schoolcode+', has made an account of you as a teacher with password ,'+password+', it is advised to change your password as soon as possible and thanks for using our platform</p>'
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
// Insert Teachers
const insertteacher=async(req,res)=>{
    try {
        const id=req.query.id;
        const userdata = await School.findById({_id:id});
        const spassword=await secrurepassword(req.body.password)
        const teacher=new Teacher({
            name:req.body.name,
            schoolname:userdata.schoolname,
            email:req.body.email,
            phone:req.body.phone,
            schoolcode:userdata.schoolcode,
            password:spassword,
            schoolid:userdata._id,
            subject:req.body.subject, 
            session_start:req.body.start,
            session_end:req.body.end,
            is_admin:0,
            is_verified:1
        })
        const teacherdata= await teacher.save();
        sendmail(req.body.schoolname,req.body.email,req.body.schoolcode,req.body.password,req.body.name);
        res.redirect('/schoolhome');
    } catch (error) {
        console.log(error)
    }
}
// show teachers
const showteachers=async(req,res)=>{
    try {
        const schoolid=req.query.id;
        const teacherdata = await Teacher.find({schoolid:schoolid})     
        if(teacherdata){
            res.render('teacherlist.pug',{teacher:teacherdata,word:'Teacher'});
        }
        else{
            res.redirect('/userhome');
        }
    } catch (error) {
        console.log(error.message);
    }
}

// Staff Handling different operations on Student
// Add Teacher 
const Addstudentlogin=async(req,res)=>{
    try {
        const id=req.query.id;
        const userdata = await School.findById({_id:id});     
        if(userdata){
            res.render('addstudent.pug',{school:userdata});
        }
        else{
            res.redirect('/userhome');
        }
    } catch (error) {
        console.log(error.message);
    }

}
const sendmailstudent=async(schoolname,email,schoolcode,password,name)=>{
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
            html:'<p>Hii,'+name+',this email is send to inform you that your school ,'+schoolname+', with ,'+schoolcode+', has made an account of you as a Student with password ,'+password+', it is advised to change your password as soon as possible and Thank You for using our Services</p>'
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
const insertstudent=async(req,res)=>{
    try {
        const id=req.query.id;
        const userdata = await School.findById({_id:id});
        const password=req.body.admission_no;
        const spassword=await secrurepassword(password);
        const student=new Student({
            name:req.body.name,
            schoolname:userdata.schoolname,
            email:req.body.email,
            phone:req.body.phone,
            class:req.body.class,
            schoolcode:userdata.schoolcode,
            password:spassword,
            schoolid:userdata._id,
            section:req.body.section,
            admission_no:req.body.admission_no,
            session_start:req.body.start,
            session_end:req.body.end,
            Roll_No:req.body.roll_no,
            is_admin:0,
            is_verified:1
        })
        const studentdata= await student.save();
        sendmailstudent(req.body.schoolname,req.body.email,req.body.schoolcode,req.body.admission_no,req.body.name);
        res.redirect('/schoolhome');
    } catch (error) {
        console.log(error)
    }
}
// show Students
const showstudents=async(req,res)=>{
    try {
        const schoolid=req.query.id;
        const studentdata = await Student.find({schoolid:schoolid})     
        if(studentdata){
            res.render('studentlist.pug',{student:studentdata,word:'Student'});
        }
        else{
            res.redirect('/schoolhome');
        }
    } catch (error) {
        console.log(error.message);
    }

}
module.exports={
    loadregister,
    insertschool,
    verifymail,
    loadforget,
    verifyforget,
    forgetpasswordload,
    resetpassword,
    loadlogin,
    verifylogin,
    loadschoolhome,
    schoollogout,
    Addteacherlogin,
    insertteacher,
    showteachers,
    showstudents,
    Addstudentlogin,
    insertstudent
}