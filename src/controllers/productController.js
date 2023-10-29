import express from "express";
import productModel from "../services/productModel";
const cloudinary = require('cloudinary').v2;


//admin
const getAllProduct = async (req, res) => {
    let listProduct = await productModel.getAllProduct()
    return res.render('admin', { data: { title: 'Danh sách sản phẩm', page: 'product/listProduct', rows: listProduct, getUrl: req.url } });
}
const detailProduct = async (req, res) => {
    let id = req.params.idSanPham
    let detailProduct = await productModel.detailProduct(id)
    return res.render('admin', { data: { title: 'Chi tiết sản phẩm', page: 'product/detailProduct', rows: detailProduct, getUrl: req.url } });
}
const createProduct = (req, res) => {
    return res.render('admin', { data: { title: 'Thêm sản phẩm', page: 'product/createProduct', getUrl: req.url } });
}
const insertProduct = async (req, res) => {
    let { tenSanPham, idDanhMuc, khuyenMai, noiBat, moTa } = req.body;
    const hinhAnh = req.files['hinhAnh'];
    let gia = req.body.gia.replace(/\./g, '');
    if (!tenSanPham || !idDanhMuc || !gia || !noiBat || !moTa || !hinhAnh) {
        if (hinhAnh) cloudinary.uploader.destroy(hinhAnh[0].filename)
        return res.render("admin", { data: { title: "Thêm thất bại", page: 'product/createProduct', error: "Thông tin sản phẩm không được bỏ trống", getUrl: req.url } })
    }
    const insertProduct = await productModel.insertProduct(tenSanPham, idDanhMuc, gia, khuyenMai, hinhAnh[0].path, noiBat, moTa, hinhAnh[0].filename)
    //them hinh phu
    const hinhAnhPhu = req.files['hinhAnhPhu'];
    if (hinhAnhPhu && Array.isArray(hinhAnhPhu)) {
        for (const file of hinhAnhPhu) {
            let tenHinh = file.filename;
            let hinhAnhPhu = file.path;
            await productModel.insertImagesProduct(insertProduct, tenHinh, hinhAnhPhu);
        }
    }
    return res.render("admin", { data: { title: "Thêm thành công", page: 'product/createProduct', noti: `Thêm sản phẩm thành công: ${tenSanPham} `, getUrl: req.url } })
}
const editProduct = async (req, res) => {
    let id = req.params.idSanPham
    let detailProduct = await productModel.detailProduct(id)
    let listImages = await productModel.getDetailImagesProduct(id)
    return res.render('admin', { data: { title: 'Cập nhật sản phẩm', page: 'product/updateProduct', rows: detailProduct, list: listImages, getUrl: req.url } });
}
const updateProduct = async (req, res) => {
    let { tenSanPham, idDanhMuc, khuyenMai, hinhAnhCu, noiBat, moTa, fileName, idSanPham } = req.body;
    let gia = req.body.gia.replace(/\./g, '');
    // truong hop co file moi dc up lien
    if (req.files['hinhAnh']) {
        const hinhAnh = req.files['hinhAnh'];
        cloudinary.uploader.destroy(fileName)
        await productModel.updateProduct(tenSanPham, idDanhMuc, gia, khuyenMai, hinhAnh[0].path, noiBat, moTa, hinhAnh[0].filename, idSanPham)
        if (req.files['hinhAnhPhu']) {
            const hinhAnhPhu = req.files['hinhAnhPhu'];
            for (const file of hinhAnhPhu) {
                let tenHinh = file.filename;
                let hinhAnhPhu = file.path;
                await productModel.insertImagesProduct(idSanPham, tenHinh, hinhAnhPhu)
            }
        }
        res.redirect('/list-product')
    }
    if (req.files['hinhAnhPhu']) {
        const hinhAnhPhu = req.files['hinhAnhPhu'];
        for (const file of hinhAnhPhu) {
            let tenHinh = file.filename;
            let hinhAnhPhu = file.path;
            await productModel.insertImagesProduct(idSanPham, tenHinh, hinhAnhPhu)
        }
        res.redirect('/list-product')
    }
    //nguoc lai ko co file up len
    if (!req.files['hinhAnh'] && !req.files['hinhAnhPhu']) {
        await productModel.updateProduct(tenSanPham, idDanhMuc, gia, khuyenMai, hinhAnhCu, noiBat, moTa, fileName, idSanPham)
        res.redirect('/list-product')
    }
}
const deleteProduct = async (req, res) => {
    let id = req.params.idSanPham
    let detailProduct = await productModel.detailProduct(id)
    let listImages = await productModel.getDetailImagesProduct(id)
    for (let i = 0; i < listImages.length; i++) {
        cloudinary.uploader.destroy(listImages[i].tenHinh)
    }
    cloudinary.uploader.destroy(detailProduct.fileName)
    await productModel.deleteProduct(id)
    res.redirect('/list-product')
}
//user
const viewProduct = async (req, res) => {
    let idDanhMuc = req.params.idDanhMuc
    let tenDanhMuc = req.params.tenDanhMuc
    let productPhone = await productModel.viewProduct(idDanhMuc)
    return res.render("index", { data: { title: `Sản phẩm theo danh mục: ${tenDanhMuc}`, page: 'product/viewProduct', rows: productPhone, getUrl: req.url } })
}
const viewDetailProduct = async (req, res) => {
    let idSanPham = req.params.idSanPham
    let tenSanPham = req.params.tenSanPham
    let detailProduct = await productModel.detailProduct(idSanPham)
    return res.render("index", { data: { title: "Chi tiết sản phẩm", page: 'product/viewDetailProduct', rows: detailProduct, getUrl: req.url } })
}
const deleteImagesProduct = async (req, res) => {
    let idHinhAnhPhu = req.params.idHinhAnhPhu
    let idSanPham = req.params.idSanPham
    let detailImage = await productModel.getIdDetailImagesProduct(idHinhAnhPhu)
    await productModel.deleteImagesProduct(idHinhAnhPhu)
    cloudinary.uploader.destroy(detailImage[0].tenHinh)
    res.redirect(`/edit-product/${idSanPham}`)
}

export default {
    getAllProduct,
    detailProduct,
    createProduct,
    insertProduct,
    editProduct,
    updateProduct,
    deleteProduct,
    viewProduct,
    viewDetailProduct,
    deleteImagesProduct
}