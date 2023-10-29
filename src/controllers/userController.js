import express from "express";
import userModel from "../services/userModel";
import bcrypt from "bcrypt";

const login = (req,res) =>{
    if(req.session.user) return res.redirect("/");
    return res.render('index',{data:{title:'Đăng nhập',page:'user/login',getUrl: req.url} });
}
const loginUser = async (req, res) =>{
    let { userName, password } = req.body;
    if (!userName || !password) return res.render("index",{data:{error:'Tài khoản hoặc mật khẩu không được để trống',page:'user/login',title:'Đăng nhập thất bại'} });
    let checkUserName = await userModel.checkUserName(userName)
    if(checkUserName.length < 1) return res.render("index",{data:{error:'Tài khoản không tồn tại',page:'user/login',title:'Đăng nhập thất bại'} });
    const hashedPassword = checkUserName[0].password;

    const isMatched = bcrypt.compareSync(password, hashedPassword);
    // xoa key password ko can thiet tu ket qua CSDL
    // delete checkUserName[0]["password"];
    // mat khau khong khong
    if (!isMatched) return res.render("index",{data:{error:'Mật khẩu không hợp lệ',page:'user/login',title:'Đăng nhập thất bại'} });

    const isAdmin = checkUserName[0].role
    // luu vao session dang object
    req.session.user = checkUserName[0];

    // neu lan ttruoc  co vao trang can authen thi chuyen vao trang do
    const path = req?.session?.path || "/";
    console.log('path ',path);
    // xoa path cu di
    delete req.session.path;
    if(isAdmin ==='admin'){
        // console.log('rediredtc admin');
        return res.redirect('/admin')
    }
    res.redirect(path);
}
const register = (req,res) =>{
    if(req.session.user) return res.redirect("/");
    return res.render('index',{data:{title:'Đăng kí tài khoản', page:"user/register",getUrl: req.url} }); 
}
const signup = async(req,res) =>{
    if(req.session.user) return res.redirect("/");
    let {userName,password,repassword,fullName,address,sex,email,SDT} = req.body;
    if (!userName || !password || !repassword || !address || !sex || !email || !SDT) return res.render("index",{data:{error:'Thông tin không được để trống',page:'user/register',title:'Đăng kí thất bại'} });
    let checkUserName = await userModel.checkUserName(userName)
    if(checkUserName.length  > 0) return res.render("index",{data:{error:'Tài khoản đã tồn tại',page:'user/register',title:'Đăng kí thất bại'} });
    if(password != repassword) return res.render("index",{data:{error:'Nhập lại mật khẩu không đúng',page:'user/register',title:'Đăng kí thất bại'} });
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    await userModel.signup(userName,hashedPassword,fullName,address,sex,email,SDT)
    return res.render("index",{data:{noti:'Đăng kí tài khoản thành công',page:'user/register',title:'Đăng kí thành công'} });
}
const logout = async (req, res, next) => {
    delete req.session.user;
    delete req?.session?.path;
  
    res.redirect("/");
};
const admin = (req,res) =>{
    if(!req.session.user || req.session.user.role != 'admin') return res.redirect('/')
    return res.render('admin',{data:{title:'admin'} }); 
}
const listUser = async (req, res) => {
    let userList = await userModel.getAllUser()
    res.render('admin',{data: {title:'Danh sách người dùng' , rows:userList ,page:'user/listUser',getUrl:req.url} })
}
// const listUser = (req,res) =>{
//     let trang = parseInt(req.params.trang)
//     let from = (trang - 1) * 5 + 1;
//     let to = trang * 5;
//     console.log('test',to)
//     return res.render('index',{data:{title:'Danh sách tài khoản',page:'listUser',test:from ,to:to } });

// }
const newUser =  (req,res) =>{
    return res.render('admin',{data:{title:'Tạo tài khoản',page:'user/newUser',getUrl:req.url} });
}

const insertUser = async (req, res) => {
    let {userName,password,rePassword,fullName,address,sex,email,groupID} = req.body;
    if(!userName || !password || !rePassword || !fullName || !address || !sex || !email || !groupID) return res.render('admin',{data:{title:'Thêm người dùng thất bại',page:'user/newUser',error:'Thông tin không được để trống'} }); 
    let checkUserName = await userModel.checkUserName(userName)
    if(checkUserName.length  > 0) return res.render('admin',{data:{title:'Thêm người dùng thất bại',page:'user/newUser',error:'Tài khoản đã tồn tại' } });
    if(password != rePassword) return res.render('admin',{data:{title:'Thêm người dùng thất bại',page:'user/newUser',error:'Xác nhận mật khẩu không khớp' } });
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    await userModel.insertUser(userName,hashedPassword,fullName,address,sex,email,groupID)
    return res.render('admin',{data:{title:'Thêm người dùng thành công',page:'user/newUser',noti:'Thêm người dùng thành công' } });
}
const viewDetailUser = async (req,res) =>{
    let userName = req.params.userName
    let detailUser = await userModel.detailUser(userName)
    return res.render('admin',{data:{title:'Chi tiết người dùng',page:'user/detailUser',rows:detailUser} });
}

const editUser = async (req,res) =>{
    let userName = req.params.userName
    let detailUser = await userModel.detailUser(userName)
    return res.render('admin',{data:{title:'Cập nhật người dùng',page:'user/updateUser',rows:detailUser} });
}
const updateUser = async (req,res) =>{
    let {password,fullName,address,sex,email,groupID,userName} = req.body;
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    await userModel.updateUser(hashedPassword,fullName,address,sex,email,groupID,userName)
    // console.log(hashedPassword);
    res.redirect('/list-user')
}
const detailInfoUser = async (req,res) =>{
    const userName = req.session.user.userName
    let detailUser = await userModel.getSessionUserName(userName)
    return res.render('index',{data:{title:'Chi tiết người dùng',page:'user/detailInfo',rows:detailUser} });
}
const editInfoUser = async (req, res) => {
    const userName = req.session.user.userName
    let detailUser = await userModel.getSessionUserName(userName)
    return res.render('index',{data:{title:'Cập nhật người dùng',page:'user/changeInfo',rows:detailUser} });
}
const updateInfoUser = async (req, res) => {
    let {fullName,address,sex,email,SDT} = req.body;
    const userName = req.session.user.userName
    await userModel.updateInfoUser(fullName,address,sex,email,SDT,userName)
    let detailUser = await userModel.getSessionUserName(userName)
    return res.render('index',{data:{title:'Cập nhật người dùng',page:'user/changeInfo',rows:detailUser,noti:'Cập nhật thông tin thành công'} });
}
const editPass = async (req,res) =>{
    return res.render('index',{data:{title:'Đổi mật khẩu',page:'user/changePass'} });
}
const editPassAdmin = async (req,res) =>{
    return res.render('admin',{data:{title:'Đổi mật khẩu',page:'user/changePass'} });
}
const updatePass = async (req,res) =>{
    let { curPass, password, rePassword } = req.body;
    if (!curPass || !password || !rePassword) return res.render("index",{data:{error:'Không để trống thông tin',page:'user/changePass',title:'Đổi mật khẩu thất bại'} });
    if(curPass == password) return res.render("index",{data:{error:'Mật khẩu mới không được trùng với mật khẩu hiện tại',page:'user/changePass',title:'Đổi mật khẩu thất bại'} });
    const userName = req.session.user.userName
    const pass = req.session.user.password
    const isMatched = bcrypt.compareSync(curPass, pass);
    // console.log('test: ',isMatched);
    if(isMatched){
        if(password == rePassword) {
            const saltRounds = 10;
            const salt = bcrypt.genSaltSync(saltRounds);
            const hashedPassword = bcrypt.hashSync(password, salt);
            await userModel.updatePassword(hashedPassword,userName)
            return res.render("index",{data:{noti:'Đổi mật khẩu thành công',page:'user/changePass',title:'Đổi mật khẩu thành công'} });
        }
        else return res.render("index",{data:{error:'Nhập lại mật khẩu không đúng',page:'user/changePass',title:'Đổi mật khẩu thất bại'} });
    }
    else  return res.render("index",{data:{error:'Mật khẩu hiện tại không đúng',page:'user/changePass',title:'Đổi mật khẩu thất bại'} });
}
const deleteUser = async (req, res) =>{
    let userName = req.body.userName
    await userModel.deleteUser(userName)
    res.redirect('/list-user')
    // console.log('data: ',req.body)
    // return res.send(`xoa ${req.body.userName}`)
}


  
export default {
    listUser,
    login,
    loginUser,
    register,
    signup,
    newUser,
    viewDetailUser,
    insertUser,
    editUser,
    updateUser,
    editInfoUser,
    detailInfoUser,
    updateInfoUser,
    admin,
    deleteUser,
    editPass,
    editPassAdmin,
    updatePass,
    logout
}