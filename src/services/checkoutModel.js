import pool from '../config/connectDB'

const insertOrder = async (idUser, ghiChu, trangThai) => {
    const [result] = await pool.execute('INSERT INTO donhang (idUser,ghiChu,trangThai) VALUES (?,?,?)', [idUser, ghiChu, trangThai]);
    const idDonHang = result.insertId;
    return idDonHang
}
const insertDetailOrder = async (idDonHang, idSanPham, giaTien, soLuong, tongTien) => {
    await pool.execute('INSERT INTO chitietdonhang (idDonHang,idSanPham,giaTien,soLuong,tongTien) VALUES (?,?,?,?,?)', [idDonHang, idSanPham, giaTien, soLuong, tongTien]);
}
//neu truong hop nguoi dung dang nhap va muon doi thong tin ca nhan trong checkout
const updateInfoUser = async (fullName, address, email, SDT, idUser) => {
    await pool.execute('UPDATE users SET fullName = ?,address = ?,email = ?,SDT=? WHERE idUser = ?',
        [fullName, address, email, SDT, idUser])
}
//truong hop nguoi dung chua co tai khoan
const insertUserOder = async (fullName, address, email, SDT) => {
    const [result] = await pool.execute('INSERT INTO users (fullName,address,email,SDT) VALUES (?,?,?,?)', [fullName, address, email, SDT])
    const idUser = result.insertId;
    return idUser
}
export default {
    insertOrder,
    insertDetailOrder,
    updateInfoUser,
    insertUserOder
}