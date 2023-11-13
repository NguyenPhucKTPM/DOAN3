import pool from './../config/connectDB'

const getAllSlide = async () => {
    const [rows] = await pool.execute
    ('SELECT * FROM slide ORDER BY idSlide DESC')
    return rows
}
const detailSlide = async (idSlide) => {
    const [rows] = await pool.execute
    ('SELECT * FROM slide WHERE idSlide = ?',[idSlide])
    return rows[0]
}
const insertSlide = async (tenSlide,hinhSlide,duongDan) => {
    await pool.execute('INSERT INTO slide (tenSlide,hinhSlide,duongDan) VALUES (?,?,?)',[tenSlide,hinhSlide,duongDan]);
}
const deleteSlide = async (idSlide) => {
    await pool.execute('DELETE FROM slide WHERE idSlide = ?',[idSlide]);
}
const updateSlide = async (tenSlide,hinhSlide,duongDan,idSlide) => {
    await pool.execute('UPDATE slide SET tenSlide = ?,hinhSlide = ?,duongDan =? WHERE idSlide = ?',[tenSlide,hinhSlide,duongDan,idSlide]);
}
export default {
    getAllSlide,
    detailSlide,
    insertSlide,
    deleteSlide,
    updateSlide
   
}