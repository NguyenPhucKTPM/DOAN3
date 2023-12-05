import pool from '../config/connectDB'

const countUser = async () => {
    const [result] = await pool.execute('SELECT COUNT(*) AS total FROM users')
    return result[0].total
}
const countOder = async () => {
    const [result] = await pool.execute('SELECT *,COUNT(idDonhang) AS total FROM donhang WHERE trangThai = 1 OR trangThai = 2')
    return result[0].total
}
const countProductSold = async () => {
    const [result] = await pool.execute('SELECT sum(ct.soLuong) as total FROM chitietdonhang ct, donhang dh  WHERE dh.idDonHang = ct.idDonHang AND (dh.trangThai = 1 OR dh.trangThai = 2)')
    return result[0].total
}
const totalSales = async () => {
    const [result] = await pool.execute('SELECT *,sum(ct.tongTien) AS total FROM donhang dh, chitietdonhang ct  WHERE dh.idDonHang = ct.idDonHang AND (dh.trangThai = 1 OR dh.trangThai = 2)')
    return result[0].total
}
const getOrderPaid = async () =>{
    const [result] = await pool.execute
    ('SELECT *,COUNT(idDonhang) AS total FROM donhang WHERE trangThai = 2')
    return result[0].total
}
const getOrderWait = async () =>{
    const [result] = await pool.execute
    ('SELECT *,COUNT(idDonhang) AS total FROM donhang WHERE trangThai = 0')
    return result[0].total
}
const getOrderCancel = async () =>{
    const [result] = await pool.execute
    ('SELECT *,COUNT(idDonhang) AS total FROM donhang WHERE trangThai = 3')
    return result[0].total
}
const getOrderConfirmed = async () =>{
    const [result] = await pool.execute
    ('SELECT *,COUNT(idDonhang) AS total FROM donhang WHERE trangThai = 1')
    return result[0].total
}
const countProductCategory = async () =>{
    const [rows] = await pool.execute
    ('SELECT sp.tenSanPham, dm.tenDanhMuc,COUNT(dm.tenDanhMuc) as total FROM sanpham sp, danhmuc dm  WHERE sp.idDanhMuc = dm.idDanhMuc GROUP BY dm.tenDanhMuc ORDER BY SUM(dm.tenDanhMuc)')
    return rows
}
const totalSalesOfDay = async () =>{
    const [rows] = await pool.execute
    ('SELECT DISTINCT dh.ngayDat,sum(ct.giaTien*ct.soLuong) as tong  FROM donhang dh, chitietdonhang ct  WHERE dh.idDonHang = ct.idDonHang AND ( dh.trangThai = 1 OR dh.trangThai = 2) GROUP BY date(dh.ngayDat) ORDER BY date(dh.ngayDat) ASC LIMIT 60')
    return rows
}
export default {
    countUser,
    countOder,
    countProductSold,
    totalSales,
    getOrderPaid,
    getOrderWait,
    getOrderCancel,
    getOrderConfirmed,
    countProductCategory,
    totalSalesOfDay
}