const express=require("express");
const session=require('express-session')
const config=require('../config/config')
const school_route=express();

school_route.set('view engine','pug');
school_route.set('views','./views');

const bodyparser=require('body-parser') ;
school_route.use(bodyparser.json());
school_route.use(bodyparser.urlencoded({extended:true}));
school_route.use(session({secret:config.sessionSecret}));

// Controllers Connected

const schoolController=require("../controllers/schoolcontroller");
const teacherController=require("../controllers/teachercontroller");
const studentController=require("../controllers/studentcontroller");


// Middleware Connected
const auth=require('../middleware/auth')

// School 
// get Requests
school_route.get('/signup',auth.islogout,schoolController.loadregister);
school_route.get('/verify',auth.islogout,schoolController.verifymail);
school_route.get('/forget',schoolController.loadforget); 
school_route.get('/login',auth.islogout,schoolController.loadlogin);
school_route.get('/schoolhome',auth.islogin,schoolController.loadschoolhome);
school_route.get('/logout',auth.islogin,schoolController.schoollogout);
school_route.get('/Forget-password',auth.islogout,schoolController.forgetpasswordload);


// post requests
school_route.post('/signup',schoolController.insertschool);
school_route.post('/login',schoolController.verifylogin);
school_route.post('/forget',schoolController.verifyforget);
school_route.post('/Forget-password',schoolController.resetpassword);

// School using operations related to teacher
school_route.get('/newteacher',auth.islogin,schoolController.Addteacherlogin);
school_route.get('/newteacherlist',auth.islogin,schoolController.showteachers);

school_route.post('/newteacher',schoolController.insertteacher); 

// School using operations related to students
school_route.get('/newstudent',auth.islogin,schoolController.Addstudentlogin);
school_route.get('/newstudentlist',auth.islogin,schoolController.showstudents);

school_route.post('/newstudent',schoolController.insertstudent); 

// Teacher
// get requests
school_route.get('/teacher',auth.isteacherlogin,teacherController.loadteacher);
school_route.get('/Forget-passwordteacher',auth.isteacherlogout,teacherController.forgetpasswordload);
school_route.get('/teacherforget',teacherController.loadforget);
school_route.get('/teacherlogout',auth.isteacherlogin,auth.islogin,teacherController.teacherlogout);
school_route.get('/liveclasslist',auth.isteacherlogin,teacherController.loadliveclass);



// post requests 
school_route.post('/teacherlogin',teacherController.teacherlogin);
school_route.post('/teacherforget',teacherController.verifyforget);
school_route.post('/Forget-passwordteacher',teacherController.resetpassword);


school_route.post('/addliveclass',teacherController.addclass);



// Student Usage
// get requests
school_route.get('/student',auth.isstudentlogin,studentController.loadstudenthome);
school_route.get('/Forget-passwordstudent',auth.isstudentlogout,studentController.forgetpasswordload);
school_route.get('/studentforget',studentController.loadforget);
school_route.get('/studentlogout',auth.isstudentlogin,studentController.studentlogout);

// post requests
school_route.post('/studentlogin',studentController.studentlogin);
school_route.post('/studentforget',studentController.verifyforget);
school_route.post('/Forget-passwordstudent',studentController.resetpassword);

// export
module.exports=school_route;