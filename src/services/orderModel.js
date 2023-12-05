import pool from '../config/connectDB'

const getOrderPaid = async () =>{
    const [rows] = await pool.execute
    ('SELECT * FROM donhang dh, users u WHERE dh.idUser = u.idUser AND dh.trangThai = 2 ORDER BY idDonHang DESC')
    return rows
}
const getOrderWait = async () =>{
    const [rows] = await pool.execute
    ('SELECT * FROM donhang dh, users u WHERE dh.idUser = u.idUser AND dh.trangThai = 0 ORDER BY idDonHang DESC')
    return rows
}
const getOrderCancel = async () =>{
    const [rows] = await pool.execute
    ('SELECT * FROM donhang dh, users u WHERE dh.idUser = u.idUser AND dh.trangThai = 3 ORDER BY idDonHang DESC')
    return rows
}
const getOrderConfirmed = async () =>{
    const [rows] = await pool.execute
    ('SELECT * FROM donhang dh, users u WHERE dh.idUser = u.idUser AND dh.trangThai = 1 ORDER BY idDonHang DESC')
    return rows
}
const confirmOrder = async(trangThai,idDonHang) =>{
    await pool.execute('UPDATE donhang SET trangThai = ? WHERE idDonHang = ?',[trangThai,idDonHang]);
}
export default {
  getOrderPaid,
  getOrderWait,
  getOrderCancel,
  getOrderConfirmed,
  confirmOrder,
}