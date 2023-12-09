import pool from './../config/connectDB'

const getAllUser = async () => {
    const [rows, fields] = await pool.execute
    ('SELECT * FROM users,groups WHERE users.groupID = groups.id')
    return rows
}
const detailUser = async (userName) =>{
    const [rows] = await pool.execute
    ('SELECT * FROM users,groups WHERE users.groupID = groups.id AND userName=?',[userName])
    return rows[0]
}
const getMyInfo = async(userName) =>{
    const [rows] = await pool.execute
    ('SELECT fullName,address,sex,email FROM users WHERE userName=?',[userName])
    return rows[0]
}
const insertUser = async(userName,password,fullName,address,sex,email,groupID) =>{
    await pool.execute('INSERT INTO users(userName,password,fullName,address,sex,email,groupID) VALUES (?,?,?,?,?,?,?)'
    ,[userName,password,fullName,address,sex,email,groupID]);
}
const signup = async(userName,password,fullName,address,sex,email,SDT) =>{
    await pool.execute('INSERT INTO users(userName,password,fullName,address,sex,email,SDT) VALUES (?,?,?,?,?,?,?)'
    ,[userName,password,fullName,address,sex,email,SDT]);
}
const updateUser = async(password,fullName,address,sex,email,groupID,userName) =>{
    await pool.execute('UPDATE users SET password = ? ,fullName = ?,address = ?,sex = ?,email = ?,groupID =  ? WHERE userName = ?',
    [password,fullName,address,sex,email,groupID,userName])
}
const deleteUser = async(userName) =>{
    await pool.execute('DELETE FROM users WHERE userName = ?',[userName])
}
const checkUserName = async(userName) =>{
    const [rows] = await pool.execute('SELECT * FROM users,groups WHERE users.groupID = groups.id AND userName = ?',[userName])
    return rows
}
const checkNumberPhoneUser = async(SDT)=>{
    const [rows] = await pool.execute('SELECT * FROM users,groups WHERE users.groupID = groups.id AND SDT = ?',[SDT])
    return rows
}
const getSessionUserName = async (userName) =>{
    const [rows] = await pool.execute
    ('SELECT * FROM users,groups WHERE users.groupID = groups.id AND userName=?',[userName])
    return rows[0]
}
const updateInfoUser = async(fullName,address,sex,email,SDT,userName) =>{
    await pool.execute('UPDATE users SET fullName = ?,address = ?,sex = ?,email = ?,SDT=? WHERE userName = ?',
    [fullName,address,sex,email,SDT,userName])
}
const updatePassword = async(password,userName) =>{
    await pool.execute('UPDATE users SET password = ? WHERE userName = ?',
    [password,userName])
}
export default {
    getAllUser,
    detailUser,
    getMyInfo,
    getSessionUserName,
    updateInfoUser,
    insertUser,
    signup,
    updateUser,
    deleteUser,
    updatePassword,
    checkUserName,
    checkNumberPhoneUser
}