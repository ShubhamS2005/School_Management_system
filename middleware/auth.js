const islogin=async(req,res,next)=>{
    try {
        if(req.session.user_id){}
        else{
             res.redirect('/login')
        }
        next()
    } catch (error) {
        console.log(error.message);
    }
}

const islogout=async(req,res,next)=>{
    try {
        if(req.session.user_id){
            res.redirect('/schoolhome')
        }  
        next()
    } catch (error) {
        console.log(error.message);
    }
}

const isteacherlogout=async(req,res,next)=>{
    try {
        if(req.session.teacher_id){
            res.redirect('/teacher')
        }  
        next()
    } catch (error) {
        console.log(error.message);
    }
}
const isteacherlogin=async(req,res,next)=>{
    try {
        if(req.session.teacher_id){}
        else{
             res.redirect('/login')
        }
        next()
    } catch (error) {
        console.log(error.message);
    }
}
const isstudentlogout=async(req,res,next)=>{
    try {
        if(req.session.student_id){
            res.redirect('/teacher')
        }  
        next()
    } catch (error) {
        console.log(error.message);
    }
}
const isstudentlogin=async(req,res,next)=>{
    try {
        if(req.session.student_id){}
        else{
             res.redirect('/login')
        }
        next()
    } catch (error) {
        console.log(error.message);
    }
}
module.exports={
    islogin,
    islogout,
    isteacherlogin,
    isteacherlogout,
    isstudentlogin,
    isstudentlogout
}