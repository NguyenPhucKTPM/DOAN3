import pool from './../config/connectDB'

const insertOrder = async (idUser, ghiChu) => {
    const [result] = await pool.execute('INSERT INTO donhang (idUser,ghiChu) VALUES (?,?)', [idUser, ghiChu]);
    const idDonHang = result.insertId;
    return idDonHang
}
const insertDetailOrder = async (idDonHang, idSanPham, giaTien, soLuong, tongTien) => {
    await pool.execute('INSERT INTO chitietdonhang (idDonHang,idSanPham,giaTien,soLuong,tongTien) VALUES (?,?,?,?,?)', [idDonHang, idSanPham, giaTien, soLuong, tongTien]);
}

export default {
    insertOrder,
    insertDetailOrder
}