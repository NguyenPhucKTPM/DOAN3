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
const insertProduct = async (tenSanPham,idDanhMuc,gia,khuyenMai,hinhAnh,noiBat,moTa,fileName) => {
    const[result] = await pool.execute('INSERT INTO sanpham (tenSanPham,idDanhMuc,gia,khuyenMai,hinhAnh,noiBat,moTa,fileName) VALUES (?,?,?,?,?,?,?,?)'
    ,[tenSanPham,idDanhMuc,gia,khuyenMai,hinhAnh,noiBat,moTa,fileName]);
    const idSanPham = result.insertId;
    // console.log('idSanPham',idSanPham);
    return idSanPham
}
const insertImagesProduct = async (idSanPham,tenHinh,hinhAnhPhu) =>{
 await pool.execute('INSERT INTO hinhsanpham (idSanpham,tenHinh,hinhAnhPhu)  VALUES (?,?,?)',[idSanPham,tenHinh,hinhAnhPhu])
}
const updateProduct = async (tenSanPham,idDanhMuc,gia,khuyenMai,hinhAnh,noiBat,moTa,fileName,idSanPham) => {
    await pool.execute('UPDATE sanpham SET tenSanPham = ?,idDanhMuc = ?,gia = ?,khuyenMai = ?,hinhAnh = ?,noiBat = ?,moTa = ?,fileName = ? WHERE idSanPham = ?'
    ,[tenSanPham,idDanhMuc,gia,khuyenMai,hinhAnh,noiBat,moTa,fileName,idSanPham]);
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
const viewProduct = async (idDanhMuc) =>{
    const [rows] = await pool.execute
    ('SELECT * FROM sanpham,danhmuc WHERE sanpham.idDanhMuc = danhmuc.idDanhMuc AND danhmuc.idDanhMuc = ? ORDER BY idSanPham DESC',[idDanhMuc])
    return rows
}
export default{
    getAllProduct,
    detailProduct,
    insertProduct,
    insertImagesProduct,
    updateProduct,
    deleteProduct,
    getDetailImagesProduct,
    deleteImagesProduct,
    getIdDetailImagesProduct,
    viewProduct
}