import pool from './../config/connectDB'

const getAllCategory = async () => {
    const [rows] = await pool.execute
    ('SELECT * FROM danhmuc ORDER BY idDanhMuc DESC')
    return rows
}
const detailCategory = async (idDanhMuc) => {
    const [rows] = await pool.execute
    ('SELECT * FROM danhmuc WHERE idDanhMuc = ?',[idDanhMuc])
    return rows[0]
}
const insertCategory = async (tenDanhMuc) => {
    await pool.execute('INSERT INTO danhmuc (tenDanhMuc) VALUES (?)',[tenDanhMuc]);
}
const deleteCategory = async (idDanhMuc) => {
    await pool.execute('DELETE FROM danhmuc WHERE idDanhMuc = ?',[idDanhMuc]);
}
const updateCategory = async (tenDanhMuc,idDanhMuc) => {
    await pool.execute('UPDATE danhmuc SET tenDanhMuc = ? WHERE idDanhMuc = ?',[tenDanhMuc,idDanhMuc]);
}
export default {
    getAllCategory,
    insertCategory,
    deleteCategory,
    detailCategory,
    updateCategory
}