import express from "express";
import categoryModel from "../services/categoryModel";

const getAllCategory = async (req, res) =>{
    let listCategory = await categoryModel.getAllCategory()
    return res.render('admin',{data:{title:'Danh sách danh mục',page:'category/listCategory',rows:listCategory,getUrl: req.url} });
}
const createCategory =  (req, res) =>{
    return res.render('admin',{data:{title:'Thêm danh mục',page:'category/createCategory',getUrl: req.url} });
}
const insertCategory = async (req, res) =>{
    let {tenDanhMuc} = req.body;
    if(!tenDanhMuc) return res.render("admin",{data:{title:"Thêm thất bại",page:'category/createCategory', error:"Tên danh mục không được bỏ trống",getUrl:req.url} })
    await categoryModel.insertCategory(tenDanhMuc)
    return res.render("admin",{data:{title:"Thêm thành công",page:'category/createCategory', noti:`Thêm danh mục thành công: ${tenDanhMuc} `,getUrl:req.url} })
}
const deleteCategory = async (req, res) =>{
    let id = req.params.idDanhMuc
    // console.log(id);
    await categoryModel.deleteCategory(id)
    res.redirect('/list-category')
}
const detailCategory = async (req, res) =>{
    let id = req.params.idDanhMuc
    // console.log(id);
    let detailCategory = await categoryModel.detailCategory(id)
    return res.render('admin',{data:{title:'Chi tiết danh mục',page:'category/detailCategory',rows:detailCategory,getUrl: req.url} });
}
const editCategory = async (req, res) =>{
    let id = req.params.idDanhMuc
    let detailCategory = await categoryModel.detailCategory(id)
    return res.render('admin',{data:{title:'Cập nhật danh mục',page:'category/updateCategory',rows:detailCategory,getUrl: req.url} });
}
const updateCategory = async (req, res) =>{
    let {tenDanhMuc,idDanhMuc} = req.body
    await categoryModel.updateCategory(tenDanhMuc,idDanhMuc)
    res.redirect('/list-category')
}
export default {
    getAllCategory,
    createCategory,
    insertCategory,
    deleteCategory,
    detailCategory,
    editCategory,
    updateCategory
}