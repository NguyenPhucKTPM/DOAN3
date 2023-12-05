import express from "express";
import slideModel from "../services/slideModel";
const cloudinary = require('cloudinary').v2;

const getAllSlide = async (req, res) => {
    let listSlide = await slideModel.getAllSlide()
    return res.render('admin', { data: { title: 'Danh sách slide', page: 'slide/listSlide', rows: listSlide, getUrl: req.url } });
}
const createSlide = (req, res) => {
    return res.render('admin', { data: { title: 'Thêm slide', page: 'slide/createSlide', getUrl: req.url } })
}
const insertSlide = async (req, res) => {
    let { duongDan } = req.body;
    if (!duongDan) { duongDan = '' }
    if (req.file) {
        const hinhSlide = req.file;
        await slideModel.insertSlide(hinhSlide.filename, hinhSlide.path, duongDan)
        return res.render('admin', { data: { title: 'Thêm slide', page: 'slide/createSlide', noti: 'Thêm slide thành công', getUrl: req.url } })
    }
    else {
        return res.render('admin', { data: { title: 'Thêm slide', page: 'slide/createSlide', error: 'Hình không được để chống', getUrl: req.url } })
    }
}
const deleteSlide = async (req, res) => {
    let id = req.params.idSlide
    let detailSlide = await slideModel.detailSlide(id)
    await slideModel.deleteSlide(id)
    cloudinary.uploader.destroy(detailSlide.tenSlide)
    res.redirect('/list-slide')
}
const editSlide = async (req, res) => {
    let idSlide = req.params.idSlide
    let detailSlide = await slideModel.detailSlide(idSlide)
    return res.render('admin', { data: { title: 'Cập nhật slide', page: 'slide/updateSlide', rows: detailSlide, getUrl: req.url } })
}
const updateSlide = async (req, res) => {
    let { tenSlide, hinhSlide, duongDan, idSlide } = req.body
    if (req.file) {
        const hinhMoi = req.file;
        cloudinary.uploader.destroy(tenSlide)
        await slideModel.updateSlide(hinhMoi.filename, hinhMoi.path, duongDan, idSlide)
        res.redirect('/list-slide')
    }
    else {
        await slideModel.updateSlide(tenSlide, hinhSlide, duongDan, idSlide)
        res.redirect('/list-slide')
    }

}
export default {
    getAllSlide,
    createSlide,
    insertSlide,
    deleteSlide,
    editSlide,
    updateSlide
}