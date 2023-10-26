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
const insertProduct = async (tenSanPham,idDanhMuc,gia,khuyenMai,hinhAnh,noiBat,moTa) => {
    await pool.execute('INSERT INTO sanpham (tenSanPham,idDanhMuc,gia,khuyenMai,hinhAnh,noiBat,moTa) VALUES (?,?,?,?,?,?,?)'
    ,[tenSanPham,idDanhMuc,gia,khuyenMai,hinhAnh,noiBat,moTa]);
}
const updateProduct = async (tenSanPham,idDanhMuc,gia,khuyenMai,hinhAnh,noiBat,moTa,idSanPham) => {
    await pool.execute('UPDATE sanpham SET tenSanPham = ?,idDanhMuc = ?,gia = ?,khuyenMai = ?,hinhAnh = ?,noiBat = ?,moTa = ? WHERE idSanPham = ?'
    ,[tenSanPham,idDanhMuc,gia,khuyenMai,hinhAnh,noiBat,moTa,idSanPham]);
}
const deleteProduct = async (idSanPham) => {
    await pool.execute('DELETE FROM sanpham WHERE idSanPham = ?',[idSanPham]); 
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
    updateProduct,
    deleteProduct,
    viewProduct
}