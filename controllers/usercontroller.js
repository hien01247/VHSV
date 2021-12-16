var banguser = require('../models/User');
module.exports.login = async function (tendn,matkhau){

    var dskh = await banguser.select({username:tendn,password:matkhau});
    if (dskh.length>0)
        return dskh[0];
    return "";
}

module.exports.find = async function (unique){
    var user = await banguser.findUser({uniqueString:unique});
    if(user){
       return user;
    }
   return null
}

module.exports.update = async function (unique){
   
    var user= await banguser.updateUser({uniqueString:unique});
    return user;
}
module.exports.updatetaikhoan=async function(name,hoten,tendn,sodt,email,diachi){
    var user= await banguser.updateTaiKhoan({username:name},hoten,tendn,sodt,email,diachi);
    return user;
}

module.exports.updatepassword= async function(name,matkhau){
    var user= await banguser.updatepassword({username:name},matkhau);
    return user;
}

module.exports.insert = async function(newUser){
    createdkh = await banguser.insert(newUser);
    return createdkh;
}