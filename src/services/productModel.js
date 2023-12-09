import pool from './../config/connectDB'

//admin
const getAllProduct = async () => {
    const [rows] = await pool.execute
    ('SELECT * FROM sanpham,danhmuc WHERE sanpham.idDanhMuc = danhmuc.idDanhMuc ORDER BY idSanPham DESC')
    return rows
}
const detailProduct = async (idSanPham) => {
    const [rows] = await pool.execute
    ('SELECT * FROM sanpham,danhmuc WHERE sanpham.idDanhMuc = danhmuc.idDanhMuc AND sanpham.idSanPham = ?',[idSanPham])
    return rows[0]
}
const detailProduct1 = async (idSanPham) => {
    const [rows] = await pool.execute
    ('SELECT * FROM sanpham,danhmuc WHERE sanpham.idDanhMuc = danhmuc.idDanhMuc AND sanpham.idSanPham = ?',[idSanPham])
    return rows
}
const insertProduct = async (tenSanPham,idDanhMuc,gia,khuyenMai,hinhAnh,noiBat,moTa,fileName,thongSoKyThuat) => {
    const[result] = await pool.execute('INSERT INTO sanpham (tenSanPham,idDanhMuc,gia,khuyenMai,hinhAnh,noiBat,moTa,fileName,thongSoKyThuat) VALUES (?,?,?,?,?,?,?,?,?)'
    ,[tenSanPham,idDanhMuc,gia,khuyenMai,hinhAnh,noiBat,moTa,fileName,thongSoKyThuat]);
    const idSanPham = result.insertId;
    // console.log('idSanPham',idSanPham);
    return idSanPham
}
const insertImagesProduct = async (idSanPham,tenHinh,hinhAnhPhu) =>{
 await pool.execute('INSERT INTO hinhsanpham (idSanpham,tenHinh,hinhAnhPhu)  VALUES (?,?,?)',[idSanPham,tenHinh,hinhAnhPhu])
}
const updateProduct = async (tenSanPham,idDanhMuc,gia,khuyenMai,hinhAnh,noiBat,moTa,fileName,thongSoKyThuat,idSanPham) => {
    await pool.execute('UPDATE sanpham SET tenSanPham = ?,idDanhMuc = ?,gia = ?,khuyenMai = ?,hinhAnh = ?,noiBat = ?,moTa = ?,fileName = ?,thongSoKyThuat=? WHERE idSanPham = ?'
    ,[tenSanPham,idDanhMuc,gia,khuyenMai,hinhAnh,noiBat,moTa,fileName,thongSoKyThuat,idSanPham]);
}
const deleteProduct = async (idSanPham) => {
    await pool.execute('DELETE FROM hinhsanpham WHERE idSanPham = ?',[idSanPham]); 
    await pool.execute('DELETE FROM sanpham WHERE idSanPham = ?',[idSanPham]); 
}
const getDetailImagesProduct = async (idSanPham) =>{
   const [rows] = await pool.execute('SELECT * FROM hinhsanpham WHERE idSanPham = ? ORDER BY idHinhAnhPhu DESC',[idSanPham])
   return rows
}
const deleteImagesProduct = async (idHinhAnhPhu) => {
    await pool.execute('DELETE FROM hinhsanpham WHERE idHinhAnhPhu = ?',[idHinhAnhPhu]); 
}
const getIdDetailImagesProduct = async(idHinhAnhPhu) =>{
    const [rows] = await pool.execute('SELECT * FROM hinhsanpham WHERE idHinhAnhPhu = ?',[idHinhAnhPhu]); 
    return rows
}
//user

const viewProduct = async (idDanhMuc,from,to) =>{
    const [rows] = await pool.execute
    ('SELECT * FROM sanpham sp, danhmuc dm WHERE sp.idDanhMuc = dm.idDanhMuc AND sp.idDanhMuc = ? order by sp.idSanPham DESC LIMIT ?, ?',[idDanhMuc,from,to])
    return rows
}
const countProduct = async (idDanhMuc) =>{
    const[result] = await pool.execute('SELECT COUNT(*) AS total FROM sanpham sp, danhmuc dm WHERE sp.idDanhMuc = dm.idDanhMuc AND dm.idDanhMuc = ?',[idDanhMuc])
    return result[0].total
}
const viewProductSortNoiBat = async (idDanhMuc,from,to) =>{
    const [rows] = await pool.execute
    ('SELECT * FROM sanpham sp, danhmuc dm WHERE sp.idDanhMuc = dm.idDanhMuc AND sp.noiBat = 1 AND sp.idDanhMuc = ? order by sp.idSanPham DESC LIMIT ?, ?',[idDanhMuc,from,to])
    return rows
}
const viewProductGiamDan = async (idDanhMuc,from,to) =>{
    const [rows] = await pool.execute
    ('SELECT * FROM sanpham sp, danhmuc dm WHERE sp.idDanhMuc = dm.idDanhMuc AND sp.idDanhMuc = ? order by sp.gia DESC LIMIT ?, ?',[idDanhMuc,from,to])
    return rows
}
const viewProductTangDan = async (idDanhMuc,from,to) =>{
    const [rows] = await pool.execute
    ('SELECT * FROM sanpham sp, danhmuc dm WHERE sp.idDanhMuc = dm.idDanhMuc AND sp.idDanhMuc = ? order by sp.gia ASC LIMIT ?, ?',[idDanhMuc,from,to])
    return rows
}
const viewProductKhuyenMai = async (idDanhMuc,from,to) =>{
    const [rows] = await pool.execute
    ('SELECT * FROM sanpham sp, danhmuc dm WHERE sp.idDanhMuc = dm.idDanhMuc AND sp.idDanhMuc = ? order by sp.khuyenMai DESC LIMIT ?, ?',[idDanhMuc,from,to])
    return rows
}
const viewProductBanChay = async (idDanhMuc,from,to) =>{
    const [rows] = await pool.execute
    ('SELECT *,sum(ct.soLuong) FROM donhang dh, chitietdonhang ct, sanpham sp, danhmuc dm WHERE dh.idDonHang = ct.idDonHang AND ct.idSanPham = sp.idSanPham AND sp.idDanhMuc = dm.idDanhMuc AND dm.idDanhMuc = ? AND  (dh.trangThai = 1 OR dh.trangThai = 2)GROUP BY sp.idSanPham ORDER BY sum(ct.soLuong) DESC LIMIT ?,?'
   ,[idDanhMuc,from,to]);
    return rows
}
const bannerProductBanChay = async () =>{
    const [rows] = await pool.execute
    ('SELECT *,sum(ct.soLuong) FROM donhang dh, chitietdonhang ct, sanpham sp, danhmuc dm WHERE dh.idDonHang = ct.idDonHang AND ct.idSanPham = sp.idSanPham AND sp.idDanhMuc = dm.idDanhMuc AND  (dh.trangThai = 1 OR dh.trangThai = 2)GROUP BY sp.idSanPham ORDER BY sum(ct.soLuong) DESC LIMIT 6');
    return rows
}
const bannerProductNoiBat = async () =>{
    const [rows] = await pool.execute
    ('SELECT * FROM sanpham sp, danhmuc dm WHERE sp.idDanhMuc = dm.idDanhMuc AND sp.noiBat = 1 order by sp.idSanPham DESC LIMIT 6')
    return rows
}
const bannerProductKhuyenMai = async () =>{
    const [rows] = await pool.execute
    ('SELECT * FROM sanpham sp, danhmuc dm WHERE sp.idDanhMuc = dm.idDanhMuc order by sp.khuyenMai DESC LIMIT 6')
    return rows
}
const searchProduct = async (tenSanPham) =>{
    const [rows] = await pool.execute
    ('SELECT sp.tenSanPham, sp.gia,sp.khuyenMai,sp.idSanPham,sp.hinhAnh FROM sanpham sp  WHERE MATCH(tenSanPham) against(? IN BOOLEAN mode)',[tenSanPham])
    return rows
}

export default{
    getAllProduct,
    detailProduct,
    detailProduct1,
    insertProduct,
    insertImagesProduct,
    updateProduct,
    deleteProduct,
    getDetailImagesProduct,
    deleteImagesProduct,
    getIdDetailImagesProduct,
    viewProduct,
    countProduct,
    viewProductSortNoiBat,
    viewProductGiamDan,
    viewProductTangDan,
    viewProductKhuyenMai,
    viewProductBanChay,

    bannerProductBanChay,
    bannerProductNoiBat,
    bannerProductKhuyenMai,

    searchProduct,

}