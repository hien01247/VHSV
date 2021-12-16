var express = require('express');
var nodemailer = require('nodemailer');
var app =express();
app.set('view engine','ejs');
var publicDir = require('path').join(__dirname,'/public'); 
app.use(express.static(publicDir));
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
//Su dung Session
var session = require('express-session');
app.use(session({
    resave: true, 
    saveUninitialized: true, 
    secret: '1234567abc', 
    cookie: { maxAge: 60000 }}));
const { Console } = require('console');
const { render } = require('ejs');
var User=require('./controllers/usercontroller');
var FB=require('./controllers/feedbackcontroller');
const { redirect } = require('express/lib/response');

app.get('/',function(req,res){
  var taikhoan=dangnhap(req,res);
  res.render('index',{dangnhap:taikhoan});
});

app.get('/3D',function(req,res){
  var taikhoan=dangnhap(req,res);
  res.render('3D',{dangnhap:taikhoan});
});

app.get('/login',function(req,res){
  var taikhoan=dangnhap(req,res);
  res.render('login',{dangnhap:taikhoan});
});

app.get('/register',function(req,res){
  var taikhoan=dangnhap(req,res);
  res.render('register',{dangnhap:taikhoan});
});

app.get('/feedback',async(req,res)=>{
  var taikhoan=dangnhap(req,res);
  var feedback= await FB.select();
  res.render('feedback',{dangnhap:taikhoan,feedback:feedback});
});

function dangnhap(req,res){
  var taikhoan="";
   if (req.session.user!=undefined && req.session.user!=""){
      tenkh=req.session.user.username;
      taikhoan=taikhoan+ "<div class='dropdown header-right-link'>"
              +"<button class='dropbtn'>"+tenkh+"</button>"
              +"<div class='dropdown-content'>"
              +"<a href='#'>Tài khoản</a>"
              +"<a href='/loagout'>Đăng xuất</a>"
              +"</div>"
              +"</div>"
      // taikhoan=taikhoan+ "<div class='header-right-link dropdown'>"
      //                   + "<a href='#' class='dropdown-toggle s-menu' data-toggle='dropdown'>"+tenkh+"</a>"
      //                   +"<div class='dropdown-content>"
      //                         +"<a href='/taikhoan' >Tài khoản</a>"
      //                         +"<a href='/dangxuat' >Đăng xuất</a>"
      //                   +"</div>"
      //                   +"</div>"
   }else{
    taikhoan=taikhoan+ "<div class='header-right-link'>"
    +"<a class='s-menu' href='/login'>Đăng nhập</a>"
    +"</div>"
   }
   return taikhoan;
}

app.post('/login', async(req,res)=> {
  var ttdangnhap=req.body;
	tendn=ttdangnhap.name;	
	matkhau=ttdangnhap.password;
  console.log(req.body.name);
  console.log(matkhau);
  var user = await User.login(tendn,matkhau);
  if(!user){
    return res.status(401).send({ msg:'Thông tin đăng nhập sai. vui lòng kiểm tra lại thông tin đăng nhập'});
  }
  else if(user.isValid == false){
    return res.status(401).send({msg:'Email của bạn chưa được xác nhận . Vui lòng kiểm tra email của bạn'});
  }
  else{
    req.session.user=user;
    res.redirect('/');
  }
});

app.get('/logout', function(req, res) {
  req.session.user=null;
  res.redirect("/");
});

const randString = ()=>{
  const len=8;
  let randStr='';
  for(let i=0;i<len;i++){
      const ch=Math.floor((Math.random()*10)+1);
     randStr+=ch;
  }
  return randStr;
}
app.post('/register', async(req,res)=>{
	var ttdangki=req.body;
	hoten=ttdangki.name;	
	email=ttdangki.email;
	matkhau=ttdangki.password;
  tendn=ttdangki.username;
	var uniqueString= randString();
  var isValid=false;
  user= User.insert({name:hoten,email:email,uniquestring:uniqueString,isValid:isValid,password:matkhau,uname:tendn});
  sendMail(email,uniqueString);
  return res.status(200).send("<p>Một email xác nhận đã được gửi đến " + email + ". Click vào link để được xác nhận đăng kí thành công.</p>");
});



const sendMail= (email,uniqueString)=>{
      var transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          auth: {
            user: 'vhsv.demo@gmail.com',
            pass: 'vhsvdemo123'
          }
        });
       
        var mailOptions = {
          from: 'vhsv.demo@gmail.com',
          to: email,
          subject: 'Xác nhận đăng kí',
          text: 'Chào bạn!',
          html:"Nhấn <a href='http://localhost:8000/verify/"+uniqueString+"'>tại đây</a> để xác nhận email! Xin cám ơn!"
        };
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
}

app.get('/verify/:uniqueString', async(req,res)=>{
  var unique =req.params;
  const{uniqueString}=req.params;
  console.log(uniqueString);
  console.log(unique); 
     //user= User.find({uniquestring:uniqueString});
     user= User.find(uniqueString);
    if(user){
       // user= User.update({uniquestring:uniqueString});
       user= User.update(uniqueString);
        res.redirect('/')
    }else{
        res.json('User not found')
    }
})

app.post('/feedback', async(req,res)=>{
  console.log(req.session.user);
  if (req.session.user!=undefined &&req.session.user!=""){
    var fback=req.body.fback;
    var today = new Date();
    var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
    var username=req.session.user.username;
    console.log(username);
    console.log(fback);
    fb= FB.insert({username:username,date:date,fback:fback});
    res.redirect('/')
    
  }
  else{
    res.redirect('/login')
  }
	
});

 app.listen(8000);
console.log('8000 is the magic port');
